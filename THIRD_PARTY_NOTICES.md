# 第三方资产与授权边界

本仓库是 PhysX-Omni 论文精读、复现证据和教学查看包，不重新授权上游论文、代码、模型、数据集或生成资产。

## 上游代码快照

- 来源：`https://github.com/physx-omni/PhysX-Omni`
- 本仓库位置：`code/PhysX-Omni/`
- 记录版本：`46fa1cd`
- 上游许可证文件：`code/PhysX-Omni/LICENSE`
- 许可证名称：`S-Lab License 1.0`

该许可证允许非商业目的的源码和二进制再分发，但商业用途需要联系贡献者。使用 `code/PhysX-Omni/` 下的代码时，应以该目录内的上游许可证为准。

## 论文、图表和源码

- arXiv 摘要页：`https://arxiv.org/abs/2605.21572v1`
- arXiv HTML：`https://arxiv.org/html/2605.21572v1`
- 本地论文缓存：`paper/2605.21572v1.pdf`、`paper/2605.21572v1.html`
- 作者 LaTeX 源码缓存：`author_sources/`

这些材料用于论文阅读、引用和复现实验说明，版权和使用条款仍属于原作者、arXiv 或对应来源。

## Hugging Face 模型与数据集

- 模型来源：`https://huggingface.co/PhysX-Omni/PhysX-Omni`
- 数据集来源：`https://huggingface.co/datasets/PhysX-Omni/PhysXVerse`
- 本仓库只提供下载脚本和来源清单，不把大体积模型权重或完整数据集纳入 Git。

如果模型或数据集页面要求登录、同意条款或 gated access，必须由使用者自己的 Hugging Face 账号完成授权。

## 复现输出与查看器资产

`official_viewer/assets/` 下的 GLB、PNG 和 JSON 是本次复现包同步出来的轻量查看证据，用于教学检查和交互预览。它们不等价于论文 benchmark 全量结果，也不证明生成资产已经满足真实机器人训练、跨仿真器动态一致性或商业使用条件。

M&M's 黄色高罐相关结果是用户图片压力测试，只能说明当前链路在该图上的几何解码现象，不能代表 PhysX-Omni 官方指标或可商用品牌资产。

## 本仓库新增内容

除上游代码、论文缓存、作者源码、模型数据来源和复现同步资产外，本仓库新增的阅读索引、中文讲解、质量脚本、发布审计脚本和前端组织代码，仅作为学习与复现辅助材料使用。引用本仓库时请同时引用原论文和上游项目。
