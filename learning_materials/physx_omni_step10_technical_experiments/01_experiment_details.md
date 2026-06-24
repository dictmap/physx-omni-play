# 第十步实验细节

## 1. 实验脚本

入口：

```powershell
python C:\Users\robot\Documents\成长学习库\physx_omni_step10_technical_experiments\run_step10_experiments.py
```

输出：

```text
C:\Users\robot\Documents\成长学习库\physx_omni_step10_technical_experiments\results\step10_experiment_results.json
```

## 2. 本地复现产物扫描

扫描目录：

```text
C:\Users\robot\physx_outputs
```

扫描结果：

| 输出目录 | 状态 | 检出部件 | 非零 voxel 部件 | 零 voxel 部件 | 总 voxel | 用时秒 | 是否有 URDF/XML |
|---|---|---:|---:|---:|---:|---:|---|
| `official_demo_full` | success | 7 | 7 | 0 | 22031 | 393.95 | 是 |
| `mms_yellow` | success | 4 | 1 | 3 | 2237 | 594.48 | 否 |
| `mms_yellow_body_focus` | success | 4 | 3 | 1 | 6188 | 428.57 | 否 |
| `mms_yellow_preprocessed` | 预处理图 | - | - | - | - | - | 否 |
| `mesh_part0` | mesh 低显存测试 | - | - | - | - | 23.68 | 否 |

解释：

- 官方 demo 是完整复现样例，适合做 URDF/MJCF 审计。
- M&M's 原图和主体聚焦图说明裁剪强烈影响生成质量。
- M&M's 当前没有同步完整 URDF/XML，因此不能用它回答动力学字段完整性。

## 3. M&M's 罐子为什么看起来矮

输入裁剪高宽比：

| 输入图 | 高宽比 |
|---|---:|
| `mms_yellow_crop_body_focus.jpg` | 1.0566 |
| `mms_yellow_crop_lid_body.jpg` | 1.0524 |
| `mms_yellow_crop_whole_can.jpg` | 1.2196 |

生成 projection 的主侧视比例：

| 输出 | XZ component 高宽比 | YZ component 高宽比 |
|---|---:|---:|
| `mms_yellow_body_focus` | 0.2833 | 0.2843 |

解释：

输入图里的罐子是偏高物体，但生成 voxel 的侧视主连通区域明显偏扁。这支持用户的观察：“出来的好像有点矮”。它可能来自单图透视歧义、裁剪对主体/盖子的取舍、训练先验、RLE/voxel 分辨率和 VLM 部件生成失败共同作用。

## 4. URDF/MJCF 物理字段审计

官方 demo 的 JSON 层：

- object: Dumpster；
- category: Waste Container；
- dimension: `180*120*150`；
- part_count: 7；
- materials: Steel with Rubber、Steel、Plastic (HDPE)；
- density: 4.45、7.8、0.95；
- Young's Modulus: 100.005、210.0、1.0、200.0 GPa；
- Poisson's Ratio: 0.395、0.3、0.4。

URDF 层：

- links: 13；
- joints: 12；
- mass_count: 13；
- unique_masses: `[1.0]`；
- all_mass_is_one: true；
- inertia_count: 13；
- unique_inertia_count: 1；
- friction_attr_count: 0。

MJCF/XML 层：

- geoms: 16；
- joints: 5；
- density_count: 7；
- unique_densities: `4450.0`、`7800.0`、`950.0`；
- geom_mass_attr_count: 0；
- body_inertia_attr_count: 0；
- friction_attr_count: 5；
- frictionloss: 全 `0.0`。

解释：

JSON 层有材料语义，MJCF 层带 density，URDF 层则明显是默认质量/惯量。这个差异说明“生成了物理参数”不等于“最终仿真文件拥有可靠 dynamics 字段”。

## 5. MuJoCo smoke test

测试对象：

```text
C:\Users\robot\physx_outputs\official_demo_full\basic.xml
```

结果：

- status: success；
- nq: 12；
- nv: 11；
- nbody: 7；
- ngeom: 8；
- njnt: 6；
- step: 200；
- final_time: 0.4；
- qvel_abs_max: 2.1843。

解释：

这个结果证明官方 demo 的 MJCF 能被 MuJoCo 加载并短步进。它是可运行性证据，不是物理真实性证据。

## 6. 仿真器可用性

本机检查：

| 包 | 可用 |
|---|---:|
| mujoco | true |
| pxr | true |
| genesis | false |
| isaacsim | false |
| omni | false |

解释：

本轮不能做 Genesis/Isaac Sim 的实际一致性实验。跨仿真器结论必须保持为“未验证”。

## 7. RLE 压力测试

方法：

- 构造 synthetic voxel shape；
- 对每个 z-slice 做 2D RLE；
- 用 `char_count / 4` 作为 token proxy；
- 对照官方训练数据中 `tokennum < 20000` 的过滤逻辑。

关键结果：

| grid | shape | token proxy | 判断 |
|---:|---|---:|---|
| 64 | solid cylinder | 4029.0 | 轻松通过 |
| 64 | hollow cylinder shell | 6375.0 | 通过 |
| 64 | random 5% occupancy | 20703.5 | 接近/超过过滤阈值 |
| 64 | checkerboard dense | 217096.0 | 严重超限 |
| 128 | solid cylinder | 17587.2 | 接近阈值 |
| 128 | hollow cylinder shell | 29921.5 | 超限 |
| 128 | random 5% occupancy | 182779.0 | 严重超限 |

解释：

template/RLE 对规则形体友好，但复杂拓扑和高分辨率会迅速吃掉 token budget。

## 8. Benchmark judge/prompt 审计

结果：

- 默认 judge `Qwen/Qwen3.5-122B-A10B` 命中 9 次；
- auto-score 或缺失证据 0 分逻辑命中 10 次；
- prompt prior/common sense 命中：
  - affordance: 6；
  - dimension: 1；
  - material: 15；
  - VAPS/KPS: 24。
- tiny benchmark 只有 1 条 RQS smoke：
  - count: 1；
  - mean: 100.0；
  - std: 0.0。

解释：

benchmark 管线有分母一致性和缺失证据惩罚，这是优点；但多 judge 排名稳定性仍未由当前实验覆盖。

## 9. 第十步实验边界

本轮没有做到：

- 多 VLM judge 实跑；
- Isaac Sim / Genesis 跨仿真器实跑；
- 真实机器人训练；
- 真实物体 mass/inertia/friction/material 测量；
- 大规模 PhysX-Bench 全量重跑。

因此所有结论都限定在本地可复现实验范围内。
