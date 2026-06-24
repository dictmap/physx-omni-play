# 09 PhysXVerse 数据集精讲

对应 `paper-reading.md`：`## 9. PhysXVerse 数据集`

## 数据集为什么重要

PhysX-Omni 的目标比普通 3D 生成更宽。它不仅要几何，还要尺度、材料、affordance、kinematics 和功能描述。已有数据集很难同时覆盖这些内容，因此论文构建 PhysXVerse 来补数据缺口。

## 论文里的构建方法

PhysXVerse 基于 PartVerse 的人类验证部件分割，经过：

1. 过滤无效样本。
2. 合并过小或噪声部件。
3. 渲染多视角图像。
4. 使用 GPT/VLM 生成初步物理标注。
5. 人类检查、修正、确认。

标注内容包括：

- absolute scale
- material
- affordance
- kinematics
- functional description
- part hierarchy

## 规模

论文中给出的 PhysXVerse 规模：

- 超过 8.7K 个高质量 simulation-ready 3D assets。
- 超过 2.9K 类别。
- 部件数量从 1 到 65。
- 覆盖家具、车辆、机器人、无人机、玩具、大场景部件等。

训练最终还结合：

- PhysXNet
- PhysX-Mobility
- PhysXVerse

合计超过 42K 个 simulation-ready physical 3D assets。

## 官方公开资产

本轮核对 Hugging Face 当前公开文件：

| 数据集 | 文件数 | 体量 |
|---|---:|---:|
| `PhysX-Omni/PhysXVerse` | 6 | 约 104.87GB |
| `Caoza/PhysX-Mobility` | 3 | 约 0.87GB |
| `Caoza/PhysX-3D` | 97 | 约 1.83TB |

PhysXVerse 以分卷 zip 发布：

- `PhysXVerse.zip.part_aa`
- `PhysXVerse.zip.part_ab`
- `PhysXVerse.zip.part_ac`
- `merge.sh`

## 代码里怎么用

官方 README 训练部分要求先下载 PhysXNet、PhysX-Mobility 和 PhysXVerse，然后跑：

```bash
cd dataset
python 1voxel_verse.py
python 2encode_representation_64_finetune
python 3generate_data_new_64_finetune_rle.py
```

训练配置文件 `qwen-vl-finetune/qwenvl/data/__init__.py` 注册了：

- `physxverse64`
- `physxnet64`
- `physxmobility64`

训练脚本 `train_physx.sh` 中 `datasets=physxverse64,physxnet64,physxmobility64`。

## 大白话说明

PhysXVerse 不是“多收集一些 3D 模型”这么简单。它做的是把物体拆成可理解、可操作、可仿真的部件，并给这些部件补上物理常识。  
如果没有这种数据，模型只能学“像不像”；有了这种数据，模型才可能学“怎么动、什么材质、哪里能抓”。

## 本地证据

本地代码里带有 `dataset/testset_physxverse.npy`，形状是 `(400,)`，这是 PhysXVerse 相关测试划分。它不是完整数据集，但能证明官方代码提供了 benchmark/test 子集 ID。

## 注意边界

我们本地没有全量展开 104GB PhysXVerse，也没有全量训练数据。当前分析基于论文、官方 README、Hugging Face 元信息、代码脚本和本地测试划分。不能把“元信息核对”和“全量数据完整审计”混为一谈。

