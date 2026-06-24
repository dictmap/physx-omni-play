# PhysX-Omni 阅读与复现入口

这是 PhysX-Omni 项目内的主入口。读论文、看代码、查复现结果，都从这里走。

## 主线阅读

| 顺序 | 读什么 | 文件 |
|---:|---|---|
| 1 | 代码、资产、官方流程 | `learning_materials/paper_reading/physx_omni_paper_code_assets_deep_reading_step1.md` |
| 2 | 作者和团队背景 | `learning_materials/paper_reading/physx_omni_paper_author_deep_reading_step2.md` |
| 3 | 核心创新点 | `learning_materials/paper_reading/physx_omni_paper_core_innovations_step3.md` |
| 4 | baseline 和实验 | `learning_materials/paper_reading/physx_omni_paper_baselines_experiments_step4.md` |
| 5 | bench 设计 | `learning_materials/paper_reading/physx_omni_paper_bench_step5.md` |
| 6 | 数据集构建 | `learning_materials/paper_reading/physx_omni_paper_datasets_step6.md` |
| 7 | 竞品和后续论文 | `learning_materials/paper_reading/physx_omni_paper_competitor_landscape_step7.md` |
| 8 | 概念逐项精讲 | `learning_materials/physx_omni_step8_deepdives/00_index.md` |
| 9 | 审稿人质疑 | `learning_materials/physx_omni_step9_reviewer/00_reviewer_soul_questions.md` |
| 10 | 用实验回答质疑 | `learning_materials/physx_omni_step10_technical_experiments/00_technical_experiment_answer.md` |

## 前端总览

当前推荐先打开本地前端：

```text
http://127.0.0.1:8017/index.html
```

它集中展示论文主线、核心代码、官方复现记录、M&M's 高罐实测、Bench/数据集、审稿问题和 3D GLB 查看器。

本地文件：

```text
official_viewer/index.html
```

`file://` 直开时可看十步课程、材料库和搜索；3D GLB 交互需要使用本地 HTTP 地址。

## 质量与证据入口

| 内容 | 文件 |
|---|---|
| 项目 README | `README.md` |
| 质量标准 | `PROJECT_QUALITY_STANDARD.md` |
| 当前状态快照 | `PROJECT_STATUS.json` |
| 来源清单 | `SOURCE_MANIFEST.json` |
| 复现证据清单 | `REMOTE_EVIDENCE_MANIFEST.md` |
| 质量验证脚本 | `scripts/validate_physx_omni_quality.py` |

验证命令：

```powershell
python C:\Users\robot\Documents\成长学习库\physx-omni-assets\scripts\validate_physx_omni_quality.py
```

## 复现入口

| 内容 | 文件 |
|---|---|
| 官方 7 部件 demo | `learning_materials/reproduction/physx-omni-official-demo-full-repro-report.md` |
| M&M's 高罐测试 | `learning_materials/reproduction/physx-omni-next-steps-and-mms-body-focus.md` |
| 当前交付状态 | `learning_materials/reproduction/physx_omni_current_delivery_report.md` |
| 一键复现脚本 | `reproduce_quality.sh` |
| 复现工作台前端 | `official_viewer/index.html` 或 `http://127.0.0.1:8017/index.html` |

## 目录结构

```text
physx-omni-assets/
  LEARNING_INDEX.md                 主入口
  author_sources/                   作者、机构、论文来源材料
  code/PhysX-Omni/                  官方代码
  official_viewer/                  官方 7 部件交互查看器
  learning_materials/
    README.md                       学习材料入口
    physx_omni_reading_index.md     论文精读主索引
    paper_reading/                  Step 1-7 Markdown 和 Notebook
    reproduction/                   复现报告和 M&M's 实测
    supporting_notes/               Step 3-7 的拆分说明
    physx_omni_step8_deepdives/     概念逐项精讲
    physx_omni_step9_reviewer/      审稿人质疑
    physx_omni_step10_technical_experiments/
  reproduce_quality.sh
  physx_omni_repro_quality.patch
```

复现输出主要在：

```text
C:\Users\robot\physx_outputs
```
