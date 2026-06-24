# PhysX-Omni 论文精读：第 1 步 - 开源代码、数据资产与主流程对齐

本 notebook 是论文精读的第一章，目标不是先复述论文全文，而是先把“论文说的系统”落到我们已经下载和跑通的真实材料上：GitHub 代码、Hugging Face 模型、PhysXVerse 数据集、官方 demo 复现产物，以及用户 M&M 罐子图片的测试结果。

核心结论先放前面：PhysX-Omni 已开源，代码、模型权重和数据集都能访问并已下载到 4090；官方三步推理链路已经在 4090 跑通，产生了 VLM 结构化理解、分部 voxel/RLE、TRELLIS 解码的 textured mesh，以及最终 URDF/XML。


## 0. 本章阅读对象

| 类型 | 地址 / 路径 | 本章用途 |
|---|---|---|
| 论文 abs | <https://arxiv.org/abs/2605.21572v1> | 论文版本锚点，后续章节按 v1 精读 |
| 论文 HTML | <https://arxiv.org/html/2605.21572> | 在线阅读入口 |
| 项目页 | <https://physx-omni.github.io/> | 方法展示、视频/示例入口 |
| GitHub | <https://github.com/physx-omni/PhysX-Omni> | 代码主流程、脚本、benchmark、dataset 预处理 |
| 模型权重 | <https://huggingface.co/PhysX-Omni/PhysX-Omni> | VLM 推理模型，已下载到 4090 |
| 数据集 | <https://huggingface.co/datasets/PhysX-Omni/PhysXVerse> | 训练/评测资产，已下载到 4090 |
| 4090 根目录 | `/data/light/repro/physx_omni_2605_21572` | 远端代码、模型、数据和复现输出，约 123G |
| 本地复现输出 | `C:/Users/robot/physx_outputs` | 已同步的官方 demo 和 M&M 图片测试结果 |

后续章节会继续深入：论文方法细节、RLE 表示、VLM prompt/解析、TRELLIS 解码、URDF/XML 生成、benchmark 设计和自定义图片失败案例分析。本章只把“所有东西在哪里、怎么连起来”讲清楚。


```python
from pathlib import Path
import json

workspace = Path(r"C:\Users\robot\Documents\成长学习库")
outputs = Path(r"C:\Users\robot\physx_outputs")

print("workspace:", workspace)
print("outputs exists:", outputs.exists())
print("top-level outputs:")
for p in sorted(outputs.iterdir()):
    kind = "dir" if p.is_dir() else "file"
    size = p.stat().st_size if p.is_file() else ""
    print(f"- {p.name:45s} {kind:4s} {size}")
```


## 1. 论文主张先用一句话落地

PhysX-Omni 要解决的问题是：给一张物体图片，不只生成“看起来像”的 3D 模型，而是生成可以进模拟器的物理资产。这个物理资产包含：

| 层级 | 论文目标 | 在代码/产物里的落点 |
|---|---|---|
| 视觉外观 | 图片条件下的 3D 几何与纹理 | `objs/<part>/<part>.glb`、`.obj`、`material_0.png` |
| 部件结构 | 物体被拆成哪些可解释部件 | `basic_info.txt`、`basic_info.json` 里的 `parts` |
| 物理属性 | 材质、密度、Young's Modulus、Poisson's Ratio | `basic_info.json` 每个 part 的字段 |
| 运动关系 | 哪些部件相对哪个 group，有旋转/滑动等关节 | `basic_info.json` 的 `group_info`，再写入 URDF/XML |
| 仿真格式 | 能被机器人/物理仿真读入 | `basic.urdf`、`basic.xml` |

这也是为什么它比普通 image-to-3D 更重：它不是只追求 mesh，而是把“部件、物理、关节、仿真文件”作为第一等输出。


## 2. 开源代码的真实结构

远端 GitHub checkout 位于：

```text
/data/light/repro/physx_omni_2605_21572/code/PhysX-Omni
```

我们重点关心的文件不是所有子模块，而是这几条主线：

| 文件/目录 | 角色 | 为什么重要 |
|---|---|---|
| `README.md` | 官方复现说明 | 明确官方推理顺序：`1vlm_demo.py` -> `2infer_geo.py` -> `3jsongen_update.py` |
| `1vlm_demo.py` | VLM 推理与 RLE/voxel 解析 | 从单图得到物体信息、parts、group_info、每个 part 的 64³ voxel 坐标 |
| `2infer_geo.py` | 批量几何解码调度 | 遍历输出 case，调用 `decoder_each.py` 生成每个部件的几何 |
| `decoder_each.py` | TRELLIS image-to-3D 解码 | 读取 `ind_*.npy/allind.npy`，调用 TRELLIS decoder，导出 GLB/OBJ |
| `3jsongen_update.py` | 仿真资产装配 | 读取 VLM 结构与 mesh，生成 `basic_info.json`、`basic.urdf`、`basic.xml` |
| `dataset/` | 训练数据预处理 | 把 PhysXVerse/PhysXNet/PhysX-Mobility 变成 VLM 可学习的文本和 voxel/RLE 表示 |
| `benchmark/` | PhysX-Bench | 评估生成资产的物理/结构正确性，不只是视觉质量 |
| `applications_scene/` | 场景生成扩展 | 把对象进一步放入场景管线，非本章重点 |


## 3. 官方推理链路：从图片到 URDF/XML

官方 README 给出的推理命令很短：

```bash
python 1vlm_demo.py       # vlm inference
python 2infer_geo.py      # decoder inference
python 3jsongen_update.py # convert to URDF & XML
```

但这三步背后的数据流比较长。可以按下面理解：

```text
输入图片
  |
  v
1vlm_demo.py
  - Qwen2.5-VL 读取图片
  - 生成 object/category/dimension
  - 生成 parts: name/material/density/affordance/elastic params
  - 生成 group_info: 部件层级和关节/运动参数
  - 生成每个 part 的 64^3 voxel 占用，文本中使用 RLE/模板压缩
  - 解析成 ind_0.npy, ind_1.npy, ..., allind.npy
  |
  v
2infer_geo.py -> decoder_each.py
  - 读取 allind.npy 和每个 part 的 ind_*.npy
  - 调用 TRELLIS image-to-3D decoder
  - 每个 part 输出 textured mesh / gaussian，再合成 GLB/OBJ
  |
  v
3jsongen_update.py
  - 读取 basic_info.txt + objs/<part>/*
  - 对齐几何、物理属性和 group_info
  - 生成 basic_info.json
  - 写出 basic.urdf 和 basic.xml
```

记忆方式：`1vlm` 负责“看图并写结构化说明”，`2infer_geo` 负责“把稀疏部件体素变成可见几何”，`3jsongen` 负责“把几何和物理关系打包成仿真资产”。


## 4. `1vlm_demo.py`：最关键的语义到结构步骤

这一段是 PhysX-Omni 和普通 3D 生成方法差异最大的地方。

它不是让 VLM 只输出一句 caption，而是让 VLM 同时输出两类东西：

| 输出 | 文件 | 用途 |
|---|---|---|
| 物体全局信息 | `basic_info.txt` | object name、category、dimension、parts、group_info |
| 每个部件 voxel 文本 | `coord_0.txt` 等 | VLM 生成的压缩体素表示，后续解析 |
| 每个部件稀疏坐标 | `ind_0.npy` 等 | 解析后的 64³ 占用坐标 |
| 全部部件坐标 | `allind.npy` | TRELLIS decoder 一次性解码多个 part 时使用 |
| 可视化点云 | `ind_*.ply`、`allind.ply` | 快速检查 VLM 体素输出是否有形状 |

代码里能看到一套 RLE/模板解析函数，例如 `runs_to_compact_str`、`compact_str_to_runs`、`string_to_runs_by_z_lossless_robust`。这说明论文里的“compact physical/geometry representation”在实现里落成了按 z-layer 组织的 run-length voxel 文本。这样做的直接动机是：VLM 很难直接输出 64×64×64 的完整体素数组，但可以输出压缩后的文本，再由代码严格解析回 numpy 坐标。


## 5. `2infer_geo.py` + `decoder_each.py`：从稀疏 voxel 到 textured mesh

`2infer_geo.py` 本身更像调度器：它枚举每个 case，统计 `ind_*.npy` 数量，然后调用 `decoder_each.py`。

真正重的部分在 `decoder_each.py`：

| 动作 | 说明 |
|---|---|
| 加载 `TrellisImageTo3DPipeline.from_pretrained("microsoft/TRELLIS-image-large")` | 使用 TRELLIS 作为 3D 解码器 |
| 读取 `allind.npy` | 把 VLM 输出的全部 part voxel 拼成 decoder 条件 |
| 读取 `ind_*.npy` | 知道每个 part 在 allind 里的切片范围 |
| `pipeline.run_decoder(...)` | 生成 mesh / gaussian 等 3D 表示 |
| `postprocessing_utils.to_glb(...)` | 把 gaussian + mesh 合成 textured GLB |
| 导出 `.glb` 和 `.obj` | 后续 URDF/XML 引用这些部件几何 |

我们在 4090 上复现时做过两个质量/可运行性修补：

1. 允许 `DINO_LOCAL_REPO` 指向本地 DINOv2 cache，避免运行时在线拉取失败。
2. 将 decoder 输出格式限制为 `mesh + gaussian`，因为默认同时生成 `radiance_field` 在 24GB RTX 4090 上容易 OOM，而 `to_glb()` 实际只需要 mesh 和 gaussian。

这两个修补不改变论文方法，只是把官方流程在本机资源约束下稳定跑完。


## 6. `3jsongen_update.py`：从生成部件到仿真资产

`3jsongen_update.py` 是容易被忽略、但对“simulation-ready”很关键的一步。它把前两步的输出整理成仿真可读资产：

| 输入 | 输出 |
|---|---|
| `basic_info.txt` | `basic_info.json` |
| `objs/<part>/<part>.obj` / `.glb` | URDF/XML 中的 mesh 引用 |
| parts 的 material/density/elastic params | URDF/XML 或中间 JSON 的物理属性 |
| `group_info` 的层级/关节参数 | URDF/MuJoCo XML 的 link/joint 结构 |

官方 demo 生成的 `basic_info.json` 里，`parts` 不只是名称，还包含 material、density、priority_rank、Young's Modulus、Poisson's Ratio。`group_info` 则表达类似“某个部件相对 group_0 是 C 类型关节，方向/轴位置/范围是什么”。这一步是论文标题里 “Rigid, Deformable, and Articulated Objects” 的工程落点。


```python
import json
from pathlib import Path

info_path = Path(r"C:\Users\robot\physx_outputs\official_demo_full\basic_info.json")
info = json.loads(info_path.read_text(encoding="utf-8"))
print("object_name:", info.get("object_name"))
print("category:", info.get("category"))
print("dimension:", info.get("dimension"))
print("parts:", len(info.get("parts", [])))
print("groups:", len(info.get("group_info", {})))
print("\nfirst 3 parts:")
for part in info.get("parts", [])[:3]:
    print({k: part.get(k) for k in ["label", "name", "material", "density", "Young's Modulus (GPa)", "Poisson's Ratio"]})
```


## 7. 已下载的数据资产怎么分工

4090 上当前核心资产位于：

```text
/data/light/repro/physx_omni_2605_21572
```

资产分工如下：

| 资产 | 远端路径 | 用途 | 当前状态 |
|---|---|---|---|
| GitHub 代码 | `/data/light/repro/physx_omni_2605_21572/code/PhysX-Omni` | 官方脚本、TRELLIS 子模块、benchmark、dataset 预处理 | 已下载，已用于复现 |
| VLM 模型 | `/data/light/repro/physx_omni_2605_21572/hf/PhysX-Omni-model` | `1vlm_demo.py` 的 Qwen2.5-VL 权重 | 已下载，包含 4 个 safetensors shard |
| PhysXVerse 数据集 | `/data/light/repro/physx_omni_2605_21572/hf/PhysXVerse-dataset` | 论文数据资产/训练数据参考 | 已下载，包含分片 zip |
| 官方 demo 输出 | `/data/light/repro/physx_omni_2605_21572/repro_runs/vlm_full/...` | 端到端复现证据 | 已同步本地 |
| 用户 M&M 图输出 | `/data/light/repro/physx_omni_2605_21572/repro_runs/user_mms_yellow*` | 自定义图片质量分析 | 已跑 VLM/RLE；body-focus 更好，mesh 待继续 |
| 本地输出 | `C:/Users/robot/physx_outputs` | 便于 notebook 展示和交付 | 已同步 |

注意：PhysXVerse 是训练/数据理解资产；当前复现官方 demo 不需要重新训练，只使用了已经发布的 PhysX-Omni VLM 权重和 TRELLIS decoder。


```python
from pathlib import Path
import json

summary_paths = {
    "official_demo_full": Path(r"C:\Users\robot\physx_outputs\official_demo_full\repro_summary.json"),
    "mms_yellow_original": Path(r"C:\Users\robot\physx_outputs\mms_yellow\repro_summary.json"),
    "mms_yellow_body_focus": Path(r"C:\Users\robot\physx_outputs\mms_yellow_body_focus\repro_summary.json"),
}

for name, path in summary_paths.items():
    print("\n##", name)
    data = json.loads(path.read_text(encoding="utf-8"))
    print("status:", data.get("status"))
    print("mode:", data.get("mode"))
    print("detected_parts:", data.get("detected_parts"))
    print("total_voxels:", data.get("total_voxels"))
    print("elapsed_sec:", data.get("elapsed_sec"))
    counts = [(p["part"], p.get("voxel_count", 0)) for p in data.get("parts", [])]
    print("part voxel counts:", counts)
```


## 8. 官方 demo 复现结果：质量门槛已经过了

官方 demo 的本地同步目录：

```text
C:/Users/robot/physx_outputs/official_demo_full
```

关键结果：

| 项 | 结果 |
|---|---|
| VLM/RLE 状态 | success |
| 推理模式 | 4bit |
| 检测部件数 | 7 |
| 总 voxel 数 | 22031 |
| 输出 mesh | `objs/0` 到 `objs/6`，每个 part 有 `.glb`、`.obj`、`material_0.png` |
| 仿真资产 | `basic.urdf`、`basic.xml`、`basic_info.json` |
| 交付 zip | `C:/Users/robot/physx_outputs/physx_omni_official_demo_full_repro.zip` |

下面这张图是 7 个 part 的本地预览，不是论文图，是我们本轮复现后从输出资产生成的检查图。

![official 7-part mesh preview](C:/Users/robot/physx_outputs/official_demo_full/official_7part_mesh_preview.png)


## 9. 用户 M&M 罐子图片：为什么第一次看起来“矮”

用户提供的原图是一个比较高的黄色 M&M 罐子，但第一次直接输入原图时，VLM/RLE 输出只有 `part2 Jar Lid` 非空，其他 part voxel 为 0。因此后续低显存 mesh 解码看到的主要是“盖子/上部”，自然会显得矮。这不是最终显示比例的问题，而是前面 VLM 分部体素没把罐身稳定生成出来。

第一次原图结果：

| 项 | 结果 |
|---|---|
| 检测部件 | 4 |
| 总 voxel | 2237 |
| 非空部件 | 只有 part2 |
| 解释 | 画面视角偏俯视、品牌图案显眼，模型把重点放到了 lid/顶部区域 |

随后我们做了 body-focus 裁剪，把罐身作为主体输入，结果明显改善：

| 项 | 原图 | body-focus 裁剪 |
|---|---:|---:|
| 检测部件 | 4 | 4 |
| 总 voxel | 2237 | 6188 |
| 非空部件 | 1 个 | 3 个 |
| 罐身 | 0 | 2866 voxels |
| 盖子 | 2237 | 1759 voxels |
| 颈/肩部 | 0 | 1563 voxels |

这说明当前自定义图的主要问题不是环境没跑通，而是单图输入条件对 VLM 结构分解影响很大。下一步如果要把这个罐子做成更像“高罐”的资产，应优先继续 body-focus 版本的 mesh 解码，而不是沿用第一次原图的 part2 lid mesh。

![M&M preprocessing contact sheet](C:/Users/robot/physx_outputs/mms_yellow_preprocessed/contact_sheet.jpg)

![M&M body-focus voxel projection](C:/Users/robot/physx_outputs/mms_yellow_body_focus/voxel_projection.png)


## 10. 训练数据管线：为什么 dataset 脚本存在

官方 README 的训练部分提到 PhysXNet、PhysX-Mobility、PhysXVerse 三类数据。我们本章不重新训练，但需要理解 `dataset/` 的作用：它告诉我们论文里的训练样本大概怎么构造。

| 脚本 | 作用 | 对论文理解的帮助 |
|---|---|---|
| `dataset/1voxel_verse.py` | 从 PhysXVerse 的 part obj/json 生成 64³ voxel 和规范化几何 | 说明模型学习的几何监督不是完整 mesh 文本，而是稀疏 voxel 表示 |
| `dataset/2encode_representation_64_finetune.py` | 把 JSON 物理标注转成文本训练样本 | 说明 VLM 被训练成输出 name/category/parts/group_info 等结构化文本 |
| `dataset/3generate_data_new_64_finetune_rle.py` | 把 voxel 层压缩成 RLE/模板文本 | 解释为什么 `1vlm_demo.py` 里有大量 RLE 解析函数 |

换句话说，PhysX-Omni 的训练不是“输入图片，直接吐 mesh”。更准确地说，它训练 VLM 先吐出一种可解析、可约束的中间表示；几何细节再交给 decoder。


## 11. 论文方法与代码主流程的一一对应

| 论文概念 | 代码位置 | 实际产物 | 当前复现证据 |
|---|---|---|---|
| Unified physical 3D generation | `1vlm_demo.py` + `2infer_geo.py` + `3jsongen_update.py` | 从单图到 URDF/XML | 官方 demo 已完整跑通 |
| Physical attributes | `basic_info.txt/json` 解析与生成 | material、density、elastic params | `basic_info.json` 可见 |
| Articulated object structure | `group_info` 与 URDF/XML 写入 | link/joint 层级 | `basic.urdf`、`basic.xml` 已生成 |
| Part-level geometry | `ind_*.npy`、`allind.npy`、TRELLIS decoder | 每个部件 GLB/OBJ | `objs/0..6` 已生成 |
| Compact voxel/RLE representation | `runs_*` / `string_to_runs_*` | `coord_*.txt` -> `ind_*.npy` | 官方 demo 7 个部件都有 voxel |
| Dataset construction | `dataset/*.py` | voxel、text、RLE 训练样本 | PhysXVerse 已下载 |
| Benchmark | `benchmark/` | 评估脚本 | 后续章节再细读 |


## 12. 本章结论与下一步

本章可以先形成三个稳定判断：

1. **开源状态明确**：GitHub 代码、Hugging Face 模型、PhysXVerse 数据都已经可用，并且我们已下载到 4090。
2. **官方复现链路已闭环**：`1vlm_demo.py -> 2infer_geo.py -> 3jsongen_update.py` 已在 4090 上跑出明确输出，包括 7 个 textured part mesh 和 URDF/XML。
3. **自定义 M&M 图的问题已定位**：第一次图像主要生成了盖子，导致看起来矮；body-focus 裁剪后罐身、盖子、肩部都有非空 voxel，下一步应继续对 body-focus 输出做 TRELLIS mesh 解码和 URDF/XML 装配。

建议下一章继续做“论文方法精读 + 代码逐段对照”：

| 章节 | 建议内容 |
|---|---|
| 第 2 章 | 精读论文 abstract/introduction，明确它相对 image-to-3D / PhysX-Anything / TRELLIS 的增量 |
| 第 3 章 | 深读中间表示：parts、group_info、RLE voxel、64³ 网格为什么这样设计 |
| 第 4 章 | 逐段讲 `1vlm_demo.py` prompt、解析、容错和失败模式 |
| 第 5 章 | 讲 TRELLIS decoder 在这里承担什么，不承担什么 |
| 第 6 章 | 讲 URDF/XML 输出质量如何评估，以及 M&M 高罐如何继续优化 |
