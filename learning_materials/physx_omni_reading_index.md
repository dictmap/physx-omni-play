# PhysX-Omni 论文精读主索引

论文：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1)  
官方代码：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni)

一句话概括：这篇论文尝试从单张图生成带几何、部件、关节和物理属性的可仿真资产，并用 PhysX-Bench/PhysXVerse 评估这种资产是否真的能进入物理仿真和机器人学习流程。

## 先读这五个

1. `paper_reading/physx_omni_paper_code_assets_deep_reading_step1.md`  
   代码、模型资产、数据资产、推理流程。

2. `paper_reading/physx_omni_paper_core_innovations_step3.md`  
   template RLE、PhysXVerse/PhysX-Bench、单图到物理资产 pipeline。

3. `paper_reading/physx_omni_paper_baselines_experiments_step4.md`  
   baseline、指标、实验表格和代码对应关系。

4. `physx_omni_step9_reviewer/00_reviewer_soul_questions.md`  
   审稿人视角的七个关键质疑。

5. `physx_omni_step10_technical_experiments/00_technical_experiment_answer.md`  
   用本地实验结果回答这些质疑。

## 如果要补细节

| 问题 | 文件 |
|---|---|
| 作者来自哪里 | `paper_reading/physx_omni_paper_author_deep_reading_step2.md` |
| bench 怎么设计 | `paper_reading/physx_omni_paper_bench_step5.md` |
| 数据集怎么构建 | `paper_reading/physx_omni_paper_datasets_step6.md` |
| 竞品和后续论文 | `paper_reading/physx_omni_paper_competitor_landscape_step7.md` |
| 逐概念讲解 | `physx_omni_step8_deepdives/00_index.md` |
| 拆分矩阵和补充说明 | `supporting_notes/` |

## 复现看这里

| 内容 | 文件 |
|---|---|
| 官方 7 部件 demo | `reproduction/physx-omni-official-demo-full-repro-report.md` |
| M&M's 原图测试 | `reproduction/physx-omni-mms-yellow-image-test-report.md` |
| M&M's body-focus 裁剪测试 | `reproduction/physx-omni-next-steps-and-mms-body-focus.md` |
| 当前交付状态 | `reproduction/physx_omni_current_delivery_report.md` |

一键复现脚本在项目根目录：

```text
../reproduce_quality.sh
```
