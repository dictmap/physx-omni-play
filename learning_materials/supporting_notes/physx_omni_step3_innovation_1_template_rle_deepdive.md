# 专题 1：Template-based RLE 几何表示深挖

这是 PhysX-Omni 最值得细读的创新。它解决的是：**如何让一个普通 VLM 在不增加 special tokens、不训练专用 3D tokenizer 的情况下，稳定输出高分辨率 part-level 3D geometry。**

## 1. 设计目标

| 目标 | 为什么重要 |
|---|---|
| VLM-friendly | 输出必须是普通文本，能被 Qwen2.5-VL 这样的模型 autoregressive 生成 |
| Explicit | 输出后能精确解析成 voxel，不是不可解释 latent |
| Compact | 不能把 64³ voxel 全部展开 |
| Part-level | simulation-ready 资产需要部件、材料、运动关系，不只是整体壳 |
| Decoder-compatible | 要能接 TRELLIS 等 voxel-based 3D decoder |
| Robust | VLM 文本可能脏，需要容错解析 |

## 2. 从 3D part 到文本

假设一个 part 的 voxel 网格是 `64 x 64 x 64`：

```text
part voxel grid
  -> z=0 的 64x64 mask
  -> z=1 的 64x64 mask
  -> ...
  -> z=63 的 64x64 mask
```

每张 2D mask 用 row-major/linear scan 展平。如果某段连续像素为 1，就记录：

```text
start length
```

如果 length=1，代码里可以省略 length，只写 `start`。

例如：

```text
10 4;22 3;51
```

意思是：从 index 10 开始连续 4 个 occupied pixels；从 22 开始连续 3 个；index 51 单点占用。

## 3. 为什么还需要 template

普通 RLE 只压缩单张 2D mask 内部的连续区域。但 3D 物体沿 z 轴相邻切片往往很像，比如圆柱、轮子、箱体。PhysX-Omni 再加一层模板压缩：

```text
a: 10 4;22 3;51
0: layer a
1: layer a +[33 2] -[51]
2: layer a +[34 2]
```

这里 `a` 是公共模板。每一层只记录它相对 `a` 的变化。

## 4. 编码算法

论文描述和代码可以合成如下伪代码：

```python
templates = []
labels = []
layer_lines = []

for z, runs in enumerate(runs_by_z):
    best_template = find_template_with_highest_similarity(runs, templates)

    if no_template or similarity < threshold:
        label = next_label()  # a, b, c, ...
        templates.append(runs)
        layer_lines.append(f"{z}: layer {label}")
    else:
        adds = runs - best_template
        removes = best_template - runs
        layer_lines.append(f"{z}: layer {label} +[{adds}] -[{removes}]")
```

本地代码 `dataset/3generate_data_new_64_finetune_rle.py` 的默认 `similarity_threshold` 是 `0.90`。这意味着只有非常相似的层才复用模板，否则新建模板，避免过度压缩造成 delta 太复杂。

## 5. 解码算法

推理时，VLM 输出文本。解析器做两遍：

```text
第一遍：
  - 读 template 行：a: ...
  - 读 layer 行：0: layer a +[...] -[...]

第二遍：
  - 对每个 z：
      base = template[label]
      final_runs = (base ∪ adds) - removes
      runs_by_z[z] = final_runs

最后：
  - 对 64 个 z-slice 的 runs 做 RLE decode
  - 得到 voxel coords: (x, y, z)
```

`1vlm_demo.py` 里为了适应 VLM 输出噪声，还做了：

| 容错 | 例子 |
|---|---|
| 中文标点 normalize | `：` -> `:`，`；` -> `;` |
| markdown fence 清理 | 删除 ```text |
| layer 形式容错 | `l_a`、`l-a`、`l a` 归一到 `layer a` |
| 局部错误跳过 | 某个 run chunk 错了，不一定让整层失败 |
| z 范围限制 | 只解析 0 到 63 |

## 6. 为什么它对 kinematics 也有帮助

运动学参数本身不是 voxel，但关节/滑轨/轮子这些结构依赖部件几何。几何如果破碎，kinematic prediction 也会变差。

Template-based RLE 提升 kinematics 的链路是：

```text
更稳定的 part-level geometry
  -> 更清晰的部件边界和连接关系
  -> group_info / joint axis / joint range 更容易和几何对齐
  -> URDF/XML 里的 link/joint 更可靠
  -> PhysX-Bench kinematic score 提升
```

论文表格中，PhysXVerse 上 kinematic 从 PhysX-Anything 的 `0.4191` 提升到 PhysX-Omni 的 `0.9185`，这是最能说明这条链路的数字之一。

## 7. 和我们复现产物的对应

官方 demo 跑完后，本地目录中可以看到：

```text
C:/Users/robot/physx_outputs/official_demo_full/
  coord_0.txt ... coord_6.txt
  ind_0.npy ... ind_6.npy
  allind.npy
  objs/0/0.glb ... objs/6/6.glb
  basic_info.json
  basic.urdf
  basic.xml
```

其中：

| 文件 | 对应阶段 |
|---|---|
| `coord_*.txt` | VLM 生成的 RLE 文本 |
| `ind_*.npy` | RLE 解码后的 part voxel |
| `allind.npy` | 所有 part voxel 合并 |
| `objs/*/*.glb` | TRELLIS 解码后的部件 mesh |
| `basic_info.json` | 物理/部件/运动学结构 |
| `basic.urdf/basic.xml` | simulation-ready 输出 |

M&M 高罐第一次变矮，也是从这里定位的：原图 `ind_*.npy` 里只有盖子 part 非空，所以 mesh 自然只剩上部。body-focus 裁剪后，罐身、盖子、肩部都有非空 voxel，这说明 RLE/voxel 是自定义图片质量诊断的第一检查点。
