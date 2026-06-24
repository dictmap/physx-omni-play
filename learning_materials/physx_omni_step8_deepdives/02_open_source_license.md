# 02 开源状态与许可判断精讲

对应 `paper-reading.md`：`## 2. 开源状态与许可判断`

## 当前开源了什么

PhysX-Omni 当前公开的核心资产包括：

- GitHub 代码仓库：`https://github.com/physx-omni/PhysX-Omni`
- 模型权重：`https://huggingface.co/PhysX-Omni/PhysX-Omni`
- PhysXVerse 数据集：`https://huggingface.co/datasets/PhysX-Omni/PhysXVerse`
- PhysX-Bench 数据集：`https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench`
- benchmark 代码：GitHub 仓库内 `benchmark/`

官方 README 明确写到 release 了 code、PhysXVerse 和 PhysX-Bench。仓库也包含 inference、training、dataset preprocessing、benchmark pipeline 和 scene generation 工具。

## 许可需要分层看

不能只看 Hugging Face 模型页面的一个 license 字段。这个项目至少有四层许可：

| 层级 | 当前标注 | 含义 |
|---|---|---|
| GitHub 代码 | `S-Lab License 1.0` | 主要是研究和非商业使用，商业使用需额外确认 |
| PhysXVerse | `cc-by-nc-4.0` | 非商业署名许可 |
| PhysX-Mobility | `cc-by-nc-4.0` | 非商业署名许可 |
| PhysX-3D | `gpl-3.0`，并涉及 ShapeNet 等来源条款 | 下游复用要额外谨慎 |
| PhysX-Omni 模型卡 | `mit` | 不能覆盖代码、训练数据和依赖的限制 |

## 大白话说明

“开源”不等于“随便商用”。这里更准确的说法是：

- 学习、研究、复现实验基本可以推进。
- 做内部研究 demo 一般问题不大，但要遵守原始 license。
- 直接放进商业产品、商用数据管线或对外服务，需要单独做 license 审查。

尤其是模型是用非商业数据训练的，即使模型卡写 `mit`，也不能自动推导出“整个系统完全自由商用”。

## 代码证据

本地仓库：

`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni`

关键文件：

- `README.md`：说明安装、训练、推理、benchmark 和数据。
- `LICENSE`：首行是 `S-Lab License 1.0`。
- `benchmark/README.md`：说明 benchmark 文件结构和评测流程。

## 复现建议

当前阶段建议把它定位为研究复现项目：

1. 可以下载模型和代码做单图测试。
2. 可以读取 PhysXVerse / PhysX-Bench 结构学习数据设计。
3. 不建议把下载的数据直接混入商业训练集。
4. 若要复用数据、模型输出或生成资产到商业场景，需要逐项确认代码、数据、依赖和输入来源许可。

