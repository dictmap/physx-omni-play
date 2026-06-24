# 29 BibTeX 精讲

对应 `paper-reading.md`：`## 29. 适合引用的 BibTeX`

## BibTeX

```bibtex
@article{cao2026physxomni,
  title={PhysX-Omni: Unified Simulation-Ready Physical 3D Generation for Rigid, Deformable, and Articulated Objects},
  author={Cao, Ziang and Liu, Yinghao and Li, Haitian and Yao, Runmao and Hong, Fangzhou and Chen, Zhaoxi and Pan, Liang and Liu, Ziwei},
  journal={arXiv preprint arXiv:2605.21572},
  year={2026}
}
```

## 引用时应写清楚的内容

如果在报告或笔记中引用，建议同时标注：

- arXiv v1：2026-05-20。
- 项目页：`https://physx-omni.github.io/`
- 代码：`https://github.com/physx-omni/PhysX-Omni`
- 模型：`https://huggingface.co/PhysX-Omni/PhysX-Omni`
- 数据：`https://huggingface.co/datasets/PhysX-Omni/PhysXVerse`
- benchmark：`https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench`

## 推荐中文引用说明

```text
Cao 等人在 PhysX-Omni 中提出 unified simulation-ready physical 3D generation 框架，
面向 rigid、deformable 和 articulated objects，结合 Qwen2.5-VL、template-based RLE 几何表示、
PhysXVerse 数据集和 PhysX-Bench 评测，实现从单图到带物理属性、部件结构和运动学关系的 3D 仿真资产生成。
```

## 注意事项

论文仍是 arXiv v1。若后续出现 v2、会议版本或正式出版版本，引用应更新到最新正式版本。代码和 Hugging Face 资产也可能更新，复现报告中应记录 commit、模型 sha 和下载日期。

