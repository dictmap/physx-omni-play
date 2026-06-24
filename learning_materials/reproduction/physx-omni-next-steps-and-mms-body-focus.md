# PhysX-Omni 当前未完成项与继续推进记录

更新时间：2026-06-20

## 已闭环

- 官方 demo 参考链路已完成：VLM/RLE -> `2infer_geo.py` -> `3jsongen_update.py`
- 本地产物：`C:\Users\robot\physx_outputs\official_demo_full`
- 打包文件：`C:\Users\robot\physx_outputs\physx_omni_official_demo_full_repro.zip`
- 复现补丁：`physx-omni-assets/physx_omni_repro_quality.patch`

## 还可继续推进

1. 真实 M&M's 高罐质量复现  
   原图只生成了盖子，预处理后已经明显改善。下一步可以对预处理图跑 TRELLIS mesh/GLB。

2. 官方产物交互查看器  
   目前已有静态 7 部件预览图，可继续做一个本地 HTML/Three.js 查看器加载 7 个 GLB。

3. 远端复现环境清理  
   远端仓库产生了 `__pycache__` 和中间日志；交付不受影响，但可做一次清理或把关键 patch/命令固化成 `reproduce.sh`。

4. 真实图片输入策略  
   可以批量试 `whole_can / body_focus / lid_body` 三个裁剪版本，选 voxel 非空最多、结构最合理的版本继续几何解码。

## 本次继续推进：高罐预处理 VLM

输入：

`C:\Users\robot\physx_outputs\mms_yellow_preprocessed\mms_yellow_crop_body_focus_square.jpg`

输出：

`C:\Users\robot\physx_outputs\mms_yellow_body_focus`

结果：

- status：`success`
- detected_parts：`4`
- elapsed_sec：`428.57`
- total_voxels：`6188`

部件 voxel：

- `part 0 / Peanut Butter Content`: `0`
- `part 1 / Jar Base`: `2866`
- `part 2 / Jar Lid`: `1759`
- `part 3 / Jar Neck/Shoulder`: `1563`

对比原图：

- 原图有效 voxel：`2237`，只有盖子非空。
- body-focus 裁剪后有效 voxel：`6188`，罐身、盖子、瓶颈都非空。

可视化：

`C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_projection.png`

