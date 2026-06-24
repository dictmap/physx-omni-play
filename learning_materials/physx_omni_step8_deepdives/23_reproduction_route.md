# 23 复现路线精讲

对应 `paper-reading.md`：`## 23. 如果我要复现，建议路线`

## 第一阶段：只读代码和跑轻量 demo

目标：

- 确认 checkpoint 可下载。
- 确认单图推理流程。
- 看输出目录结构。
- 理解 URDF/XML 转换。

关键文件：

- `download.py`
- `1vlm_demo.py`
- `2infer_geo.py`
- `3jsongen_update.py`
- `requirements.txt`

本地已经完成官方 demo 主流程，并得到 `C:\Users\robot\physx_outputs\official_demo_full`。

## 第二阶段：理解数据格式

目标：

- 看 PhysXVerse annotation 结构。
- 看 template-based RLE 输入输出格式。
- 看训练数据 template。

关键目录：

- `dataset/`
- `configs/`
- `qwen-vl-finetune/`

关键脚本：

- `1voxel_verse.py`
- `2encode_representation_64_finetune.py`
- `3generate_data_new_64_finetune_rle.py`
- `example_64_finetune_rle.txt`

## 第三阶段：跑 benchmark smoke test

目标：

- 不先追求完整分数。
- 先跑 tiny smoke test。
- 确认 manifest、aggregation、denominator validation 是否通。

命令：

```bash
bash benchmark/scripts/run_tiny_smoke_test.sh
```

本地已经有 tiny 输出目录，说明基本管线可执行。

## 第四阶段：小规模真实评测

目标：

- 选少量对象。
- 只跑部分指标，例如 RQS、DQS、KPS。
- 保存图像、视频、JSON、CSV 证据。

建议优先选：

- 官方 demo 图。
- 用户罐子图。
- PhysX-Bench 中 1-3 个 demo_mobility 对象。

## 第五阶段：替换输入图片

目标：

- 用自己的物体图片测试。
- 看尺度、关节、affordance 是否合理。
- 观察生成结果是否能导入 MuJoCo/Isaac/Genesis。

用户之前的罐子图属于这个阶段。它是一个很好的 rigid / material / scale 测试，但不是 articulated 结构测试。若要测 kinematic，建议换柜门、抽屉、轮椅、婴儿车、带盖垃圾桶等对象。

## 大白话复现路线

不要一上来训练，不要一上来 full benchmark。正确节奏是：

```text
跑通一个样本 -> 看懂输出 -> 跑通小评测 -> 扩到少量样本 -> 再做 baseline 对比
```

## 下一步最建议做什么

结合第七步，下一步建议：

1. 复现 PhysX-Anything 单图 demo。
2. 用同一输入图比较 PhysX-Anything 和 PhysX-Omni 输出 JSON/mesh/URDF。
3. 再接入 PhysX-Bench 小样本。

