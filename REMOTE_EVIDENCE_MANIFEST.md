# PhysX-Omni 复现证据清单

日期：2026-06-25

这个文件只记录已经有证据支持的内容，以及不能越界声称的内容。它和教学叙述分开，方便快速审计。

## 官方参考 Demo

状态：已复现

本地证据目录：

```text
C:\Users\robot\physx_outputs\official_demo_full
```

教学前端同步证据：

```text
official_viewer/assets/parts/0.glb
official_viewer/assets/parts/1.glb
official_viewer/assets/parts/2.glb
official_viewer/assets/parts/3.glb
official_viewer/assets/parts/4.glb
official_viewer/assets/parts/5.glb
official_viewer/assets/parts/6.glb
official_viewer/assets/basic_info.json
official_viewer/assets/evidence/official_7part_mesh_preview.png
```

允许声称：

- 本地 viewer 有 7 个官方 GLB 部件。
- 官方参考链路已生成 `basic_info.json`、`basic.urdf`、`basic.xml`。
- 官方 demo 可以在 HTTP 版 Three.js viewer 中交互查看。

不允许声称：

- 生成的物理参数已经被证明真实可靠。
- 资产已经通过跨仿真器动态验证。
- 这些资产已经证明能提升真实机器人 sim-to-real。

## M&M's 黄色高罐 Body-Focus 测试

状态：压力测试解码完成

本地证据目录：

```text
C:\Users\robot\physx_outputs\mms_yellow_body_focus
```

教学前端同步证据：

```text
official_viewer/assets/mms/cond_img.png
official_viewer/assets/mms/voxel_projection.png
official_viewer/assets/mms/parts/1.glb
official_viewer/assets/mms/parts/2.glb
official_viewer/assets/mms/parts/3.glb
official_viewer/assets/mms/mms_yellow_body_focus_trellis_lowmem_combined.glb
```

实测事实：

| Case | Voxels | 非空部件 | 解释 |
|---|---:|---:|---|
| 原图 | 2237 | 1 / 4 | 基本只有盖子，不是高罐主体重建成功。 |
| body-focus 裁剪 | 6188 | 3 / 4 | 部件覆盖明显改善，但罐身主体仍被压扁。 |

允许声称：

- body-focus 预处理提升了非空部件覆盖。
- TRELLIS 低显存 mesh-only 解码为 3 个非空部件生成了 GLB。
- 用户观察“罐子看起来偏矮”有 voxel 几何证据支持。

不允许声称：

- 这是完整高罐重建。
- mesh-only GLB 等于官方 textured GLB。
- 该资产无需更多验证就能用于机器人训练。

## 复现脚本

本地脚本：

```text
reproduce_quality.sh
run_vlm_repro_one.py
run_trellis_lowmem_mesh.py
run_trellis_lowmem_mesh_parts.py
decode_voxel_parts_to_mesh.py
render_voxel_projections.py
```

质量补丁：

```text
physx_omni_repro_quality.patch
```

远端清理与状态说明：

```text
REMOTE_CLEANUP_NOTES.md
cleanup_remote_worktree.sh
```

## 学习材料证据

教学前端材料索引：

```text
official_viewer/materials-data.js
```

当前索引数量：

- 91 个总文档
- 82 个 Markdown
- 9 个 Jupyter Notebook

验证命令：

```powershell
python scripts/validate_physx_omni_quality.py
```

预期结果：

```text
QUALITY CHECK PASSED
```
