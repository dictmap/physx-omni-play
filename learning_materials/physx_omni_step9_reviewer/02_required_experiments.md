# 第九步：审稿人要求的补实验清单

本文件把七个灵魂拷问转化为可以执行的补实验设计。目标不是否定 PhysX-Omni，而是明确“怎样才能把 plausible asset generation 提升到 calibrated physical asset generation”。

## 实验 A：物理属性真实值标定

目的：回答单图物理属性到底有多少是真实推断。

设计：

- 采集 100-300 个真实物体。
- 每个物体提供单张输入图。
- 对真实物体测量：
  - 外形尺寸；
  - 总质量；
  - 部件质量；
  - 惯量近似；
  - 材料类别；
  - 摩擦系数；
  - 关节类型、轴、限位、阻尼。
- 用 PhysX-Omni 生成资产。
- 比较生成值和实测值。

指标：

- 尺寸相对误差；
- mass 相对误差；
- inertia eigenvalue 相对误差；
- material class accuracy；
- friction error；
- joint type accuracy；
- joint axis angular error；
- joint limit error。

必须报告：

- 单图可见 vs 不可见部件分层；
- 有尺度参照 vs 无尺度参照分层；
- rigid/articulated/deformable 分层。

## 实验 B：VLM judge 稳定性

目的：回答 PhysX-Bench 换 judge 后排名是否稳定。

设计：

- 固定同一批 benchmark 证据。
- 使用多个 judge：
  - Qwen3.5；
  - GPT 系 VLM；
  - Gemini 系 VLM；
  - Claude 系 VLM；
  - 一个强开源 VLM。
- 对每个 judge 使用同一 prompt，再做 prompt paraphrase 版本。
- 对同一模型跑多次或固定 deterministic 设置。

指标：

- 方法排名的 Spearman rho；
- Kendall tau；
- metric-level bootstrap confidence interval；
- pairwise win rate；
- VLM-human correlation。

判定：

- 如果 RQS/MCS 稳定而 APS/KPS/MPS 不稳定，应把 benchmark 结论分层。
- 如果总分 ranking 在多个 judge 上都稳定，PhysX-Bench 可信度显著增强。

## 实验 C：跨仿真器一致性

目的：回答 MuJoCo、Isaac Sim、Genesis 中是否一致稳定。

设计：

- 选 200 个生成资产，覆盖 rigid、articulated、deformable、thin structure、multi-part。
- 对每个资产生成 URDF/MJCF/USD 或相应导入格式。
- 分别在 MuJoCo、Isaac Sim、Genesis 中执行：
  - import；
  - gravity drop；
  - joint sweep；
  - contact slide；
  - push；
  - grasp/open/pull task smoke。

指标：

- import success rate；
- simulation crash rate；
- penetration rate；
- average resting height error；
- joint axis consistency；
- joint limit consistency；
- contact friction behavior；
- task success smoke rate。

必须报告：

- 失败样例图库；
- 每个仿真器的默认参数；
- 单位和坐标转换；
- collision mesh 生成方法。

## 实验 D：URDF/MJCF 物理字段完整性审计

目的：回答输出文件是否包含足够可靠的质量、惯量、摩擦和关节限制。

设计：

- 写一个自动 auditor。
- 对每个生成资产扫描：
  - link mass 是否存在；
  - mass 是否全为 1.0 或其他默认值；
  - inertia 是否存在且正定；
  - inertia 是否与 mesh 尺寸/质量量级一致；
  - friction 是否存在；
  - joint limit 是否存在；
  - damping/frictionloss 是否存在；
  - collision mesh 是否存在；
  - visual/collision scale 是否一致。

指标：

- field completeness；
- default-value ratio；
- physically invalid ratio；
- simulator import warning count；
- auto-fix 后指标变化。

判定：

- 如果 default-value ratio 高，就不能把输出称为可靠 dynamics asset。
- 如果字段完整且跨仿真器稳定，论文物理 claim 才更站得住。

## 实验 E：真实机器人 sim-to-real

目的：回答生成资产训练是否提升真实机器人任务。

设计：

- 选择真实机器人和任务：
  - 抓取罐子/瓶子；
  - 打开盒盖；
  - 拉抽屉；
  - 推/拉带轮容器；
  - 操作开关/按钮。
- 训练三组策略：
  - baseline：无生成资产或普通 domain randomization；
  - handcrafted/scanned：人工或扫描资产；
  - PhysX-Omni：单图生成资产。
- 保持 policy architecture、训练步数、随机种子一致。

指标：

- real success rate；
- contact failure rate；
- slip/drop rate；
- joint operation success；
- out-of-distribution category success；
- sim success vs real success gap。

必须报告：

- 每类任务的成功率；
- 每个物体的失败分析；
- 生成资产错误是否直接导致策略失败。

## 实验 F：RLE 表示 scaling

目的：回答 template-based RLE 是否泛化复杂拓扑或高分辨率。

设计：

- 构造三档分辨率：64³、128³、256³。
- 构造三档拓扑复杂度：
  - simple solid；
  - articulated multi-part；
  - thin/porous/hollow/handle-heavy。
- 同样的模型或可比模型训练/推理。

指标：

- token length distribution；
- valid decode rate；
- voxel IoU；
- chamfer distance；
- thin structure recall；
- mesh watertightness；
- collision stability；
- joint success rate；
- training/inference memory and time。

关键问题：

- 20000 token 过滤会不会系统性排除复杂物体？
- template 复用率随拓扑复杂度如何变化？
- RLE 错误是否集中出现在细长结构和空腔边界？

## 实验 G：TRELLIS vs TRELLIS.2 controlled swap

目的：回答更强 3D decoder 会把瓶颈转移到哪里。

设计：

- 固定 VLM、prompt、物理参数生成、后处理和 benchmark。
- 只替换 decoder：
  - TRELLIS；
  - TRELLIS.2；
  - 其他强 3D decoder。
- 同一输入、同一随机种子或多种子平均。

指标：

- RQS/MCS；
- mesh quality；
- part boundary accuracy；
- collision mesh validity；
- KPS/MPS/APS；
- URDF/MJCF completeness；
- cross-simulator stability；
- real robot small-task success。

判定：

- 如果 RQS/MCS 上升而 KPS/MPS/robot 不上升，说明瓶颈已经从几何转向物理语义和动力学校准。
- 如果所有指标同步提升，说明原 decoder 确实是主瓶颈。

## 推荐 rebuttal 优先级

如果作者时间有限，我会按以下优先级补：

1. VLM judge stability：成本最低，直接支撑 benchmark 可信度。
2. URDF/MJCF auditor：成本低，能诚实暴露 physics file 质量。
3. 跨仿真器 import/drop/joint sweep：中等成本，能验证资产可用性。
4. RLE scaling：中等成本，支撑方法泛化性。
5. 小规模真实机器人 ablation：成本最高，但最能提升论文说服力。

## 最低可接受补充材料

如果不能做完整补实验，至少应提供：

- 全 benchmark 的 raw VLM outputs；
- 每个 metric 的 denominator validation；
- 不同 judge 的小样本 ranking 对比；
- 生成 URDF/MJCF 的字段完整性统计；
- 10-20 个失败案例；
- 对 physical attributes 的 claim 限定说明。

这些材料能让读者正确理解论文边界，也能避免把常识补全误读为真实物理恢复。
