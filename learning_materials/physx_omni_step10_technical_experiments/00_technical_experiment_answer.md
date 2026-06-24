# 第十步：用实验结果回答第九步的 7 个问题

论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1)  
代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni)  
实验结果文件：`results/step10_experiment_results.json`

## 实验总览

本轮没有重新跑完整大模型推理，而是基于已经复现得到的本地资产、官方代码、benchmark prompt 和小规模可执行 smoke test 做技术验证。

已运行实验：

- 本地复现产物扫描；
- 官方 demo 的 URDF/MJCF/XML 物理字段审计；
- 官方 demo 的 MuJoCo 加载与 200 step 短步进；
- M&M's 罐子输入裁剪和 voxel projection 的比例分析；
- benchmark prompt/judge 依赖审计；
- template RLE synthetic stress test；
- 本机 MuJoCo/Genesis/Isaac/Omni/PXR 可用性检查。

## 1. 单图生成的物理属性到底有多少是真实推断，多少是常识补全？

**技术回答：当前实验更支持“常识补全/视觉先验为主，真实物理测量为辅或缺失”。**

实验结果：

- 官方 demo 的 `basic_info.json` 对 Dumpster 给出了材料和物理参数：
  - object: Dumpster；
  - category: Waste Container；
  - dimension: `180*120*150`；
  - 材料包括 Steel、Plastic (HDPE)、Steel with Rubber；
  - density: 4.45、7.8、0.95 等；
  - Young's Modulus: 100.005、210.0、1.0、200.0 GPa 等；
  - Poisson's Ratio: 0.395、0.3、0.4 等。
- 这些数值符合材料常识表，但当前实验没有任何真实称重、材料测试、尺度测量或摩擦测量闭环。
- prompt 审计结果显示，常识先验确实深度参与评测：
  - `prompts_affordance.yaml` 中 prior/common-sense 命中 6 处；
  - `prompts_dimension.yaml` 命中 1 处；
  - `prompts_material.yaml` 命中 15 处；
  - `prompts_vaps_english.yaml` 命中 24 处。
- M&M's 罐子实验中，主体聚焦图的输入裁剪高宽比约 1.06-1.22，但生成 voxel side projection 的主要连通区域高宽比只有约 0.28。这和用户观察“罐子看起来有点矮”一致，说明单图尺度/形状推断会受视角、裁剪和先验影响。

结论：

PhysX-Omni 生成的是 plausible physical priors。它能从视觉和语义中猜出“钢、塑料、橡胶、轮子、盖子、容器”这类合理物理属性，但不能把这些值解释成真实物体的 calibrated physical measurements。

## 2. PhysX-Bench 换一个 VLM judge 后排名是否稳定？

**技术回答：当前本地实验不能证明稳定；现有证据只证明官方 benchmark 主要绑定到一个默认 judge。**

实验结果：

- benchmark 代码/README 中 `Qwen/Qwen3.5-122B-A10B` 命中 9 次。
- VLM runner 中 deterministic 或温度空值相关命中 2 次。
- 缺失证据自动打 0 分相关命中 10 次。
- tiny benchmark 只有一个 RQS smoke 行：`ours/mobility/RQS/count=1/mean=100.0/std=0.0`。

结论：

这个 smoke 结果只能证明 benchmark 管线可以聚合一条结果，不能回答“换 judge 排名是否稳定”。要回答稳定性，必须实际跑多 judge，至少给出 Spearman/Kendall 相关、pairwise win rate 和置信区间。当前实验结论是：**未证明稳定**。

## 3. 生成资产在 MuJoCo、Isaac Sim、Genesis 等不同仿真器中是否一致稳定？

**技术回答：官方 demo 在 MuJoCo 中可加载并短步进；Isaac Sim 和 Genesis 一致性未验证。**

实验结果：

- 本机可用性：
  - `mujoco=true`；
  - `pxr=true`；
  - `genesis=false`；
  - `isaacsim=false`；
  - `omni=false`。
- 官方 demo 的 `basic.xml` MuJoCo smoke test 成功：
  - `nq=12`；
  - `nv=11`；
  - `nbody=7`；
  - `ngeom=8`；
  - `njnt=6`；
  - 运行 200 step 后 `final_time=0.4`；
  - `qvel_abs_max=2.1843`。

结论：

本地实验能证明：这一个官方 demo 的 MJCF/XML 至少能被 MuJoCo 加载并步进。  
但不能证明：同一资产在 Isaac Sim、Genesis 中也一致稳定，也不能证明接触、摩擦、关节限位的动力学一致。

## 4. URDF/XML 输出是否包含足够可靠的质量、惯量、摩擦、关节限制？

**技术回答：不足。它足够做可解析/可步进 smoke，不足以支撑可靠动力学。**

实验结果：

URDF 审计：

- 13 个 link；
- 12 个 joint；
- joint 类型：7 fixed、4 continuous、1 revolute；
- 13 个 mass 全是 `1.0`；
- inertia 有 13 个，但唯一惯量组合只有 1 组；
- limit 有 5 个；
- friction 属性数量为 0。

MJCF/XML 审计：

- 16 个 geom；
- 5 个 joint，类型均为 hinge；
- density 有 7 个，唯一值为 `4450.0`、`7800.0`、`950.0`；
- geom mass 属性数量为 0；
- body inertia 属性数量为 0；
- joint frictionloss 有 5 个，但全是 `0.0`。

MuJoCo smoke：

- XML 可加载并步进 200 step。

结论：

这组结果很关键：**可加载不等于动力学可靠**。JSON 层确实有材料/密度/模量语义，但 URDF/MJCF 层的质量、惯量、摩擦、阻尼、关节限制仍明显不足。作为视觉资产或初步仿真候选可以；作为真实机器人训练的高可信 dynamics asset 不够。

## 5. 真实机器人任务中，使用这些生成资产训练是否能提升 sim-to-real 表现？

**技术回答：当前实验没有真实机器人证据，不能证明提升。**

实验结果：

- 本地复现产物包含 voxel、mesh、URDF/MJCF、projection、benchmark tiny result。
- 没有发现真实机器人策略训练日志；
- 没有 real success rate；
- 没有 generated assets vs scanned/handcrafted/baseline 的 ablation；
- 没有 sim success vs real success gap。

结论：

从工程潜力看，PhysX-Omni 资产可能帮助扩大训练物体多样性；但从当前实验结果看，**不能得出 sim-to-real 提升结论**。这需要真实机器人任务实验单独证明。

## 6. template-based RLE 是否能泛化到更复杂拓扑或更高分辨率？

**技术回答：对规则形体有效；复杂拓扑和高分辨率会快速遇到 token 压力。**

实验结果来自 synthetic RLE stress test，指标是 RLE char count / 4 的 token proxy：

| grid | shape | total runs | token proxy | 是否超过 20000 |
|---:|---|---:|---:|---|
| 64 | solid cylinder | 2040 | 4029.0 | 否 |
| 64 | hollow cylinder shell | 3570 | 6375.0 | 否 |
| 64 | thin diagonal wires | 312 | 533.0 | 否 |
| 64 | checkerboard dense | 129056 | 217096.0 | 是 |
| 64 | random 5% occupancy | 12306 | 20703.5 | 是 |
| 128 | solid cylinder | 8446 | 17587.2 | 否 |
| 128 | hollow cylinder shell | 14420 | 29921.5 | 是 |
| 128 | checkerboard dense | 1040448 | 1904496.0 | 是 |
| 128 | random 5% occupancy | 99846 | 182779.0 | 是 |

结论：

RLE 对规则、连续、切片重复度高的形体很有效；但对随机孔洞、复杂边界、密集细节、高分辨率薄壳会快速超过 token 预算。第九步的担忧成立：template-based RLE 的泛化性需要按拓扑复杂度和分辨率实测，而不是只凭 lossless 编码性质证明。

## 7. 如果换成 TRELLIS.2 或更强 3D decoder，瓶颈会转移到哪里？

**技术回答：几何会改善，但瓶颈会转向物理参数、关节语义、仿真字段完整性和评测可信度。**

实验结果：

- `mesh_part0` 的低显存 mesh 生成成功：
  - 输入 part voxel 数 56；
  - 生成 mesh 顶点 1716；
  - faces 3428；
  - 用时 23.68 秒；
  - peak memory 约 5730.55 MiB。
- 这说明 decoder 可以把稀疏 voxel/part 表示转成高面数 mesh。
- 但同一个官方 demo 的 URDF/MJCF 审计显示，物理字段仍有缺口：
  - URDF mass 全 1.0；
  - inertia 唯一值只有 1；
  - URDF 无 friction；
  - XML frictionloss 全 0.0。

结论：

更强 decoder 很可能提升 RQS/MCS 和视觉几何质量；但如果物理字段生成、关节参数校准、collision mesh、摩擦/惯量/阻尼和 benchmark judge 不变，系统瓶颈会从“几何像不像”转移到“物理对不对、能不能稳定用于任务”。

## 第十步最终技术判断

实验支持的结论：

- 官方链路能复现成功，并能生成可被 MuJoCo 加载/短步进的资产。
- 裁剪/主体聚焦明显影响单图生成质量；M&M's 罐子“变矮”有 projection 层面的量化证据。
- URDF/MJCF 目前更像可运行候选资产，不是可靠动力学资产。
- RLE 在规则形体上有效，但复杂/高分辨率形体会出现 token 压力。

实验不能支持的结论：

- 单图真实恢复物理属性；
- PhysX-Bench 多 judge 排名稳定；
- MuJoCo/Isaac/Genesis 跨仿真器一致；
- 真实机器人 sim-to-real 提升。

所以，第十步用实验把第九步的审稿质疑进一步收敛成一个技术判断：**PhysX-Omni 已经能生成 plausible、可运行、可评估的物理资产候选；但距离 calibrated、cross-simulator-stable、robot-training-ready 的物理资产，还有明确工程缺口。**
