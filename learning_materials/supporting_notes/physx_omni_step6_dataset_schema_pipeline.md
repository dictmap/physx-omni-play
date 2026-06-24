# PhysX-Omni 第六步附录：数据 schema 与预处理管线

## 1. 数据目录结构

PhysXVerse 在本地预处理脚本中假设解压后结构大致为：

```text
PhysXVerse/
  partobj/
    <object_id>/
      <part_id>/
        <part_id>.obj
  finaljson/
    <object_id>.json
```

预处理临时输出：

```text
tmp_verse/
  finaljson/<object_id>.json
  partobj/<object_id>/<res>/
    mesh_new_<part_id>.ply
    ind_<part_id>.npy
    allind.npy
    alldict_vert.pkl
```

结构化文本输出：

```text
txt_rep_64_finetune_verse/<object_id>.txt
```

训练 JSON 输出：

```text
trainset_64_final_verse/training_set_<shard_id>_randompart.json
```

## 2. JSON schema

顶层：

```json
{
  "object_name": "Dumpster",
  "category": "Waste Container",
  "dimension": "180*120*150",
  "parts": [],
  "group_info": {}
}
```

part：

```json
{
  "label": 0,
  "name": "Caster Wheel",
  "material": "Steel with Rubber",
  "density": 4.45,
  "priority_rank": 7,
  "Basic_description": "A caster wheel attached to the bottom.",
  "Young's Modulus (GPa)": 100.005,
  "Poisson's Ratio": 0.395
}
```

group：

```json
{
  "0": [1, 4],
  "1": [
    [0],
    "0",
    [0.0, 0.0, 1.0, 0.203, 0.401, -0.5, -1.0, 1.0],
    "C"
  ]
}
```

解释：

- group `0` 通常是 base group。
- 非 0 group 形如 `[child_parts, parent_group, params, type]`。
- `params` 的含义依赖 `type`。

## 3. 运动类型参数

| Type | 名称 | 参数解释 |
|---|---|---|
| A | free / no movement constraints | 无显式参数 |
| B | prismatic | direction + slide range |
| C | revolute | axis direction + axis position + revolute range |
| D | hinge point | hinge position |
| CB | revolute + prismatic | rotate axis/position/range + slide direction/range |
| E | fixed | base/fixed group |

脚本里会把归一化变换同步应用到这些参数，避免 mesh 坐标变了但关节轴还在旧坐标。

## 4. `1voxel_verse.py`

主要任务：

1. 读取 `partobj/<object_id>` 下的 part OBJ。
2. 合并成整体 mesh，计算 bbox。
3. 归一化到统一尺度和中心。
4. 对关节参数做相同坐标变换。
5. 逐 part 生成 voxel indices。
6. 输出多个分辨率：`16 / 32 / 64`。

关键函数：

| 函数 | 作用 |
|---|---|
| `movtran()` | scale + translate + rotate mesh |
| `transfer()` | 对关节点/方向应用相同矩阵 |
| `generate_voxel()` | 用 Open3D point cloud 采样和 voxel grid 转 voxel indices |
| `load_obj_geometry_fast()` | 快速读取 OBJ 顶点和面 |

输出字段：

| 文件 | 含义 |
|---|---|
| `ind_<part>.npy` | 当前 part 的 voxel `(x,y,z)` indices |
| `allind.npy` | 全对象 voxel indices 拼接 |
| `mesh_new_<part>.ply` | 归一化后的 part mesh |
| `alldict_vert.pkl` | part 到 voxel vertex 的映射 |

## 5. `2encode_representation_64_finetune.py`

主要任务：

- 把 object JSON 转成训练 prompt 使用的结构化文本。
- 把物理参数和运动参数显式写出来。
- 对 B/C/CB 的方向向量做归一化。
- 把 slide range 转换到 voxel grid 单位。
- 把 revolute range 转成 degree。

文本模板：

```text
Name: <object name>
Category: <object category>
Dimension: <physical dimensions>
Parts:
l_0: <part name>| <affordance rank>| <material>| <density>| <young>| <poisson>| <description>
Group_info:
group_1: [l_0]; Type: C relative to group_0; Param: direction: [...], axis position: [...], revolute range: [...]
```

这里的文本和 `dataset/example_64_finetune_rle.txt` 保持同一 schema。

## 6. `3generate_data_new_64_finetune_rle.py`

主要任务：

1. 读取结构化文本。
2. 读取每个 part 的 `ind_<part>.npy`。
3. 把 voxel `(x,y,z)` 按 z slice 编成 2D RLE。
4. 对相似 z slice 做 template sharing。
5. 记录 adds/removes delta，保持 lossless。
6. 构造 Qwen-VL conversation 格式。
7. 用 tokenizer 统计 token 长度，过滤过长样本。

训练样本结构：

```json
{
  "id": "<object_id>_<view_id>",
  "image": "<object_id>/<view_id>.png",
  "conversations": [
    {"from": "human", "value": "<image>\\n..."},
    {"from": "gpt", "value": "... structured text ..."},
    {"from": "human", "value": "Based on the structured description of l_i, generate its 3D voxel ..."},
    {"from": "gpt", "value": "... RLE geometry ..."}
  ],
  "data_source": "physx",
  "meshlength": 12345
}
```

代码中每个 object、每个 part、每个 view 都会生成训练条目：

```text
for part in range(num_parts):
  for ind in range(0, 25):
    create one training sample
```

这解释了为什么 object 数是 42K+，但训练 JSON 条目会远高于 42K。

## 7. Template-RLE 具体机制

`encode_voxel_2drle_by_z()`：

- 输入 `(N,3)` voxel coords。
- 以 z 为 slice。
- 每个 z slice 把 `(x,y)` 展平成 `idx2d = x + W*y`。
- 连续 idx 变成 `(start, length)` run。

`runs_by_z_to_string_lossless()`：

- 为相似 slice 建 template，label 为 `a,b,c,...`。
- 每层引用某个 template。
- 如果有差异，用 `+[adds]` 和 `-[removes]` 表达。

`string_to_runs_by_z_lossless()` 和 `decode_voxel_2drle_by_z()`：

- 把文本还原成 voxel coords。
- 脚本里对 `coords` 和 `coords_rec` 做 equality check。

## 8. 训练配置字段

`qwen-vl-finetune/qwenvl/data/__init__.py`：

```python
PHYSXVERSE64_FINAL = {
    "annotation_path": "./",
    "data_path": "./PhysXVerse/renders",
}
PHYSXNET64_FINAL = {
    "annotation_path": "./",
    "data_path": "./PhysXNet/renders",
}
PHYSXMOBILITY64_FINAL = {
    "annotation_path": "./",
    "data_path": "./PhysX-mobility/renders",
}
```

`qwen-vl-finetune/scripts/train_physx.sh`：

```bash
datasets=physxverse64,physxnet64,physxmobility64
llm=Qwen/Qwen2.5-VL-7B-Instruct
lr=2e-5
model_max_length=16384
```

论文训练细节：

| 项 | 值 |
|---|---|
| VLM backbone | Qwen2.5-VL-7B-Instruct |
| Epochs | 5 |
| GPUs | 64 NVIDIA A100 |
| Time | about 14 days |
| Peak LR | `2e-5` |
| Schedule | cosine decay |
| Warmup ratio | `0.03` |
| Effective batch size | 128 |
| Max sequence length | 16384 |

## 9. Split 与本地证据

本地代码包含：

```text
dataset/testset_physxverse.npy
```

该文件当前有 `400` 个 object id。`2encode_representation_64_finetune.py` 会跳过这些 test ids，不把它们写入训练文本：

```python
testset = np.load('testset_physsxverse.npy')
if name in testset:
    skip
```

注意脚本里的文件名拼写是 `testset_physsxverse.npy`，而本地实际文件是 `testset_physxverse.npy`。这可能是公开代码中的小拼写问题，真正跑预处理时需要确认或修正路径。

## 10. Dataset 与模型能力的对应关系

| 数据字段 | 模型学习到的能力 |
|---|---|
| `dimension` | 估计真实物体尺度 |
| `parts` | 识别对象组成部件 |
| `material/density/Young/Poisson` | 生成材料和力学属性 |
| `priority_rank` | 生成 affordance heatmap / interaction prior |
| `Basic_description` | part-level semantic grounding |
| `group_info` | articulated structure 和 joint constraints |
| `ind_<part>.npy` + RLE | part-level explicit geometry |
| 25 views | 提高视角鲁棒性和单图泛化 |

