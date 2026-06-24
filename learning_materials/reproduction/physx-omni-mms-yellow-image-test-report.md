# PhysX-Omni 自定义图片测试：黄色 M&M's 罐

测试日期：2026-06-20  
输入图片：`C:\Users\robot\xwechat_files\a29884271_7b59\temp\RWTemp\2026-06\7a1b6ebdd17d94869fd79244d8b91f84\170406c2c260543630fc3cf40452fe0a.jpg`  
远端输入：`/data/light/repro/physx_omni_2605_21572/custom_inputs/mms_yellow_170406c2.jpg`  
远端输出目录：`/data/light/repro/physx_omni_2605_21572/repro_runs/user_mms_yellow_vlm/mms_yellow_170406c2`

## 运行结果

VLM/RLE 阶段运行成功：

- status：`success`
- mode：`4bit`
- detected_parts：`4`
- parts_to_run：`4`
- elapsed_sec：`594.48`
- total_voxels：`2237`

模型把图片识别为 `Peanut Butter Jar / Food Container`，拆成：

- `l_0`: Peanut Butter Content
- `l_1`: Jar Base
- `l_2`: Jar Lid
- `l_3`: Jar Neck/Shoulder

其中只有 `l_2 / Jar Lid` 生成了非空 voxel：

- `ind_0.npy`: `(0, 3)`
- `ind_1.npy`: `(0, 3)`
- `ind_2.npy`: `(2237, 3)`
- `ind_3.npy`: `(0, 3)`

## 可视化输出

本地输出目录：

`C:\Users\robot\physx_outputs\mms_yellow`

关键文件：

- `voxel_projection.png`
- `repro_summary.json`
- `basic_info.txt`
- `mesh_part2\0_mesh_only.glb`
- `mesh_part2\0_mesh_only.obj`
- `mesh_part2\0_mesh_only.ply`
- `mesh_part2\mesh_preview.png`
- `mesh_part2\lowmem_mesh_report.json`

## TRELLIS Mesh 结果

对非空部件 `ind_2.npy` 执行低显存 TRELLIS mesh 解码成功：

- status：`success`
- part_file：`ind_2.npy`
- voxels：`2237`
- slat_coords：`2237`
- vertices：`70588`
- faces：`141172`
- elapsed_sec：`23.53`
- peak CUDA allocated：`5879.98 MiB`

## 质量边界

这张真实拍摄图的结果不等同于完整罐体复原。当前成功的是：

- 模型识别出容器类对象和盖子关节语义。
- 有效重建出一个圆柱/圆盘状盖子部件。

当前不足是：

- 罐体主体、内容物、瓶颈三个部件 voxel 为空。
- 输出 mesh 是 `mesh-only`，没有执行官方默认 Gaussian 贴图烘焙。
- 输入图有透视、遮挡、商标图案和文字，且只给单视角，PhysX-Omni 对这种非 demo 图片稳定性有限。

