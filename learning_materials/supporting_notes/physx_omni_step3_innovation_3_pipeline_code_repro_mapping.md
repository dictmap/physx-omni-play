# 专题 3：创新点与官方代码/复现产物对齐

这份文档把论文创新点落到代码和我们已经跑出的文件上。

## 1. 官方主流程

```bash
python 1vlm_demo.py       # VLM inference
python 2infer_geo.py      # decoder inference
python 3jsongen_update.py # convert to URDF & XML
```

对应数据流：

```text
image
  -> basic_info.txt
  -> coord_*.txt
  -> ind_*.npy / allind.npy
  -> objs/<part>/*.glb / *.obj / material_0.png
  -> basic_info.json
  -> basic.urdf / basic.xml
```

## 2. `1vlm_demo.py`：VLM 结构化生成

| 代码位置 | 作用 |
|---|---|
| `Qwen2_5_VLForConditionalGeneration.from_pretrained()` | 加载 PhysX-Omni VLM 权重 |
| `dataset/example_64_finetune_rle.txt` | prompt/template，要求模型输出结构化资产描述 |
| `basic_info.txt` | object/category/dimension/parts/group_info |
| per-part question | 要求模型基于 `l_i` 生成 `grid=64` 的 3D RLE |
| `string_to_runs_by_z_lossless_robust()` | 把 VLM 输出解析为 64 个 z-layer 的 RLE |
| `decode_voxel_2drle_by_z()` | RLE -> `(x,y,z)` voxel coords |
| `ind_i.npy` | 保存每个 part voxel |
| `allind.npy` | 保存所有 part voxel |

## 3. `dataset/3generate_data_new_64_finetune_rle.py`：训练表示生成

这个脚本回答“训练时目标文本从哪里来”。核心函数：

| 函数 | 作用 |
|---|---|
| `runs_by_z_to_string_lossless()` | 把 part voxel 编码为 template-based RLE 文本 |
| `runs_similarity()` | 判断当前 slice 是否和已有 template 足够像 |
| `_int_to_label()` | 生成 `a,b,c,...` 模板标签 |
| `compact_str_to_runs()` | 文本 run 回读 |

这说明 template-based RLE 不是推理时临时 hack，而是训练目标的一部分。

## 4. `decoder_each.py`：接 TRELLIS

| 代码/产物 | 说明 |
|---|---|
| `TrellisImageTo3DPipeline.from_pretrained("microsoft/TRELLIS-image-large")` | 加载预训练 3D decoder |
| `coords=np.concatenate([np.zeros((len(coords),1)),coords],1)` | 给 voxel coords 加 batch/channel 维度 |
| `eachcoords` | 标记每个 part 在 allind 中的切片范围 |
| `pipeline.run_decoder(coords, image, seed=1, eachcoords=eachcoords)` | 条件解码多 part geometry |
| `postprocessing_utils.to_glb(...)` | mesh + gaussian 转 textured GLB |
| `objs/<i>/<i>.glb` / `.obj` | 每个 part 的可视几何输出 |

我们在 4090 上为了稳定复现，把输出格式限制为 `mesh + gaussian`，避免默认 radiance_field 在 24GB 显存上 OOM。这不改变论文方法，只是工程适配。

## 5. `3jsongen_update.py`：simulation-ready 装配

| 输入 | 输出 |
|---|---|
| `basic_info.txt` | `basic_info.json` |
| `objs/<part>/*.obj` | URDF/XML mesh link |
| parts 的 material/density/elastic params | 物理属性字段 |
| `group_info` | link/joint 层级和关节参数 |

官方 demo 生成的 `basic_info.json` 已经能看到：

- `object_name`: Dumpster；
- 7 个 parts；
- 每个 part 的 material、density、Young's Modulus、Poisson's Ratio；
- `group_info` 中多个 C 类型关节参数；
- `basic.urdf` 和 `basic.xml`。

## 6. 复现证据

本地官方 demo：

```text
C:/Users/robot/physx_outputs/official_demo_full
```

关键数字：

| 项 | 结果 |
|---|---:|
| detected_parts | 7 |
| total_voxels | 22031 |
| part voxel counts | 56, 14065, 7570, 46, 186, 60, 48 |
| mesh part dirs | `objs/0` 到 `objs/6` |
| final sim files | `basic.urdf`, `basic.xml`, `basic_info.json` |

本地 M&M 图片测试：

| 输入 | total_voxels | 非空部件 | 结论 |
|---|---:|---:|---|
| 原图 | 2237 | 1/4 | 主要只生成 lid，所以看起来矮 |
| body-focus 裁剪 | 6188 | 3/4 | 罐身/盖子/肩部都有 voxel，适合继续 mesh 解码 |

## 7. 后续复现质量建议

| 检查点 | 通过标准 |
|---|---|
| `basic_info.txt` | parts 是否合理，尺度/材料是否荒谬 |
| `coord_*.txt` | RLE 是否非空，是否全是异常长文本/错误格式 |
| `ind_*.npy` | 关键 part voxel 是否非空 |
| `voxel_projection.png` | 轮廓是否覆盖主体，不只是局部 |
| `objs/*/*.glb` | 每个重要 part 是否成功解码 |
| `basic.urdf/xml` | link/joint 是否和 parts 对齐 |
| simulator smoke test | 能加载、无明显 scale/collision 爆炸 |
