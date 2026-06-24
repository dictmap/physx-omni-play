# 12 训练与实现细节精讲

对应 `paper-reading.md`：`## 12. 训练与实现细节`

## 论文训练设置

论文报告的训练设置：

- VLM backbone：`Qwen2.5-VL-7B-Instruct`
- 训练 5 个 epoch。
- 64 张 NVIDIA A100。
- 约 14 天。
- 最大序列长度 16,384。
- decoder：TRELLIS。
- 每个对象 25 张多视角 conditioning images。

这说明完整训练复现成本极高，个人 4090 更适合做 inference、小样本 benchmark、数据预处理验证或小规模 finetune。

## 代码证据

训练脚本：

`qwen-vl-finetune/scripts/train_physx.sh`

关键参数：

- `llm=Qwen/Qwen2.5-VL-7B-Instruct`
- `datasets=physxverse64,physxnet64,physxmobility64`
- `num_train_epochs 5`
- `learning_rate ${lr}`，脚本中设置为 `2e-5`
- `warmup_ratio 0.03`
- `model_max_length 16384`
- `gradient_checkpointing True`
- `bf16`

数据注册文件：

`qwen-vl-finetune/qwenvl/data/__init__.py`

注册了：

- `PHYSXVERSE64_FINAL`
- `PHYSXNET64_FINAL`
- `PHYSXMOBILITY64_FINAL`

## 训练数据怎么进模型

官方 README 要求下载：

- PhysXNet
- PhysX-Mobility
- PhysXVerse

然后预处理 PhysXVerse：

```bash
cd dataset
python 1voxel_verse.py
python 2encode_representation_64_finetune
python 3generate_data_new_64_finetune_rle.py
```

最后渲染 conditioning images，PhysX-Mobility 和 PhysXVerse 使用 PhysX-Anything 中的 `render_cond_mobility.py`，PhysXNet 参考 PhysX-3D 的 `precess.sh`。

## 大白话说明

训练过程可以理解为让 Qwen2.5-VL 学三件事：

1. 看图识别物体和部件。
2. 写出物理属性和关节关系。
3. 用 RLE 文本写出每个部件的 64³ 几何。

模型不是只学 caption，也不是只学 3D 重建，而是在学“图像到结构化仿真资产描述”的映射。

## 为什么训练成本高

成本高的原因不只是模型大，还包括：

- 输入有 25-view 图像。
- 输出有长文本、部件描述和 RLE 几何。
- 序列长度到 16,384。
- 数据量超过 42K simulation-ready assets。
- 还要配合 TRELLIS decoder。

## 复现建议

实际路线应分层：

1. 先用公开 checkpoint inference。
2. 再跑一个官方 demo 的完整输出链。
3. 然后跑 tiny benchmark smoke。
4. 最后只在很小数据上验证 finetune 格式。

不要一开始就追 full training。对 4090 来说，full training 不是合理目标。

