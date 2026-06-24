# PhysX-Omni 第九步：审稿人灵魂拷问

本目录是第九步交付物，围绕用户提出的 7 个审稿问题：

1. 单图生成的物理属性到底有多少是真实推断，多少是常识补全？
2. PhysX-Bench 换一个 VLM judge 后排名是否稳定？
3. 生成资产在 MuJoCo、Isaac Sim、Genesis 等不同仿真器中是否一致稳定？
4. URDF/XML 输出是否包含足够可靠的质量、惯量、摩擦、关节限制？
5. 真实机器人任务中，使用这些生成资产训练是否能提升 sim-to-real 表现？
6. template-based RLE 是否能泛化到更复杂拓扑或更高分辨率？
7. 如果换成 TRELLIS.2 或更强 3D decoder，瓶颈会转移到哪里？

## 文件说明

| 文件 | 内容 |
|---|---|
| `00_reviewer_soul_questions.md` | 主审稿文档，逐条回答 7 个问题，并给出总体审稿判断 |
| `01_evidence_matrix.md` | 证据矩阵，把判断对应到 benchmark、prompt、URDF/XML、RLE 代码和复现产物 |
| `02_required_experiments.md` | 如果要补强论文，审稿人会要求的补实验设计 |
| `03_reviewer_audit_notebook.ipynb` | 可执行 notebook，复核 judge、prompt、URDF/XML、RLE 证据 |
| `reviewer_audit_report.json` | notebook 执行后生成的结构化审计结果 |

## 最核心结论

PhysX-Omni 的强项是把单图到可交互仿真资产的系统链路跑通；但从审稿人视角看，它目前更能证明“生成视觉/语义/物理常识一致的候选资产”，还不能充分证明“从单图恢复真实、可校准、跨仿真器稳定、能提升真实机器人 sim-to-real 的物理资产”。

尤其需要注意：

- DQS/APS/MPS/KPS 的 prompt 明确依赖物体类别先验、日常常识、材料常识和 VLM 判断；
- benchmark 默认 judge 是 `Qwen/Qwen3.5-122B-A10B`，仍需多 judge 排名稳定性；
- 本地官方 demo 的 URDF 中 mass 全为 `1.0`、惯量只有一组唯一值，XML 有 density 但 joint frictionloss 为 `0.0`；
- RLE 编码是 64³ voxel 上的 lossless 表示，但高分辨率和复杂拓扑泛化还需要 scaling 实验；
- 换更强 3D decoder 后，瓶颈会从几何质量转向物理参数校准、关节语义、仿真文件完整性和 benchmark judge 可信度。
