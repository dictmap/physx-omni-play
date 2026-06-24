# PhysX-Omni 学习材料

这里不按文件名逐个翻。按用途分三层读：先主线，再复现，最后专题深挖。

## 1. 主线精读

Step 1-7 都在：

```text
paper_reading/
```

建议顺序：

| 顺序 | 主题 | 文件 |
|---:|---|---|
| 1 | 代码、模型、数据、官方流程 | `paper_reading/physx_omni_paper_code_assets_deep_reading_step1.md` |
| 2 | 作者与团队 | `paper_reading/physx_omni_paper_author_deep_reading_step2.md` |
| 3 | 核心创新 | `paper_reading/physx_omni_paper_core_innovations_step3.md` |
| 4 | baseline 与实验 | `paper_reading/physx_omni_paper_baselines_experiments_step4.md` |
| 5 | PhysX-Bench | `paper_reading/physx_omni_paper_bench_step5.md` |
| 6 | 数据集 | `paper_reading/physx_omni_paper_datasets_step6.md` |
| 7 | 竞品和后续论文 | `paper_reading/physx_omni_paper_competitor_landscape_step7.md` |

对应 `.ipynb` 也在同一目录，适合 Jupyter 讲解。

## 2. 复现和实测

复现报告都在：

```text
reproduction/
```

优先看：

| 内容 | 文件 |
|---|---|
| 官方 demo 完整闭环 | `reproduction/physx-omni-official-demo-full-repro-report.md` |
| M&M's 原图测试 | `reproduction/physx-omni-mms-yellow-image-test-report.md` |
| M&M's body-focus 裁剪测试 | `reproduction/physx-omni-next-steps-and-mms-body-focus.md` |
| 当前交付状态 | `reproduction/physx_omni_current_delivery_report.md` |

## 3. 专题深挖

| 入口 | 作用 |
|---|---|
| `physx_omni_reading_index.md` | 全局路线和关键结论 |
| `physx_omni_step8_deepdives/00_index.md` | 逐概念精讲 |
| `physx_omni_step9_reviewer/00_reviewer_soul_questions.md` | 审稿人七个问题 |
| `physx_omni_step10_technical_experiments/00_technical_experiment_answer.md` | 用实验回答这些问题 |
| `supporting_notes/` | Step 3-7 的拆分说明和矩阵 |

## 4. 项目内其他资产

| 目录 | 内容 |
|---|---|
| `../author_sources/` | 作者、机构、论文来源材料 |
| `../official_viewer/` | 官方 7 部件 Three.js 交互查看器 |
| `../code/PhysX-Omni/` | 官方代码 checkout |

新增材料优先放进对应目录。项目根目录只留入口，不再散放长文档。
