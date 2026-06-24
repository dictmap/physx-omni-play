# PhysX-Omni 阅读索引

论文：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1)  
官方代码：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni)  
本地资料根目录：`C:\Users\robot\Documents\成长学习库`  
本地复现输出：`C:\Users\robot\physx_outputs`

这个索引用来把前面 1-10 步精读、复现、审稿质疑、技术实验和 M&M's 实测输出串起来。建议不要从所有文件顺序硬读，而是按下面路径读。

## 0. 最快读懂路线

如果只想快速建立全局认识，按这个顺序：

1. `physx-omni-2605.21572v1-paper-reading.md`  
   最早的论文精读总览，适合先建立问题、方法、实验和结论的整体图。

2. `physx_omni_paper_code_assets_deep_reading_step1.md`  
   代码、模型、数据资产和官方主流程。先弄清楚 repo、数据、模型、推理链路在哪里。

3. `physx_omni_paper_core_innovations_step3.md`  
   最核心创新点。重点看 template RLE、PhysXVerse/PhysX-Bench、单图到物理资产的 pipeline。

4. `physx_omni_step9_reviewer/00_reviewer_soul_questions.md`  
   站在 reviewer 角度看这篇论文哪里还不够硬。

5. `physx_omni_step10_technical_experiments/00_technical_experiment_answer.md`  
   用本地实验结果回答 reviewer 的七个问题。

6. `physx_omni_current_delivery_report.md`  
   当前复现和 M&M's 罐子实验的最新交付状态。

## 1. 论文精读主线

| 步骤 | 文件 | 适合回答的问题 |
|---:|---|---|
| 1 | `physx_omni_paper_code_assets_deep_reading_step1.md` / `.ipynb` | 开源了吗？代码、模型、数据、官方流程在哪里？ |
| 2 | `physx_omni_paper_author_deep_reading_step2.md` / `.ipynb` | 作者来自哪些团队？相关研究背景是什么？ |
| 3 | `physx_omni_paper_core_innovations_step3.md` / `.ipynb` | 核心创新点是什么？每个创新具体怎么做？ |
| 4 | `physx_omni_paper_baselines_experiments_step4.md` / `.ipynb` | baseline 和实验怎么设计？代码里怎么对应？ |
| 5 | `physx_omni_paper_bench_step5.md` / `.ipynb` | PhysX-Bench 评测指标和数据字段是什么？ |
| 6 | `physx_omni_paper_datasets_step6.md` / `.ipynb` | PhysXVerse/PhysXNet/PhysX-Mobility 数据如何构建？ |
| 7 | `physx_omni_paper_competitor_landscape_step7.md` / `.ipynb` | 和其他方法怎么比？哪些竞品值得复现？ |
| 8 | `physx_omni_step8_deepdives/00_index.md` | 对 paper-reading 提到的概念逐个精讲 |
| 9 | `physx_omni_step9_reviewer/README.md` | 审稿人视角的七个灵魂拷问 |
| 10 | `physx_omni_step10_technical_experiments/README.md` | 用实验结果回答第九步的问题 |

## 2. Step 8 概念精讲入口

Step 8 是最适合“逐概念慢读”的目录：

```text
physx_omni_step8_deepdives/
```

入口：

```text
physx_omni_step8_deepdives/00_index.md
```

里面有 29 个专题，包括：

- 单句话结论；
- 开源和 license；
- 问题定义；
- 输入输出；
- 方法总览；
- global-to-local；
- template RLE；
- mesh/pointcloud tradeoff；
- PhysXVerse；
- PhysX-Bench；
- metrics；
- training；
- GitHub inference pipeline；
- benchmark code；
- ablation；
- robot policy learning；
- scene generation；
- strengths/boundaries；
- prior work；
- reproduction route；
- glossary。

建议读法：

1. 先看 `00_index.md`。
2. 对照主论文读 `05_method_overview.md`、`07_template_rle_geometry.md`、`10_physxbench_framework.md`。
3. 做复现时看 `13_github_inference_pipeline.md`、`14_benchmark_code.md`、`23_reproduction_route.md`。
4. 写评审或答辩时看 `20_strengths.md`、`21_boundaries.md`、`27_reading_judgement.md`、`28_followup_questions.md`。

## 3. 复现证据索引

### 官方 demo 完整复现

报告：

```text
physx-omni-official-demo-full-repro-report.md
```

本地输出：

```text
C:\Users\robot\physx_outputs\official_demo_full
```

关键资产：

```text
C:\Users\robot\physx_outputs\official_demo_full\basic_info.json
C:\Users\robot\physx_outputs\official_demo_full\basic.urdf
C:\Users\robot\physx_outputs\official_demo_full\basic.xml
C:\Users\robot\physx_outputs\official_demo_full\objs\0\0.glb
...
C:\Users\robot\physx_outputs\official_demo_full\objs\6\6.glb
```

结论：

- 官方 7 部件链路已闭环；
- 有 JSON、voxel、mesh、GLB、URDF、MJCF/XML；
- MuJoCo 可加载 `basic.xml` 并短步进；
- 但 URDF/MJCF 动力学字段还不够可靠。

### M&M's 黄色高罐

最早原图测试：

```text
physx-omni-mms-yellow-image-test-report.md
C:\Users\robot\physx_outputs\mms_yellow
```

body-focus 裁剪后测试：

```text
physx-omni-next-steps-and-mms-body-focus.md
C:\Users\robot\physx_outputs\mms_yellow_body_focus
```

最新交付总结：

```text
physx_omni_current_delivery_report.md
```

关键输出：

```text
C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_projection.png
C:\Users\robot\physx_outputs\mms_yellow_body_focus\lowmem_mesh_parts_report.json
C:\Users\robot\physx_outputs\mms_yellow_body_focus\mms_yellow_body_focus_trellis_lowmem_combined.glb
C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_mesh_fallback\mms_yellow_body_focus_voxel_mesh_combined.glb
```

关键结论：

- 原图：4 个 part 只有 1 个非空，总计 2237 voxels。
- body-focus 裁剪：4 个 part 有 3 个非空，总计 6188 voxels。
- TRELLIS lowmem mesh-only 解码成功，3 个非空 part 都生成 GLB/OBJ/PLY。
- 但罐身被 VLM voxel 输出压扁，mesh decoder 不能自动恢复连续高罐身。

## 4. 交互查看器

官方 7 部件 viewer：

```text
physx_omni_official_viewer/
```

运行：

```powershell
python C:\Users\robot\Documents\成长学习库\physx_omni_official_viewer\serve_viewer.py
```

打开：

```text
http://127.0.0.1:8017/index.html
```

功能：

- 加载官方 7 个 GLB；
- part 显隐；
- main body solo；
- opacity；
- wireframe；
- auto rotate；
- reset camera；
- 读取 `basic_info.json` 显示材料和 density。

## 5. 审稿与技术质疑索引

### 第九步：Reviewer 灵魂拷问

目录：

```text
physx_omni_step9_reviewer/
```

核心文件：

```text
physx_omni_step9_reviewer/00_reviewer_soul_questions.md
physx_omni_step9_reviewer/01_evidence_matrix.md
physx_omni_step9_reviewer/02_required_experiments.md
physx_omni_step9_reviewer/03_reviewer_audit_notebook.ipynb
```

七个问题：

1. 单图物理属性到底是真实推断还是常识补全？
2. PhysX-Bench 换 VLM judge 后排名是否稳定？
3. 生成资产在 MuJoCo/Isaac/Genesis 是否一致？
4. URDF/XML 的质量、惯量、摩擦、关节限制是否可靠？
5. 是否提升真实机器人 sim-to-real？
6. template-based RLE 是否泛化复杂拓扑和高分辨率？
7. 换 TRELLIS.2 后瓶颈转移到哪里？

### 第十步：技术实验回答

目录：

```text
physx_omni_step10_technical_experiments/
```

核心文件：

```text
physx_omni_step10_technical_experiments/00_technical_experiment_answer.md
physx_omni_step10_technical_experiments/01_experiment_details.md
physx_omni_step10_technical_experiments/02_technical_experiment_notebook.ipynb
physx_omni_step10_technical_experiments/results/step10_experiment_results.json
```

关键结论：

- 官方 MJCF 能被 MuJoCo 加载并短步进。
- URDF 中 mass 全为 `1.0`，inertia 唯一值只有 1 组，friction 缺失。
- XML 有 density，但 joint `frictionloss` 全为 `0.0`。
- RLE 对规则形体有效，但复杂/高分辨率拓扑有 token 压力。
- 真实机器人 sim-to-real、多 judge 稳定性、跨 Isaac/Genesis 一致性仍未证明。

## 6. 代码与脚本索引

本地官方代码和资产目录：

```text
physx-omni-assets/
physx-omni-assets/code/PhysX-Omni
```

质量补丁：

```text
physx-omni-assets/physx_omni_repro_quality.patch
```

新增脚本：

```text
physx-omni-assets/reproduce_quality.sh
physx-omni-assets/cleanup_remote_worktree.sh
physx-omni-assets/run_trellis_lowmem_mesh_parts.py
physx-omni-assets/decode_voxel_parts_to_mesh.py
physx-omni-assets/start_mms_body_focus_decode_remote.sh
```

脚本用途：

| 脚本 | 用途 |
|---|---|
| `reproduce_quality.sh` | 远端 4090 一键跑 `2infer_geo.py` 和 `3jsongen_update.py` |
| `cleanup_remote_worktree.sh` | 清理远端 `__pycache__`、`.pyc`、临时日志，保留 intentional source diff |
| `run_trellis_lowmem_mesh_parts.py` | 低显存多 part TRELLIS mesh-only 解码 |
| `decode_voxel_parts_to_mesh.py` | 本地 voxel fallback mesh 解码 |
| `start_mms_body_focus_decode_remote.sh` | 在 4090 上启动 M&M's body-focus 多 part 解码 |

远端当前状态：

```text
remote host: light-47022
remote root: /data/light/repro/physx_omni_2605_21572
remote repo: /data/light/repro/physx_omni_2605_21572/code/PhysX-Omni
```

远端 repo 清理后只保留两处 intentional diff：

```text
M decoder_each.py
M trellis/pipelines/trellis_image_to_3d.py
```

## 7. 当前最重要的技术判断

1. **论文和代码已开源，官方主流程已在 4090 上跑通。**

2. **PhysX-Omni 很适合生成 plausible simulation asset candidate。**  
   它能把单图变成部件、voxel、mesh、URDF/MJCF 资产。

3. **不要把当前输出误读成真实物理测量。**  
   材料、密度、杨氏模量、关节、质量和摩擦很大程度依赖视觉/类别常识和默认值。

4. **M&M's 高罐问题暴露的是单图几何先验问题。**  
   body-focus 裁剪改善了非空 voxel 数，但 VLM 输出仍把罐身压扁。

5. **TRELLIS mesh decoder 能成功把非空 part 解成 mesh。**  
   但它忠实解码已有 voxel/SLAT 结构，不能修复前端 VLM 几何结构错误。

6. **下一步如果继续优化 M&M's，高价值方向不是再换 mesh decoder，而是改输入和前端结构约束。**  
   例如多视角、显式高度提示、尺度参考、mask/crop 更精确、或后处理约束连续罐身。

## 8. 推荐后续阅读/行动

如果要写报告：

1. 读 `physx_omni_paper_code_assets_deep_reading_step1.md`。
2. 读 `physx_omni_paper_core_innovations_step3.md`。
3. 引用 `physx_omni_step9_reviewer/01_evidence_matrix.md`。
4. 用 `physx_omni_step10_technical_experiments/01_experiment_details.md` 做实验证据。
5. 最后引用 `physx_omni_current_delivery_report.md` 作为最新复现状态。

如果要继续复现：

1. 打开官方 viewer 检查 7 部件资产。
2. 看 M&M's TRELLIS lowmem combined GLB。
3. 对 M&M's 做更强输入约束后重跑 VLM。
4. 再跑 `run_trellis_lowmem_mesh_parts.py` 解码新 voxel。

如果要继续做论文批判：

1. 从第九步七问开始。
2. 用第十步实验证据逐条补强。
3. 优先补多 VLM judge 稳定性、URDF/MJCF 字段完整性、跨仿真器导入稳定性。
