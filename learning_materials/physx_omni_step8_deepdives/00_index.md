# PhysX-Omni 第八步：paper-reading.md 逐项精讲索引

对应原始文件：`C:\Users\robot\Documents\成长学习库\physx-omni-2605.21572v1-paper-reading.md`

这一组文档把 `paper-reading.md` 的 29 个顶层章节逐个展开。每篇都按同一套读法组织：

- 论文讲的是什么。
- 代码或数据里落在哪里。
- 官方数据或公开资产有什么证据。
- 大白话怎么理解。
- 复现时应该看什么，不应该夸大什么。

## 文件清单

| paper-reading 章节 | 精讲文件 |
|---|---|
| 1. 一句话结论 | `01_one_sentence_conclusion.md` |
| 2. 开源状态与许可判断 | `02_open_source_license.md` |
| 3. 论文要解决的问题 | `03_problem_statement.md` |
| 4. 输入输出怎么理解 | `04_inputs_outputs.md` |
| 5. 方法总览 | `05_method_overview.md` |
| 6. Global-to-local 生成范式 | `06_global_to_local.md` |
| 7. template-based RLE 几何表示 | `07_template_rle_geometry.md` |
| 8. 为什么不用纯 mesh 或 point cloud | `08_mesh_pointcloud_tradeoff.md` |
| 9. PhysXVerse 数据集 | `09_physxverse_dataset.md` |
| 10. PhysX-Bench 评测框架 | `10_physxbench_framework.md` |
| 11. 各评测项怎么理解 | `11_metrics_deep_dive.md` |
| 12. 训练与实现细节 | `12_training_implementation.md` |
| 13. GitHub 推理管线 | `13_github_inference_pipeline.md` |
| 14. Benchmark 代码可用性 | `14_benchmark_code.md` |
| 15. 主要实验结果 | `15_experiment_results.md` |
| 16. 消融实验结论 | `16_ablation.md` |
| 17. 应用：机器人策略学习 | `17_robot_policy_learning.md` |
| 18. 应用：simulation-ready scene generation | `18_scene_generation.md` |
| 19. 这篇论文真正的贡献 | `19_contributions.md` |
| 20. 这篇论文的强点 | `20_strengths.md` |
| 21. 需要警惕的边界 | `21_boundaries.md` |
| 22. 和前序工作的关系 | `22_prior_work.md` |
| 23. 如果我要复现，建议路线 | `23_reproduction_route.md` |
| 24. 对机器人和仿真工作的启发 | `24_robotics_sim_insights.md` |
| 25. 核心术语表 | `25_glossary.md` |
| 26. 用一句话记住整篇论文 | `26_one_sentence_memory.md` |
| 27. 我的阅读判断 | `27_reading_judgement.md` |
| 28. 最适合继续追的问题 | `28_followup_questions.md` |
| 29. 适合引用的 BibTeX | `29_bibtex.md` |

## 核心证据来源

- 论文：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1)
- 官方 HTML：[https://arxiv.org/html/2605.21572](https://arxiv.org/html/2605.21572)
- 项目页：[https://physx-omni.github.io/](https://physx-omni.github.io/)
- GitHub：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni)
- 模型：[https://huggingface.co/PhysX-Omni/PhysX-Omni](https://huggingface.co/PhysX-Omni/PhysX-Omni)
- PhysXVerse：[https://huggingface.co/datasets/PhysX-Omni/PhysXVerse](https://huggingface.co/datasets/PhysX-Omni/PhysXVerse)
- PhysX-Bench：[https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench](https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench)
- PhysX-Mobility：[https://huggingface.co/datasets/Caoza/PhysX-Mobility](https://huggingface.co/datasets/Caoza/PhysX-Mobility)
- PhysX-3D / PhysXNet：[https://huggingface.co/datasets/Caoza/PhysX-3D](https://huggingface.co/datasets/Caoza/PhysX-3D)

## 本地证据

- 官方代码：`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni`
- 官方论文缓存：`C:\Users\robot\Documents\成长学习库\physx-omni-assets\paper\2605.21572v1.html`
- 复现输出：`C:\Users\robot\physx_outputs\official_demo_full`
- 本地 Step 1-7 精读材料：`C:\Users\robot\Documents\成长学习库\physx_omni_paper_*step*.md`

