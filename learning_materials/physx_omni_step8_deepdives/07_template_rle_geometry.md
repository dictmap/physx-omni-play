# 07 Template-based RLE 几何表示精讲

对应 `paper-reading.md`：`## 7. 关键创新：template-based RLE 几何表示`

## 核心问题

VLM 天然擅长文本序列，但 3D 几何不是天然文本。直接让语言模型生成 mesh 顶点、面片或 dense voxel，会遇到序列太长、顺序敏感、局部结构难保持的问题。

PhysX-Omni 的关键创新是把 3D 几何转成 VLM 友好的文本格式：part-level voxel + z-slice 2D RLE + template 压缩。

## 代码怎么做

数据预处理分三步：

```bash
cd dataset
python 1voxel_verse.py
python 2encode_representation_64_finetune
python 3generate_data_new_64_finetune_rle.py
```

关键代码点：

- `1voxel_verse.py`：把每个 part mesh voxelize 到 16、32、64 等分辨率。
- `2encode_representation_64_finetune.py`：把 object JSON 转成结构化文本。
- `3generate_data_new_64_finetune_rle.py`：把 64³ voxel 坐标编码成沿 z 轴的 2D RLE 文本。

`3generate_data_new_64_finetune_rle.py` 中有：

- `encode_voxel_2drle_by_z`
- `decode_voxel_2drle_by_z`
- 训练 prompt：输出 `start_index length`
- token 过滤：`tokennum < 20000`

## 大白话说明

可以把一个 3D 部件想象成一摞 2D 切片。  
每一层切片里，哪些格子是实体，哪些格子是空。  
RLE 的做法不是逐格写 0 和 1，而是写“从第几个格子开始，连续多少个格子是实体”。

例如一行里有 100 个格子，如果第 20 到 40 个是实体，就不用写 100 个数字，只写：

```text
20 21
```

3D 物体相邻切片通常很像，所以 template layer 又进一步复用相似层，减少重复表达。

## 为什么比纯 voxel index 更好

纯 voxel index 会列出大量坐标，序列容易爆炸。RLE 利用连续性，把稀疏或连续结构压缩成较短文本。对 VLM 来说，这还是普通文本，不需要新增 special token，也不用训练额外 tokenizer。

## 和本地复现的关系

本地官方 demo 输出里有：

- `ind_*.npy`：每个部件的 voxel index。
- `ind_*.ply`：每个部件 voxel 可视化。
- `allind.npy`：整体 voxel。
- `voxel_projection.png`：投影预览。

这些文件是理解 RLE 表示的实证入口。虽然 inference 输出不一定保留完整训练 RLE 文本，但 voxel 文件说明几何中间表示确实存在。

## 注意边界

RLE 是紧凑表示，不等于无限精细。当前训练重点是 64³ grid。更高分辨率、更复杂拓扑、薄结构和透明/软体细节仍可能需要更强 decoder 或更精细后处理。

