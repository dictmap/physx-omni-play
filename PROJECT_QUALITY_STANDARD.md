# PhysX-Omni 项目质量标准

本项目按“可阅读、可复现、可验证”的研究交付标准整理。每个重要结论都应能对应到一个入口文件、一个来源记录、一个本地证据路径和一个可运行的验证检查。

## Gate 1：阅读完整性

状态：通过

要求：

- Step 1-7 论文精读 Markdown 存在。
- Step 8 概念逐项精讲索引存在。
- Step 9 审稿人质疑存在。
- Step 10 技术实验回答存在。
- 教学前端通过 `materials-data.js` 索引 Markdown 和 Notebook。

## Gate 2：复现证据

状态：通过，但带明确边界

要求：

- 官方 demo 有 7 个 GLB 部件。
- 官方 demo 在复现报告中记录了 `basic_info.json`、`basic.urdf`、`basic.xml`。
- M&M's body-focus 测试记录 voxel 数量和 mesh-only 输出。
- 复现证据旁必须说明限制，不能把压力测试说成 benchmark 成功。

已知限制：

- M&M's 几何解码是一次真实图片压力测试，不是物理准确的高罐完整重建。

## Gate 3：来源可追溯

状态：通过

要求：

- 论文 URL、本地 PDF 和 HTML 已记录。
- GitHub 来源 URL 和本地 checkout 路径已记录。
- 作者源码 tarball、TeX、figure、bib 已记录。
- Hugging Face 本地模型/数据缓存目录已记录。

## Gate 4：前端质量

状态：通过

要求：

- HTTP 模式支持 Three.js GLB 交互。
- `file://` 模式支持教学内容、材料库和搜索。
- 3D 渲染逻辑与教学内容渲染逻辑分离。
- 页面明确说明 `file://` 与 HTTP 模式的能力边界。

## Gate 5：自动化

状态：通过

要求：

- `build_materials_data.py` 可重新生成教学站材料索引。
- `scripts/validate_physx_omni_quality.py` 可验证项目结构和资产数量。
- `reproduce_quality.sh` 固化官方质量复现路径。

## Gate 6：非声明项

状态：通过

项目不得声称：

- 已证明 sim-to-real 提升；
- 已证明替换 VLM judge 后排名稳定；
- 已证明跨 MuJoCo、Isaac Sim、Genesis 动态一致；
- 已能从单图可靠推断质量、惯量、摩擦；
- 当前 M&M's mesh-only GLB 等同于官方 textured GLB。
