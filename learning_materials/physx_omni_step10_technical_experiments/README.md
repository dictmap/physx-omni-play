# PhysX-Omni 第十步：技术专家实验回答

本目录用可复跑的小实验回应第九步的 7 个审稿问题。核心原则：能用本地实验结果回答的直接回答；不能由当前实验推出的，明确标成“未证明”。

## 文件说明

| 文件 | 内容 |
|---|---|
| `run_step10_experiments.py` | 可复跑实验脚本 |
| `results/step10_experiment_results.json` | 实验脚本输出的结构化结果 |
| `00_technical_experiment_answer.md` | 七个问题的技术专家回答 |
| `01_experiment_details.md` | 实验设计、指标、关键数值和边界 |
| `02_technical_experiment_notebook.ipynb` | 可执行 Jupyter 讲解 |

## 本轮实际跑出的关键结果

- 共扫描到 5 组本地输出：`official_demo_full`、`mms_yellow`、`mms_yellow_body_focus`、`mms_yellow_preprocessed`、`mesh_part0`。
- 官方 demo 完整输出成功：7/7 个部件有非零 voxel，总 voxel 数 22031，用时 393.95 秒。
- M&M's 原图版本成功但弱：4 个部件只有 1 个非零 voxel，总 voxel 2237，用时 594.48 秒。
- M&M's 主体聚焦版本更好：4 个部件有 3 个非零 voxel，总 voxel 6188，用时 428.57 秒。
- 官方 demo 的 URDF：13 个 link 的 mass 全为 `1.0`，惯量唯一值只有 1 组，没有 friction 属性。
- 官方 demo 的 MJCF/XML：有 density，MuJoCo 可加载并步进 200 step，但未显式提供 geom mass/body inertia，joint `frictionloss` 全为 `0.0`。
- 本机仿真器可用性：`mujoco=true`，`pxr=true`，`genesis=false`，`isaacsim=false`，`omni=false`。
- RLE 压力测试显示：64³ solid cylinder 约 4029 token proxy；64³ random 5% occupancy 约 20703 token proxy，已超过 20000；128³ hollow cylinder 约 29921 token proxy，也超过 20000。

## 最短技术结论

PhysX-Omni 的本地复现实验证明了：官方链路可以生成可解析、可被 MuJoCo 短步进的仿真候选资产；裁剪/主体聚焦会明显影响单图生成质量；template RLE 对规则形体有效，但对随机/复杂/高分辨率拓扑很快进入 token 压力区。

但当前实验不能证明：单图物理属性是真实测量、PhysX-Bench 多 judge 排名稳定、Isaac/Genesis 与 MuJoCo 一致、URDF/XML 动力学字段可靠、真实机器人 sim-to-real 一定提升。
