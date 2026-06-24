# PhysX-Omni 2605.21572v1 精读与复现包

这是 PhysX-Omni 的本地精读、代码导读、复现证据和交互查看包。

这次整理参考了 `dictmap/roboplay` 的轻量复现仓库风格：主入口清楚、证据边界清楚、来源清单清楚、脚本入口清楚、验证结果可复跑；大体积运行输出不塞进项目树，而是通过 manifest 和报告说明位置与可信边界。

## 入口

| 需求 | 入口 |
|---|---|
| 按顺序读论文 | `LEARNING_INDEX.md` |
| 打开教学前端 | `official_viewer/index.html` |
| 打开带 3D GLB 的 HTTP 版 | `python official_viewer/serve_viewer.py` 后访问 `http://127.0.0.1:8017/index.html` |
| 查看当前复现状态 | `learning_materials/reproduction/physx_omni_current_delivery_report.md` |
| 跑项目质量检查 | `python scripts/validate_physx_omni_quality.py` |
| 查看证据边界 | `REMOTE_EVIDENCE_MANIFEST.md` |
| 查看来源清单 | `SOURCE_MANIFEST.json` |

## 已完成内容

- 论文精读材料已经组织为 Step 1-10。
- 官方参考 demo 已跑通 VLM/RLE、几何解码、URDF/MuJoCo XML 生成。
- 教学前端已经索引 90 个 Markdown/Notebook 文档。
- 官方 7 部件 demo 和 M&M's body-focus mesh 输出都可以在 Three.js viewer 中查看。
- M&M's 高罐结果被明确标注为真实图片压力测试，不等价于官方 benchmark 成功。
- 项目级验证脚本会检查结构、manifest、材料索引、viewer 资产和关键证据文件。

## 没有声称完成的内容

- 没有声称 M&M's 高罐已经被完整、物理准确地重建。
- 没有把 M&M's mesh-only GLB 说成官方 textured GLB。
- 没有把 URDF/XML 文件存在等同于质量、惯量、摩擦、关节限制可靠。
- 没有声称已经完成替换 VLM judge 后的 PhysX-Bench 稳定性验证。
- 没有声称已经完成 MuJoCo、Isaac Sim、Genesis 的跨仿真器动态一致性验证。

## 目录结构

```text
physx-omni-assets/
  README.md
  LEARNING_INDEX.md
  PROJECT_QUALITY_STANDARD.md
  PROJECT_STATUS.json
  SOURCE_MANIFEST.json
  REMOTE_EVIDENCE_MANIFEST.md
  scripts/
    validate_physx_omni_quality.py
  official_viewer/
    index.html
    teaching.js
    boot-viewer.js
    viewer.js
    materials-data.js
    assets/
  learning_materials/
    paper_reading/
    reproduction/
    supporting_notes/
    physx_omni_step8_deepdives/
    physx_omni_step9_reviewer/
    physx_omni_step10_technical_experiments/
  code/PhysX-Omni/
  paper/
  author_sources/
```

## 复现输出

大体积运行输出保留在项目外：

```text
C:\Users\robot\physx_outputs
```

关键同步结果和可信边界见：

```text
REMOTE_EVIDENCE_MANIFEST.md
```

## 质量检查

运行：

```powershell
python C:\Users\robot\Documents\成长学习库\physx-omni-assets\scripts\validate_physx_omni_quality.py
```

预期输出：

```text
QUALITY CHECK PASSED
```

检查内容包括：

- 必要文档和 manifest 是否存在；
- Step 1-10 学习材料是否存在；
- 复现报告和技术实验结果是否存在；
- `official_viewer` 的 HTML/CSS/JS/data 是否完整；
- `materials-data.js` 的文档计数和路径是否新鲜；
- 官方 7 个 GLB 与 M&M's 3 个 GLB 是否齐全；
- `file://` fallback 和 HTTP 3D viewer 的脚本结构是否正确；
- `official_viewer` 内是否混入 `__pycache__`。

## 更新教学前端

新增 Markdown 或 Notebook 后运行：

```powershell
python C:\Users\robot\Documents\成长学习库\physx-omni-assets\official_viewer\build_materials_data.py
python C:\Users\robot\Documents\成长学习库\physx-omni-assets\scripts\validate_physx_omni_quality.py
```

`file://.../official_viewer/index.html` 可用于便携阅读和搜索；完整 3D GLB 交互请使用 `http://127.0.0.1:8017/index.html`。
