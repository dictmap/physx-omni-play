window.PHYSX_OMNI_LIBRARY = {
  "generatedAt": "2026-06-25",
  "assetRoot": ".",
  "counts": {
    "documents": 90,
    "markdown": 81,
    "notebooks": 9
  },
  "groups": {
    "官方代码文档": 6,
    "官方代码 Bench": 6,
    "项目入口与交付说明": 8,
    "主线精读 Step 1-7": 15,
    "Step 10 技术实验回答": 4,
    "Step 8 概念逐项精讲": 30,
    "Step 9 审稿人质疑": 5,
    "复现记录与实测": 5,
    "支撑笔记与矩阵": 10,
    "前端查看器": 1
  },
  "documents": [
    {
      "type": "markdown",
      "group": "官方代码文档",
      "title": "README",
      "relPath": "code/PhysX-Omni/applications_scene/README.md",
      "href": "../code/PhysX-Omni/applications_scene/README.md",
      "lines": 68,
      "bytes": 1702,
      "outline": [
        {
          "level": 3,
          "text": "Installation"
        },
        {
          "level": 3,
          "text": "Inference"
        }
      ],
      "excerpt": "1. Depth-Anything: 2. Grounded-Segment-Anything **Note**: We release the `requirements.txt` file. 3. Qwen-Image 1. Download the pre-train model. 2. Run the inference code"
    },
    {
      "type": "markdown",
      "group": "官方代码 Bench",
      "title": "Water Material Video Rendering",
      "relPath": "code/PhysX-Omni/benchmark/code/render/material_batch/water/document.md",
      "href": "../code/PhysX-Omni/benchmark/code/render/material_batch/water/document.md",
      "lines": 42,
      "bytes": 1022,
      "outline": [
        {
          "level": 1,
          "text": "Water Material Video Rendering"
        }
      ],
      "excerpt": "This renderer creates water-entry videos for MPS. It expects watertight, face-limited meshes under: and material metric JSON files under: The default output folder is: Prepare watertight meshes first: Then render one or more method/dataset pairs:"
    },
    {
      "type": "markdown",
      "group": "官方代码 Bench",
      "title": "Multi-view Render Toolkit",
      "relPath": "code/PhysX-Omni/benchmark/code/render/views/README.md",
      "href": "../code/PhysX-Omni/benchmark/code/render/views/README.md",
      "lines": 68,
      "bytes": 1499,
      "outline": [
        {
          "level": 1,
          "text": "Multi-view Render Toolkit"
        },
        {
          "level": 2,
          "text": "Files"
        },
        {
          "level": 2,
          "text": "Environment"
        },
        {
          "level": 2,
          "text": "Recommended Command"
        },
        {
          "level": 2,
          "text": "View Modes"
        },
        {
          "level": 2,
          "text": "Output"
        }
      ],
      "excerpt": "This folder contains the Blender-based renderer used to create the rendered views consumed by RQS, MCS, and DCS. Run commands from the repository root. If Blender needs a custom runtime library path, set it explicitly: Each object is written as:"
    },
    {
      "type": "markdown",
      "group": "官方代码 Bench",
      "title": "Render Usage",
      "relPath": "code/PhysX-Omni/benchmark/code/render/views/USAGE.md",
      "href": "../code/PhysX-Omni/benchmark/code/render/views/USAGE.md",
      "lines": 38,
      "bytes": 1030,
      "outline": [
        {
          "level": 1,
          "text": "Render Usage"
        }
      ],
      "excerpt": "Run from the repository root. Render one source: Render several sources: Use `benchmark/code/render/views/run_render.sh` only after editing `benchmark/code/render/views/config.sh` or overriding its variables through the environment."
    },
    {
      "type": "markdown",
      "group": "官方代码 Bench",
      "title": "Benchmark Installation",
      "relPath": "code/PhysX-Omni/benchmark/INSTALL.md",
      "href": "../code/PhysX-Omni/benchmark/INSTALL.md",
      "lines": 118,
      "bytes": 2614,
      "outline": [
        {
          "level": 1,
          "text": "Benchmark Installation"
        },
        {
          "level": 2,
          "text": "System Requirements"
        },
        {
          "level": 2,
          "text": "Conda Environment"
        },
        {
          "level": 2,
          "text": "Blender"
        },
        {
          "level": 2,
          "text": "Headless Rendering"
        }
      ],
      "excerpt": "The benchmark has four execution layers: 1. lightweight manifest / aggregation scripts; 2. VLM inference with PyTorch and Transformers; 3. Blender multi-view rendering for RQS, MCS, and DCS; 4. MuJoCo and Genesis rendering/simulation for KPS and MPS. Install only the layers you need. For example, denominator validation and manifest building use only the Python standard library plus small image dependencies, while VLM"
    },
    {
      "type": "markdown",
      "group": "官方代码 Bench",
      "title": "PhysX-Omni Benchmark",
      "relPath": "code/PhysX-Omni/benchmark/README.md",
      "href": "../code/PhysX-Omni/benchmark/README.md",
      "lines": 673,
      "bytes": 21392,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni Benchmark"
        },
        {
          "level": 2,
          "text": "Installation"
        },
        {
          "level": 1,
          "text": "Optional: choose a Hugging Face cache or local model path."
        },
        {
          "level": 1,
          "text": "Headless rendering defaults."
        },
        {
          "level": 2,
          "text": "Configuration"
        },
        {
          "level": 2,
          "text": "Metrics"
        },
        {
          "level": 2,
          "text": "Directory Layout"
        },
        {
          "level": 2,
          "text": "Expected Input"
        },
        {
          "level": 2,
          "text": "Full-run Scripts"
        },
        {
          "level": 1,
          "text": "Shared condition-image preparation."
        },
        {
          "level": 1,
          "text": "Static / functional metrics."
        },
        {
          "level": 1,
          "text": "Dynamic / material metrics."
        }
      ],
      "excerpt": "This folder contains the metric-first benchmark pipeline for evaluating generated 3D objects with VLM judges. Run commands from the repository root: The pipeline is: See [INSTALL.md](INSTALL.md) for CUDA, Blender, MuJoCo, Genesis, EGL/OpenGL, ffmpeg, and VLM environment notes. Quick start: Before a large run, execute the tiny smoke test. It does not require a VLM or GPU; it checks manifest building, aggregation, and"
    },
    {
      "type": "markdown",
      "group": "官方代码 Bench",
      "title": "Tiny Smoke Test",
      "relPath": "code/PhysX-Omni/benchmark/tiny_example/README.md",
      "href": "../code/PhysX-Omni/benchmark/tiny_example/README.md",
      "lines": 16,
      "bytes": 492,
      "outline": [
        {
          "level": 1,
          "text": "Tiny Smoke Test"
        }
      ],
      "excerpt": "Run: The script creates a tiny generated fixture under `benchmark/tiny_example/generated/`, builds an RQS manifest, writes one fake VLM `result.json`, runs aggregation, and validates denominator counts. It does not require a GPU or a downloaded VLM. Use it to verify that the local Python environment can run the manifest, aggregation, and validation layers before launching large benchmark jobs."
    },
    {
      "type": "markdown",
      "group": "官方代码文档",
      "title": "PhysX-Omni 代码目录入口",
      "relPath": "code/PhysX-Omni/LEARNING_INDEX.md",
      "href": "../code/PhysX-Omni/LEARNING_INDEX.md",
      "lines": 23,
      "bytes": 496,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 代码目录入口"
        }
      ],
      "excerpt": "这里是官方代码 checkout。论文讲解和复现说明统一放在项目资料目录： 常用入口： 复现脚本："
    },
    {
      "type": "markdown",
      "group": "官方代码文档",
      "title": "QwenVL Training Framework",
      "relPath": "code/PhysX-Omni/qwen-vl-finetune/README.md",
      "href": "../code/PhysX-Omni/qwen-vl-finetune/README.md",
      "lines": 312,
      "bytes": 11415,
      "outline": [
        {
          "level": 1,
          "text": "QwenVL Training Framework"
        },
        {
          "level": 2,
          "text": "Repository Structure"
        },
        {
          "level": 3,
          "text": "`train/`"
        },
        {
          "level": 3,
          "text": "`data/`"
        },
        {
          "level": 3,
          "text": "`tools`"
        },
        {
          "level": 2,
          "text": "Requirements"
        },
        {
          "level": 2,
          "text": "Custom Dataset Configuration"
        },
        {
          "level": 3,
          "text": "JSON Data Structure"
        },
        {
          "level": 3,
          "text": "Example Instances:"
        },
        {
          "level": 3,
          "text": "Dataset config for training"
        },
        {
          "level": 3,
          "text": "Dataset Definition Structure"
        },
        {
          "level": 3,
          "text": "Sampling Rate Control"
        }
      ],
      "excerpt": "This repository provides a training framework for Qwen VL models. The are two steps to use our repo: 1. Customize your dataset: downloading data, implement the config 2. Modify training scripts: The `qwenvl` directory contains the following components: - `trainer.py`: Main trainer updated from Huggingface Trainer - `train_qwen.py`: Main file for training - `argument.py`: Dataclasses for model, data and training argum"
    },
    {
      "type": "markdown",
      "group": "官方代码文档",
      "title": "qwen-vl-utils",
      "relPath": "code/PhysX-Omni/qwen-vl-utils/README.md",
      "href": "../code/PhysX-Omni/qwen-vl-utils/README.md",
      "lines": 94,
      "bytes": 5466,
      "outline": [
        {
          "level": 1,
          "text": "qwen-vl-utils"
        },
        {
          "level": 2,
          "text": "Install"
        },
        {
          "level": 2,
          "text": "Usage"
        },
        {
          "level": 3,
          "text": "Qwen2VL"
        },
        {
          "level": 1,
          "text": "You can directly insert a local file path, a URL, or a base64-encoded image into the position where you want in the text."
        },
        {
          "level": 3,
          "text": "Qwen2.5VL"
        },
        {
          "level": 1,
          "text": "You can set the maximum tokens for a video through the environment variable VIDEO_MAX_PIXELS"
        },
        {
          "level": 1,
          "text": "based on the maximum tokens that the model can accept."
        },
        {
          "level": 1,
          "text": "export VIDEO_MAX_PIXELS = 32000 * 28 * 28 * 0.9"
        },
        {
          "level": 1,
          "text": "You can directly insert a local file path, a URL, or a base64-encoded image into the position where you want in the text."
        }
      ],
      "excerpt": "Qwen-VL Utils contains a set of helper functions for processing and integrating visual language information with Qwen-VL Series Model."
    },
    {
      "type": "markdown",
      "group": "官方代码文档",
      "title": "README",
      "relPath": "code/PhysX-Omni/README.md",
      "href": "../code/PhysX-Omni/README.md",
      "lines": 153,
      "bytes": 5870,
      "outline": [
        {
          "level": 2,
          "text": "🏆 News"
        },
        {
          "level": 2,
          "text": "I. PhysX-Omni"
        },
        {
          "level": 3,
          "text": "Installation"
        },
        {
          "level": 3,
          "text": "Training"
        },
        {
          "level": 3,
          "text": "Inference"
        },
        {
          "level": 2,
          "text": "II. PhysX-Bench"
        },
        {
          "level": 2,
          "text": "III. PhysXVerse"
        },
        {
          "level": 2,
          "text": "IV. Other Tools"
        },
        {
          "level": 3,
          "text": "Acknowledgement"
        },
        {
          "level": 2,
          "text": ":newspaper_roll: License"
        }
      ],
      "excerpt": "<div align=\"left\"> <h1 align=\"center\">PhysX-Omni: Unified Simulation-Ready Physical 3D Generation for Rigid, Deformable, and Articulated Objects </h1> <p align=\"center\"> <a href='https://physx-omni.github.io/'><img src='https://img.shields.io/badge/Project_Page-Website-green?logo=homepage&logoColor=white' alt='Project Page'></a> <a href='https://huggingface.co/datasets/PhysX-Omni/PhysXVerse'><img src='https://img.shi"
    },
    {
      "type": "markdown",
      "group": "官方代码文档",
      "title": "README",
      "relPath": "code/PhysX-Omni/trellis/representations/mesh/flexicubes/README.md",
      "href": "../code/PhysX-Omni/trellis/representations/mesh/flexicubes/README.md",
      "lines": 111,
      "bytes": 7902,
      "outline": [
        {
          "level": 2,
          "text": "Flexible Isosurface Extraction for Gradient-Based Mesh Optimization (FlexiCubes)<br><sub>Official PyTorch implementation </sub>"
        },
        {
          "level": 2,
          "text": "Highlights"
        },
        {
          "level": 2,
          "text": "Getting Started"
        },
        {
          "level": 2,
          "text": "Example Usage"
        },
        {
          "level": 3,
          "text": "Gradient-Based Mesh Optimization"
        },
        {
          "level": 3,
          "text": "Extract mesh from known signed distance field"
        },
        {
          "level": 2,
          "text": "Tips for using FlexiCubes"
        },
        {
          "level": 3,
          "text": "Regularization losses:"
        },
        {
          "level": 3,
          "text": "Resolution of voxel grid vs. tetrahedral grid:"
        },
        {
          "level": 2,
          "text": "Applications"
        },
        {
          "level": 2,
          "text": "License"
        },
        {
          "level": 2,
          "text": "Citation"
        }
      ],
      "excerpt": "![Teaser image](<images/teaser_top.png>) FlexiCubes is a high-quality isosurface representation specifically designed for gradient-based mesh optimization with respect to geometric, visual, or even physical objectives. For more details, please refer to our [paper](https://arxiv.org/abs/2308.05371) and [project page](https://research.nvidia.com/labs/toronto-ai/flexicubes/). * [Getting started](https://github.com/nv-tl"
    },
    {
      "type": "markdown",
      "group": "项目入口与交付说明",
      "title": "PhysX-Omni 阅读与复现入口",
      "relPath": "LEARNING_INDEX.md",
      "href": "../LEARNING_INDEX.md",
      "lines": 91,
      "bytes": 3565,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 阅读与复现入口"
        },
        {
          "level": 2,
          "text": "主线阅读"
        },
        {
          "level": 2,
          "text": "前端总览"
        },
        {
          "level": 2,
          "text": "质量与证据入口"
        },
        {
          "level": 2,
          "text": "复现入口"
        },
        {
          "level": 2,
          "text": "目录结构"
        }
      ],
      "excerpt": "这是 PhysX-Omni 项目内的主入口。读论文、看代码、查复现结果，都从这里走。 当前推荐先打开本地前端： 它集中展示论文主线、核心代码、官方复现记录、M&M's 高罐实测、Bench/数据集、审稿问题和 3D GLB 查看器。 本地文件： `file://` 直开时可看十步课程、材料库和搜索；3D GLB 交互需要使用本地 HTTP 地址。 验证命令： 复现输出主要在："
    },
    {
      "type": "markdown",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读",
      "relPath": "learning_materials/paper_reading/physx-omni-2605.21572v1-paper-reading.md",
      "href": "../learning_materials/paper_reading/physx-omni-2605.21572v1-paper-reading.md",
      "lines": 820,
      "bytes": 24267,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读"
        },
        {
          "level": 2,
          "text": "1. 一句话结论"
        },
        {
          "level": 2,
          "text": "2. 开源状态与许可判断"
        },
        {
          "level": 2,
          "text": "3. 论文要解决的问题"
        },
        {
          "level": 2,
          "text": "4. 输入输出怎么理解"
        },
        {
          "level": 2,
          "text": "5. 方法总览"
        },
        {
          "level": 2,
          "text": "6. Global-to-local 生成范式"
        },
        {
          "level": 2,
          "text": "7. 关键创新：template-based RLE 几何表示"
        },
        {
          "level": 2,
          "text": "8. 为什么不用纯 mesh 或纯 point cloud"
        },
        {
          "level": 2,
          "text": "9. PhysXVerse 数据集"
        },
        {
          "level": 2,
          "text": "10. PhysX-Bench 评测框架"
        },
        {
          "level": 2,
          "text": "11. 各评测项怎么理解"
        }
      ],
      "excerpt": "论文：PhysX-Omni: Unified Simulation-Ready Physical 3D Generation for Rigid, Deformable, and Articulated Objects arXiv 地址：https://arxiv.org/abs/2605.21572v1 arXiv HTML：https://arxiv.org/html/2605.21572 项目主页：https://physx-omni.github.io/ 代码仓库：https://github.com/physx-omni/PhysX-Omni 模型权重：https://huggingface.co/PhysX-Omni/PhysX-Omni 数据集 PhysXVerse：https://huggingface.co/datasets/PhysX-Omni/PhysXVerse 版本：v1，2026-05-20 作者：Z"
    },
    {
      "type": "markdown",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读：第 2 步 - 作者、团队与研究谱系",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_author_deep_reading_step2.md",
      "href": "../learning_materials/paper_reading/physx_omni_paper_author_deep_reading_step2.md",
      "lines": 249,
      "bytes": 16239,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读：第 2 步 - 作者、团队与研究谱系"
        },
        {
          "level": 2,
          "text": "0. 作者和单位的核对"
        },
        {
          "level": 2,
          "text": "1. 两个团队：为什么这篇论文像“学术 + 机器人产品化”结合"
        },
        {
          "level": 3,
          "text": "1.1 S-Lab / MMLab@NTU"
        },
        {
          "level": 3,
          "text": "1.2 ACE Robotics / Ambient Capture Group"
        },
        {
          "level": 2,
          "text": "2. 作者逐个介绍"
        },
        {
          "level": 3,
          "text": "2.1 Ziang Cao"
        },
        {
          "level": 3,
          "text": "2.2 Yinghao Liu"
        },
        {
          "level": 3,
          "text": "2.3 Haitian Li"
        },
        {
          "level": 3,
          "text": "2.4 Runmao Yao"
        },
        {
          "level": 3,
          "text": "2.5 Fangzhou Hong"
        },
        {
          "level": 3,
          "text": "2.6 Zhaoxi Chen"
        }
      ],
      "excerpt": "这一章先不进入公式和实验，而是回答一个更基础的问题：这篇论文是谁做的，他们来自哪些团队，他们之前做过什么研究？ 结论先说：PhysX-Omni 不是一个孤立项目，而是 **NTU S-Lab / MMLab@NTU 的 3D 生成、物理 3D 资产、具身智能研究线** 与 **ACE Robotics 的 3D Vision / World Models / Embodied AI 工程研究线** 的一次汇合。它最直接的前序工作是 **PhysX-3D -> PhysX-Anything -> PhysX-Omni**。 论文 arXiv HTML/PDF 头部给出的作者和单位是： 对应来源：论文 HTML 头部列出 `Ziang Cao1, Yinghao Liu2, Haitian Li1, Runmao Yao1, Fangzhou Hong1, Zhaoxi Chen1, Liang Pan2, Ziwei Liu1`，"
    },
    {
      "type": "markdown",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读 第四步：Baseline 与实验严谨梳理",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_baselines_experiments_step4.md",
      "href": "../learning_materials/paper_reading/physx_omni_paper_baselines_experiments_step4.md",
      "lines": 148,
      "bytes": 10303,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读 第四步：Baseline 与实验严谨梳理"
        },
        {
          "level": 2,
          "text": "0. 这一部分先给结论"
        },
        {
          "level": 2,
          "text": "1. Baseline 分类"
        },
        {
          "level": 2,
          "text": "2. Conventional Evaluation 该怎么读"
        },
        {
          "level": 2,
          "text": "3. PhysX-Bench 该怎么读"
        },
        {
          "level": 2,
          "text": "4. Baseline 与代码输出格式的对应关系"
        },
        {
          "level": 2,
          "text": "5. 本地复现证据与边界"
        },
        {
          "level": 2,
          "text": "6. 下一步 full benchmark 的质量复现顺序"
        }
      ],
      "excerpt": "论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) 本地代码：`C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-assets\\code\\PhysX-Omni`，当前 `git` 版本 `46fa1cd` 本地论文源码：`C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-author-sources\\src\\main.tex` 本地官方 demo 复现输出：`C:\\Users\\robot\\physx_outputs\\official_demo_full` 本地 benchmark s"
    },
    {
      "type": "markdown",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读 第五步：PhysX-Bench 评测设计与数据字段",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_bench_step5.md",
      "href": "../learning_materials/paper_reading/physx_omni_paper_bench_step5.md",
      "lines": 325,
      "bytes": 10801,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读 第五步：PhysX-Bench 评测设计与数据字段"
        },
        {
          "level": 2,
          "text": "0. 一句话理解 PhysX-Bench"
        },
        {
          "level": 2,
          "text": "1. Bench 的核心设计"
        },
        {
          "level": 2,
          "text": "2. 数据来源与规模"
        },
        {
          "level": 2,
          "text": "3. 原始数据到本地评测布局"
        },
        {
          "level": 2,
          "text": "4. 七类评测指标"
        },
        {
          "level": 3,
          "text": "4.1 RQS - Render Quality Score"
        },
        {
          "level": 3,
          "text": "4.2 MCS - Multi-view Consistency Score"
        },
        {
          "level": 3,
          "text": "4.3 DCS - Description Consistency Score"
        },
        {
          "level": 3,
          "text": "4.4 DQS - Dimension Quality Score"
        },
        {
          "level": 3,
          "text": "4.5 APS - Affordance Plausibility Score"
        },
        {
          "level": 3,
          "text": "4.6 KPS - Kinematic Plausibility Score"
        }
      ],
      "excerpt": "论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) PhysX-Bench 数据集：[https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench](https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench) 本地代码：`C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-assets\\code\\PhysX-Omni` PhysX-Bench 是给 simulation-ready physical 3D generat"
    },
    {
      "type": "markdown",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读：第 1 步 - 开源代码、数据资产与主流程对齐",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_code_assets_deep_reading_step1.md",
      "href": "../learning_materials/paper_reading/physx_omni_paper_code_assets_deep_reading_step1.md",
      "lines": 334,
      "bytes": 17779,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读：第 1 步 - 开源代码、数据资产与主流程对齐"
        },
        {
          "level": 2,
          "text": "0. 本章阅读对象"
        },
        {
          "level": 2,
          "text": "1. 论文主张先用一句话落地"
        },
        {
          "level": 2,
          "text": "2. 开源代码的真实结构"
        },
        {
          "level": 2,
          "text": "3. 官方推理链路：从图片到 URDF/XML"
        },
        {
          "level": 2,
          "text": "4. `1vlm_demo.py`：最关键的语义到结构步骤"
        },
        {
          "level": 2,
          "text": "5. `2infer_geo.py` + `decoder_each.py`：从稀疏 voxel 到 textured mesh"
        },
        {
          "level": 2,
          "text": "6. `3jsongen_update.py`：从生成部件到仿真资产"
        },
        {
          "level": 2,
          "text": "7. 已下载的数据资产怎么分工"
        },
        {
          "level": 2,
          "text": "8. 官方 demo 复现结果：质量门槛已经过了"
        },
        {
          "level": 2,
          "text": "9. 用户 M&M 罐子图片：为什么第一次看起来“矮”"
        },
        {
          "level": 2,
          "text": "10. 训练数据管线：为什么 dataset 脚本存在"
        }
      ],
      "excerpt": "本 notebook 是论文精读的第一章，目标不是先复述论文全文，而是先把“论文说的系统”落到我们已经下载和跑通的真实材料上：GitHub 代码、Hugging Face 模型、PhysXVerse 数据集、官方 demo 复现产物，以及用户 M&M 罐子图片的测试结果。 核心结论先放前面：PhysX-Omni 已开源，代码、模型权重和数据集都能访问并已下载到 4090；官方三步推理链路已经在 4090 跑通，产生了 VLM 结构化理解、分部 voxel/RLE、TRELLIS 解码的 textured mesh，以及最终 URDF/XML。 后续章节会继续深入：论文方法细节、RLE 表示、VLM prompt/解析、TRELLIS 解码、URDF/XML 生成、benchmark 设计和自定义图片失败案例分析。本章只把“所有东西在哪里、怎么连起来”讲清楚。 PhysX-Omni 要解决的问题是：给一张物体图片，不只生成“看起来"
    },
    {
      "type": "markdown",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读 第七步：被超越方法、接近分数与复现优先级",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_competitor_landscape_step7.md",
      "href": "../learning_materials/paper_reading/physx_omni_paper_competitor_landscape_step7.md",
      "lines": 158,
      "bytes": 10621,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读 第七步：被超越方法、接近分数与复现优先级"
        },
        {
          "level": 2,
          "text": "0. 结论先行"
        },
        {
          "level": 2,
          "text": "1. 论文中被比较的方法"
        },
        {
          "level": 2,
          "text": "2. 高频程度"
        },
        {
          "level": 2,
          "text": "3. 分数最接近和反超点"
        },
        {
          "level": 3,
          "text": "3.1 PhysXVerse conventional metrics"
        },
        {
          "level": 3,
          "text": "3.2 PhysX-Mobility conventional metrics"
        },
        {
          "level": 3,
          "text": "3.3 PhysX-Bench"
        },
        {
          "level": 2,
          "text": "4. 推荐复现矩阵"
        },
        {
          "level": 2,
          "text": "5. “是否已有论文超越 PhysX-Omni”的检索结论"
        },
        {
          "level": 2,
          "text": "6. 同期/近同期超越共同 baseline 的工作"
        },
        {
          "level": 3,
          "text": "6.1 MonoArt"
        }
      ],
      "excerpt": "论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) HTML 版本：[https://arxiv.org/html/2605.21572v1](https://arxiv.org/html/2605.21572v1) 本地代码：`C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-assets\\code\\PhysX-Omni` 第七步的核心判断： 1. **最值得优先复现的是 PhysX-Anything**。它是 PhysX-Omni 的直接前作、论文中出现频率最高、Table 1/2 全维度可比，并且在 PhysX-Mobility 的 F-score 上还略高于 PhysX-Omni。 2. **第二优先级是 MonoArt**。它不是完整 physical asset 生成器，但在几何/"
    },
    {
      "type": "markdown",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读：第 3 步 - 核心创新点与实现机制",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_core_innovations_step3.md",
      "href": "../learning_materials/paper_reading/physx_omni_paper_core_innovations_step3.md",
      "lines": 501,
      "bytes": 21466,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读：第 3 步 - 核心创新点与实现机制"
        },
        {
          "level": 2,
          "text": "1. 创新点一：统一的 simulation-ready physical 3D generation 范式"
        },
        {
          "level": 3,
          "text": "1.1 它要解决什么问题"
        },
        {
          "level": 3,
          "text": "1.2 它具体怎么做"
        },
        {
          "level": 3,
          "text": "1.3 为什么这是创新"
        },
        {
          "level": 2,
          "text": "2. 创新点二：Template-based RLE 几何表示"
        },
        {
          "level": 3,
          "text": "2.1 背景痛点"
        },
        {
          "level": 3,
          "text": "2.2 表示怎么构造"
        },
        {
          "level": 3,
          "text": "2.3 为什么 template layer 有用"
        },
        {
          "level": 3,
          "text": "2.4 代码里怎么做"
        },
        {
          "level": 3,
          "text": "2.5 它如何接 TRELLIS"
        },
        {
          "level": 3,
          "text": "2.6 实验中它带来的收益"
        }
      ],
      "excerpt": "这一章聚焦“创新点是什么、为什么重要、分别怎么做”。我把 PhysX-Omni 的创新拆成四个核心层级和两个辅助验证层级： 如果只记住一个核心：**PhysX-Omni 的最关键创新不是“又一个 image-to-3D”，而是把 VLM 变成一个能输出可解析物理 3D 中间表示的生成器，再接已有 3D decoder 和仿真资产装配。** --- 传统 3D 生成大多回答： > 这张图对应的 3D 形状和纹理是什么？ PhysX-Omni 要回答的是： > 这张图对应的物体是什么、有哪些部件、每个部件的几何/材质/尺度/功能/运动关系是什么，并且怎么导出成可进模拟器的资产？ 论文把这个目标称为 simulation-ready physical 3D generation。这里的 simulation-ready 至少包含： 论文采用 coarse-to-fine、global-to-local 的 VLM 生成范式： 代码里对"
    },
    {
      "type": "markdown",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读 第六步：数据集设计、来源、数量与构建方法",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_datasets_step6.md",
      "href": "../learning_materials/paper_reading/physx_omni_paper_datasets_step6.md",
      "lines": 310,
      "bytes": 12307,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读 第六步：数据集设计、来源、数量与构建方法"
        },
        {
          "level": 2,
          "text": "0. 这一节先分清楚“数据集”的两层含义"
        },
        {
          "level": 2,
          "text": "1. 为什么要新建 PhysXVerse"
        },
        {
          "level": 2,
          "text": "2. 数据集家族总览"
        },
        {
          "level": 2,
          "text": "3. PhysXVerse 的来源：PartVerse"
        },
        {
          "level": 2,
          "text": "4. PhysXVerse 构建流程"
        },
        {
          "level": 3,
          "text": "4.1 清洗与结构整理"
        },
        {
          "level": 3,
          "text": "4.2 多视角渲染"
        },
        {
          "level": 3,
          "text": "4.3 物理属性初标注"
        },
        {
          "level": 3,
          "text": "4.4 人工验证与 refinement"
        },
        {
          "level": 3,
          "text": "4.5 几何归一化与体素化"
        },
        {
          "level": 3,
          "text": "4.6 JSON 到结构化文本"
        }
      ],
      "excerpt": "论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) PhysXVerse：[https://huggingface.co/datasets/PhysX-Omni/PhysXVerse](https://huggingface.co/datasets/PhysX-Omni/PhysXVerse) PhysX-Mobility：[https://huggingface.co/datasets/Caoza/PhysX-Mobility](https://huggingface.co/datasets/Caoza/PhysX-Mobility) PhysXN"
    },
    {
      "type": "markdown",
      "group": "项目入口与交付说明",
      "title": "PhysX-Omni 论文精读主索引",
      "relPath": "learning_materials/physx_omni_reading_index.md",
      "href": "../learning_materials/physx_omni_reading_index.md",
      "lines": 50,
      "bytes": 2079,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读主索引"
        },
        {
          "level": 2,
          "text": "先读这五个"
        },
        {
          "level": 2,
          "text": "如果要补细节"
        },
        {
          "level": 2,
          "text": "复现看这里"
        }
      ],
      "excerpt": "论文：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 官方代码：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) 一句话概括：这篇论文尝试从单张图生成带几何、部件、关节和物理属性的可仿真资产，并用 PhysX-Bench/PhysXVerse 评估这种资产是否真的能进入物理仿真和机器人学习流程。 1. `paper_reading/physx_omni_paper_code_assets_deep_reading_step1.md` 代码、模型资产、数据资产、推理流程。 2. `paper_reading/physx_omni_paper_core_innovations_step3.md` template RL"
    },
    {
      "type": "markdown",
      "group": "Step 10 技术实验回答",
      "title": "第十步：用实验结果回答第九步的 7 个问题",
      "relPath": "learning_materials/physx_omni_step10_technical_experiments/00_technical_experiment_answer.md",
      "href": "../learning_materials/physx_omni_step10_technical_experiments/00_technical_experiment_answer.md",
      "lines": 199,
      "bytes": 8964,
      "outline": [
        {
          "level": 1,
          "text": "第十步：用实验结果回答第九步的 7 个问题"
        },
        {
          "level": 2,
          "text": "实验总览"
        },
        {
          "level": 2,
          "text": "1. 单图生成的物理属性到底有多少是真实推断，多少是常识补全？"
        },
        {
          "level": 2,
          "text": "2. PhysX-Bench 换一个 VLM judge 后排名是否稳定？"
        },
        {
          "level": 2,
          "text": "3. 生成资产在 MuJoCo、Isaac Sim、Genesis 等不同仿真器中是否一致稳定？"
        },
        {
          "level": 2,
          "text": "4. URDF/XML 输出是否包含足够可靠的质量、惯量、摩擦、关节限制？"
        },
        {
          "level": 2,
          "text": "5. 真实机器人任务中，使用这些生成资产训练是否能提升 sim-to-real 表现？"
        },
        {
          "level": 2,
          "text": "6. template-based RLE 是否能泛化到更复杂拓扑或更高分辨率？"
        },
        {
          "level": 2,
          "text": "7. 如果换成 TRELLIS.2 或更强 3D decoder，瓶颈会转移到哪里？"
        },
        {
          "level": 2,
          "text": "第十步最终技术判断"
        }
      ],
      "excerpt": "论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) 实验结果文件：`results/step10_experiment_results.json` 本轮没有重新跑完整大模型推理，而是基于已经复现得到的本地资产、官方代码、benchmark prompt 和小规模可执行 smoke test 做技术验证。 已运行实验： - 本地复现产物扫描； - 官方 demo 的 URDF/MJCF/XML 物理字段审计； - 官方 demo 的 MuJoCo 加载与 200 step 短步进； - M&M's 罐子输入裁剪和 voxel projection 的比"
    },
    {
      "type": "markdown",
      "group": "Step 10 技术实验回答",
      "title": "第十步实验细节",
      "relPath": "learning_materials/physx_omni_step10_technical_experiments/01_experiment_details.md",
      "href": "../learning_materials/physx_omni_step10_technical_experiments/01_experiment_details.md",
      "lines": 196,
      "bytes": 5240,
      "outline": [
        {
          "level": 1,
          "text": "第十步实验细节"
        },
        {
          "level": 2,
          "text": "1. 实验脚本"
        },
        {
          "level": 2,
          "text": "2. 本地复现产物扫描"
        },
        {
          "level": 2,
          "text": "3. M&M's 罐子为什么看起来矮"
        },
        {
          "level": 2,
          "text": "4. URDF/MJCF 物理字段审计"
        },
        {
          "level": 2,
          "text": "5. MuJoCo smoke test"
        },
        {
          "level": 2,
          "text": "6. 仿真器可用性"
        },
        {
          "level": 2,
          "text": "7. RLE 压力测试"
        },
        {
          "level": 2,
          "text": "8. Benchmark judge/prompt 审计"
        },
        {
          "level": 2,
          "text": "9. 第十步实验边界"
        }
      ],
      "excerpt": "入口： 输出： 扫描目录： 扫描结果： 解释： - 官方 demo 是完整复现样例，适合做 URDF/MJCF 审计。 - M&M's 原图和主体聚焦图说明裁剪强烈影响生成质量。 - M&M's 当前没有同步完整 URDF/XML，因此不能用它回答动力学字段完整性。 输入裁剪高宽比： 生成 projection 的主侧视比例： 解释： 输入图里的罐子是偏高物体，但生成 voxel 的侧视主连通区域明显偏扁。这支持用户的观察：“出来的好像有点矮”。它可能来自单图透视歧义、裁剪对主体/盖子的取舍、训练先验、RLE/voxel 分辨率和 VLM 部件生成失败共同作用。 官方 demo 的 JSON 层： - object: Dumpster； - category: Waste Container； - dimension: `180*120*150`； - part_count: 7； - materials: Steel with"
    },
    {
      "type": "markdown",
      "group": "Step 10 技术实验回答",
      "title": "PhysX-Omni 第十步：技术专家实验回答",
      "relPath": "learning_materials/physx_omni_step10_technical_experiments/README.md",
      "href": "../learning_materials/physx_omni_step10_technical_experiments/README.md",
      "lines": 31,
      "bytes": 2294,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第十步：技术专家实验回答"
        },
        {
          "level": 2,
          "text": "文件说明"
        },
        {
          "level": 2,
          "text": "本轮实际跑出的关键结果"
        },
        {
          "level": 2,
          "text": "最短技术结论"
        }
      ],
      "excerpt": "本目录用可复跑的小实验回应第九步的 7 个审稿问题。核心原则：能用本地实验结果回答的直接回答；不能由当前实验推出的，明确标成“未证明”。 - 共扫描到 5 组本地输出：`official_demo_full`、`mms_yellow`、`mms_yellow_body_focus`、`mms_yellow_preprocessed`、`mesh_part0`。 - 官方 demo 完整输出成功：7/7 个部件有非零 voxel，总 voxel 数 22031，用时 393.95 秒。 - M&M's 原图版本成功但弱：4 个部件只有 1 个非零 voxel，总 voxel 2237，用时 594.48 秒。 - M&M's 主体聚焦版本更好：4 个部件有 3 个非零 voxel，总 voxel 6188，用时 428.57 秒。 - 官方 demo 的 URDF：13 个 link 的 mass 全为 `1.0`，惯量唯一值只有"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "PhysX-Omni 第八步：paper-reading.md 逐项精讲索引",
      "relPath": "learning_materials/physx_omni_step8_deepdives/00_index.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/00_index.md",
      "lines": 66,
      "bytes": 3671,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第八步：paper-reading.md 逐项精讲索引"
        },
        {
          "level": 2,
          "text": "文件清单"
        },
        {
          "level": 2,
          "text": "核心证据来源"
        },
        {
          "level": 2,
          "text": "本地证据"
        }
      ],
      "excerpt": "对应原始文件：`C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-2605.21572v1-paper-reading.md` 这一组文档把 `paper-reading.md` 的 29 个顶层章节逐个展开。每篇都按同一套读法组织： - 论文讲的是什么。 - 代码或数据里落在哪里。 - 官方数据或公开资产有什么证据。 - 大白话怎么理解。 - 复现时应该看什么，不应该夸大什么。 - 论文：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) - 官方 HTML：[https://arxiv.org/html/2605.21572](https://arxiv.org/html/2605.21572) - 项目页：[https://physx-omni.github.io/](https://physx-"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "01 一句话结论精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/01_one_sentence_conclusion.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/01_one_sentence_conclusion.md",
      "lines": 80,
      "bytes": 3084,
      "outline": [
        {
          "level": 1,
          "text": "01 一句话结论精讲"
        },
        {
          "level": 2,
          "text": "论文原意"
        },
        {
          "level": 2,
          "text": "代码和数据落点"
        },
        {
          "level": 2,
          "text": "官方资产证据"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "复现时要注意"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 1. 一句话结论` PhysX-Omni 不是一个普通的 image-to-3D 模型。普通 image-to-3D 主要回答“长得像不像”，PhysX-Omni 要回答的是“能不能放进物理仿真里用”。它从单张图像生成带有几何、尺寸、材料、可交互区域、运动学结构和功能描述的 3D 资产，目标是服务 embodied AI、机器人训练和物理场景构建。 论文标题里有三个关键词需要一起看： - `Unified`：刚体、可变形体、铰接体放进同一个框架。 - `Simulation-Ready`：不是只可视化，而是要能进入 MuJoCo / Isaac / XML / URDF 这类仿真工作流。 - `Physical 3D Generation`：生成对象带有物理语义，不只是网格外形。 官方 README 的推理流程是： 这个顺序对应论文的一句话结论： - `1vlm_demo.py"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "02 开源状态与许可判断精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/02_open_source_license.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/02_open_source_license.md",
      "lines": 60,
      "bytes": 2470,
      "outline": [
        {
          "level": 1,
          "text": "02 开源状态与许可判断精讲"
        },
        {
          "level": 2,
          "text": "当前开源了什么"
        },
        {
          "level": 2,
          "text": "许可需要分层看"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "代码证据"
        },
        {
          "level": 2,
          "text": "复现建议"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 2. 开源状态与许可判断` PhysX-Omni 当前公开的核心资产包括： - GitHub 代码仓库：`https://github.com/physx-omni/PhysX-Omni` - 模型权重：`https://huggingface.co/PhysX-Omni/PhysX-Omni` - PhysXVerse 数据集：`https://huggingface.co/datasets/PhysX-Omni/PhysXVerse` - PhysX-Bench 数据集：`https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench` - benchmark 代码：GitHub 仓库内 `benchmark/` 官方 README 明确写到 release 了 code、PhysXVerse 和 PhysX-Bench。仓库也"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "03 论文要解决的问题精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/03_problem_statement.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/03_problem_statement.md",
      "lines": 64,
      "bytes": 2313,
      "outline": [
        {
          "level": 1,
          "text": "03 论文要解决的问题精讲"
        },
        {
          "level": 2,
          "text": "论文原意"
        },
        {
          "level": 2,
          "text": "为什么旧方法不够"
        },
        {
          "level": 2,
          "text": "代码和数据落点"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "边界"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 3. 论文要解决的问题` 传统 3D 生成更关注视觉指标： - 几何像不像。 - 纹理是否好看。 - 多视角是否一致。 - 渲染质量是否高。 但机器人和仿真任务还需要物理层面的信息： - 物体真实尺寸。 - 材料物性。 - 哪些部位可以抓、按、推、拉。 - 是否有门、抽屉、轮子、滑轨、铰链。 - 关节轴和运动范围是否合理。 - 进入物理引擎后是否稳定、可碰撞、可交互。 PhysX-Omni 要解决的就是这个断层：从“视觉 3D”推进到“物理可用 3D”。 论文认为已有方法主要有两类缺口： 1. 很多 image-to-3D 方法只生成外观资产，不生成物理属性。 2. 已有 physical 3D 生成通常只覆盖某一类资产，例如只做 rigid、只做 articulated、只做 deformable，缺少统一框架。 这会导致生成模型看起来很强，但一放进仿真器就暴露问题：尺寸不对"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "04 输入输出精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/04_inputs_outputs.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/04_inputs_outputs.md",
      "lines": 80,
      "bytes": 2065,
      "outline": [
        {
          "level": 1,
          "text": "04 输入输出精讲"
        },
        {
          "level": 2,
          "text": "输入是什么"
        },
        {
          "level": 2,
          "text": "输出是什么"
        },
        {
          "level": 2,
          "text": "JSON schema 怎么看"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "复现检查点"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 4. 输入输出怎么理解` 论文里的输入可以是： - 单张完整图像。 - 单张部分遮挡图像。 - benchmark 中的真实照片或合成渲染条件图。 代码上，推理入口是 `1vlm_demo.py`。它接收图像，先让 VLM 输出结构化物理语义和几何生成所需文本。 输出不是单个 mesh 文件，而是一组 simulation-ready 资产信息： - 3D 几何。 - 部件层级。 - 绝对尺度。 - 材料属性。 - affordance，可交互区域。 - kinematics，运动学结构。 - function description，部件功能和语义。 - URDF / XML 等仿真结构。 本地官方 demo 输出目录 `C:\\Users\\robot\\physx_outputs\\official_demo_full` 里可以看到： - `basic_info.json` -"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "05 方法总览精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/05_method_overview.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/05_method_overview.md",
      "lines": 62,
      "bytes": 2131,
      "outline": [
        {
          "level": 1,
          "text": "05 方法总览精讲"
        },
        {
          "level": 2,
          "text": "主流程"
        },
        {
          "level": 2,
          "text": "VLM 和 TRELLIS 的分工"
        },
        {
          "level": 2,
          "text": "数据流"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "为什么这样设计"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 5. 方法总览` PhysX-Omni 的方法可以拆成四段： 1. 图像理解：VLM 识别物体类别、部件、尺度、功能和物理先验。 2. 结构化文本生成：把物体描述、部件属性、关节关系和几何表示写成文本。 3. 几何解码：使用 TRELLIS decoder 或其替代版本生成 3D 几何。 4. 仿真资产转换：把生成结果转换为 URDF/XML 等 simulation-ready 输出。 官方 README 中的推理命令正好对应： 不要把 PhysX-Omni 理解成“重新发明了所有 3D 生成模块”。它的核心工程策略是： - VLM 负责高层语义、物理属性、部件结构和文本几何表示。 - TRELLIS 负责把结构化几何条件解码成 3D 资产。 - 后处理脚本负责 URDF/XML 转换和仿真可用性。 这是一种组合式路线，而不是纯端到端黑盒路线。 训练数据里每个对象有 25 张"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "06 Global-to-local 生成范式精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/06_global_to_local.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/06_global_to_local.md",
      "lines": 74,
      "bytes": 2192,
      "outline": [
        {
          "level": 1,
          "text": "06 Global-to-local 生成范式精讲"
        },
        {
          "level": 2,
          "text": "论文原意"
        },
        {
          "level": 2,
          "text": "为什么需要 global-to-local"
        },
        {
          "level": 2,
          "text": "代码证据"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "复现检查点"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 6. Global-to-local 生成范式` PhysX-Omni 不直接从图像一次性吐出整个 3D 物体，而是先做全局理解，再做局部生成。 全局阶段回答： - 这是什么物体。 - 大概真实尺寸是多少。 - 有哪些主要部件。 - 部件之间是什么关系。 - 哪些部件会动。 - 哪些部件承担交互功能。 - 可能材料是什么。 局部阶段再逐个生成： - 部件几何。 - 部件语义。 - 部件材料。 - 部件 affordance。 - 部件运动学属性。 物体物理属性不是孤立的。一个轮子是否能转，不只看它像不像圆，还看它是不是连接到底盘、轴线在哪里、转动方向是否合理。一个柜门能不能开，也取决于门板、铰链和柜体之间的关系。 全局理解给局部生成提供上下文，局部生成则让物理属性落到具体部件上。 训练数据转换脚本 `dataset/2encode_representation_64_finet"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "07 Template-based RLE 几何表示精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/07_template_rle_geometry.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/07_template_rle_geometry.md",
      "lines": 68,
      "bytes": 2557,
      "outline": [
        {
          "level": 1,
          "text": "07 Template-based RLE 几何表示精讲"
        },
        {
          "level": 2,
          "text": "核心问题"
        },
        {
          "level": 2,
          "text": "代码怎么做"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "为什么比纯 voxel index 更好"
        },
        {
          "level": 2,
          "text": "和本地复现的关系"
        },
        {
          "level": 2,
          "text": "注意边界"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 7. 关键创新：template-based RLE 几何表示` VLM 天然擅长文本序列，但 3D 几何不是天然文本。直接让语言模型生成 mesh 顶点、面片或 dense voxel，会遇到序列太长、顺序敏感、局部结构难保持的问题。 PhysX-Omni 的关键创新是把 3D 几何转成 VLM 友好的文本格式：part-level voxel + z-slice 2D RLE + template 压缩。 数据预处理分三步： 关键代码点： - `1voxel_verse.py`：把每个 part mesh voxelize 到 16、32、64 等分辨率。 - `2encode_representation_64_finetune.py`：把 object JSON 转成结构化文本。 - `3generate_data_new_64_finetune_rle.py`：把 6"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "08 为什么不用纯 mesh 或纯 point cloud 精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/08_mesh_pointcloud_tradeoff.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/08_mesh_pointcloud_tradeoff.md",
      "lines": 74,
      "bytes": 2326,
      "outline": [
        {
          "level": 1,
          "text": "08 为什么不用纯 mesh 或纯 point cloud 精讲"
        },
        {
          "level": 2,
          "text": "论文原意"
        },
        {
          "level": 2,
          "text": "为什么 VLM 不适合直接吐 mesh"
        },
        {
          "level": 2,
          "text": "为什么 point cloud 不够"
        },
        {
          "level": 2,
          "text": "RLE 的折中"
        },
        {
          "level": 2,
          "text": "代码证据"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "复现注意"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 8. 为什么不用纯 mesh 或纯 point cloud` PhysX-Omni 选择 template-based RLE，不是因为 mesh 或 point cloud 没用，而是因为它们不适合作为 VLM 直接生成的主表示。 主要问题： - mesh 顶点和面片有顺序问题，文本序列长且脆弱。 - point cloud 缺少显式表面、拓扑和部件关系。 - dense voxel 展开太长。 - latent 表示短，但解释性和物理部件对齐弱。 mesh 通常包含： - 大量顶点坐标。 - 大量三角面索引。 - 顶点和面的顺序虽然对几何不一定有意义，但对语言模型却变成了序列建模问题。 如果一个点顺序或面索引错了，后处理可能直接失败。更麻烦的是，mesh 本身不告诉你哪个面属于轮子、把手或铰链。 point cloud 表示一堆点，适合粗略形状，但不天然表达： - 表面连续"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "09 PhysXVerse 数据集精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/09_physxverse_dataset.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/09_physxverse_dataset.md",
      "lines": 94,
      "bytes": 2829,
      "outline": [
        {
          "level": 1,
          "text": "09 PhysXVerse 数据集精讲"
        },
        {
          "level": 2,
          "text": "数据集为什么重要"
        },
        {
          "level": 2,
          "text": "论文里的构建方法"
        },
        {
          "level": 2,
          "text": "规模"
        },
        {
          "level": 2,
          "text": "官方公开资产"
        },
        {
          "level": 2,
          "text": "代码里怎么用"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "本地证据"
        },
        {
          "level": 2,
          "text": "注意边界"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 9. PhysXVerse 数据集` PhysX-Omni 的目标比普通 3D 生成更宽。它不仅要几何，还要尺度、材料、affordance、kinematics 和功能描述。已有数据集很难同时覆盖这些内容，因此论文构建 PhysXVerse 来补数据缺口。 PhysXVerse 基于 PartVerse 的人类验证部件分割，经过： 1. 过滤无效样本。 2. 合并过小或噪声部件。 3. 渲染多视角图像。 4. 使用 GPT/VLM 生成初步物理标注。 5. 人类检查、修正、确认。 标注内容包括： - absolute scale - material - affordance - kinematics - functional description - part hierarchy 论文中给出的 PhysXVerse 规模： - 超过 8.7K 个高质量 simulatio"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "10 PhysX-Bench 评测框架精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/10_physxbench_framework.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/10_physxbench_framework.md",
      "lines": 72,
      "bytes": 2644,
      "outline": [
        {
          "level": 1,
          "text": "10 PhysX-Bench 评测框架精讲"
        },
        {
          "level": 2,
          "text": "为什么要 PhysX-Bench"
        },
        {
          "level": 2,
          "text": "六个评测维度"
        },
        {
          "level": 2,
          "text": "代码流程"
        },
        {
          "level": 2,
          "text": "官方数据"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "本地复现状态"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 10. PhysX-Bench 评测框架` 真实图片通常没有 ground-truth 3D 物理资产。传统 CD、F-score、PSNR 需要 GT，无法覆盖 in-the-wild 条件图。PhysX-Bench 的目的就是评估“没有完整 GT 时，生成资产是否在几何、尺度、材料、affordance、运动学和描述上合理”。 `benchmark/README.md` 说明的主流程： 关键脚本和机制： - `benchmark/scripts/run_tiny_smoke_test.sh`：tiny smoke。 - `benchmark/code/manifests/*`：构建每个指标的 manifest。 - `benchmark/code/vlm/multi.py`：运行 VLM judge。 - `benchmark/code/aggregation/aggreg"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "11 各评测项精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/11_metrics_deep_dive.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/11_metrics_deep_dive.md",
      "lines": 95,
      "bytes": 3522,
      "outline": [
        {
          "level": 1,
          "text": "11 各评测项精讲"
        },
        {
          "level": 2,
          "text": "总体理解"
        },
        {
          "level": 2,
          "text": "11.1 Geometry"
        },
        {
          "level": 2,
          "text": "11.2 Absolute scale"
        },
        {
          "level": 2,
          "text": "11.3 Material"
        },
        {
          "level": 2,
          "text": "11.4 Affordance"
        },
        {
          "level": 2,
          "text": "11.5 Kinematics"
        },
        {
          "level": 2,
          "text": "11.6 Description"
        },
        {
          "level": 2,
          "text": "复现注意"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 11. 各评测项怎么理解` PhysX-Bench 的评测不是一个单分数，而是一组证据驱动的指标。它把“物体是否可用于仿真”拆成可观察的几类问题：像不像、尺寸是否合理、材料行为是否合理、哪里能交互、关节是否合理、部件描述是否对齐。 Geometry 包括： - CLIP score：输入图和生成结果语义是否一致。 - 3D consistency：多视角渲染是否结构一致。 - visual quality：渲染质量和视觉自然度。 这类指标更接近传统 3D 生成评估。第七步已经确认，PhysX-Omni 在 PhysX-Bench 的视觉几何项不是全胜，MonoArt 的 CLIP、3D consistency、visual quality 更高。 大白话：它问的是“这个 3D 模型看起来是不是像输入图，而且换角度看会不会崩”。 Absolute scale 评估尺寸是否合理。代"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "12 训练与实现细节精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/12_training_implementation.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/12_training_implementation.md",
      "lines": 96,
      "bytes": 2380,
      "outline": [
        {
          "level": 1,
          "text": "12 训练与实现细节精讲"
        },
        {
          "level": 2,
          "text": "论文训练设置"
        },
        {
          "level": 2,
          "text": "代码证据"
        },
        {
          "level": 2,
          "text": "训练数据怎么进模型"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "为什么训练成本高"
        },
        {
          "level": 2,
          "text": "复现建议"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 12. 训练与实现细节` 论文报告的训练设置： - VLM backbone：`Qwen2.5-VL-7B-Instruct` - 训练 5 个 epoch。 - 64 张 NVIDIA A100。 - 约 14 天。 - 最大序列长度 16,384。 - decoder：TRELLIS。 - 每个对象 25 张多视角 conditioning images。 这说明完整训练复现成本极高，个人 4090 更适合做 inference、小样本 benchmark、数据预处理验证或小规模 finetune。 训练脚本： `qwen-vl-finetune/scripts/train_physx.sh` 关键参数： - `llm=Qwen/Qwen2.5-VL-7B-Instruct` - `datasets=physxverse64,physxnet64,physxmobility"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "13 GitHub 推理管线精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/13_github_inference_pipeline.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/13_github_inference_pipeline.md",
      "lines": 87,
      "bytes": 2302,
      "outline": [
        {
          "level": 1,
          "text": "13 GitHub 推理管线精讲"
        },
        {
          "level": 2,
          "text": "官方推理步骤"
        },
        {
          "level": 2,
          "text": "本地复现输出"
        },
        {
          "level": 2,
          "text": "推理输出怎么读"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "常见失败点"
        },
        {
          "level": 2,
          "text": "质量检查建议"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 13. GitHub 推理管线` README 给出的 inference 流程： 这四步分别对应： 本地官方 demo 输出在： `C:\\Users\\robot\\physx_outputs\\official_demo_full` 关键文件： - `basic_info.json`：结构化物理信息。 - `basic.urdf`：URDF 结构。 - `basic.xml`：XML/MJCF 结构。 - `ind_*.npy` / `ind_*.ply`：部件 voxel / point 可视化资产。 - `cond_img.png`：输入条件图。 - `official_7part_mesh_preview.png`：部件预览。 - `voxel_projection.png`：voxel 投影。 `basic_info.json` 是最值得先看的文件。它让我们知道模型是否真"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "14 Benchmark 代码可用性精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/14_benchmark_code.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/14_benchmark_code.md",
      "lines": 85,
      "bytes": 2522,
      "outline": [
        {
          "level": 1,
          "text": "14 Benchmark 代码可用性精讲"
        },
        {
          "level": 2,
          "text": "benchmark 代码公开了什么"
        },
        {
          "level": 2,
          "text": "七个指标"
        },
        {
          "level": 2,
          "text": "tiny smoke test 的意义"
        },
        {
          "level": 2,
          "text": "denominator validation 为什么重要"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "复现边界"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 14. Benchmark 代码可用性` 官方仓库内有完整 `benchmark/` 目录。README 中说明它支持： - metric-specific manifest 构建。 - VLM judge 调用。 - raw JSON 聚合。 - dataset-level CSV 汇总。 - denominator validation。 - tiny smoke test。 这比只给论文表格更有价值，因为它给出了评测协议和工程骨架。 命令： 这个 smoke test 不追求论文分数，而是检查： - manifest 是否能构建。 - aggregation 是否能跑。 - denominator validation 是否能跑。 - 小样本目录结构是否符合 benchmark 代码预期。 本地已有 tiny 输出： `C:\\Users\\robot\\Documents\\成"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "15 主要实验结果精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/15_experiment_results.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/15_experiment_results.md",
      "lines": 75,
      "bytes": 2589,
      "outline": [
        {
          "level": 1,
          "text": "15 主要实验结果精讲"
        },
        {
          "level": 2,
          "text": "实验分两类"
        },
        {
          "level": 2,
          "text": "Conventional metrics"
        },
        {
          "level": 2,
          "text": "PhysX-Bench metrics"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "和第七步的关系"
        },
        {
          "level": 2,
          "text": "复现边界"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 15. 主要实验结果` 论文实验主要有两套： 1. 有 GT 的 conventional evaluation：PhysXVerse 和 PhysX-Mobility。 2. 无完整 GT 的 PhysX-Bench：真实或合成条件图，通过证据和 VLM judge 评分。 指标含义： - PSNR 越高越好。 - CD 越低越好。 - F-score 越高越好。 - Absolute scale 越低越好。 - Material、Affordance、Kinematic、Description 越高越好。 PhysXVerse 上，PhysX-Omni 全列最好。关键值： PhysX-Mobility 上，PhysX-Omni 在大多数指标最好，但 F-score 不是第一： - PhysX-Anything：89.51 - PhysX-Omni：88.50 这说明论文结论"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "16 消融实验结论精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/16_ablation.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/16_ablation.md",
      "lines": 59,
      "bytes": 2219,
      "outline": [
        {
          "level": 1,
          "text": "16 消融实验结论精讲"
        },
        {
          "level": 2,
          "text": "消融要验证什么"
        },
        {
          "level": 2,
          "text": "论文想证明的因果关系"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "代码落点"
        },
        {
          "level": 2,
          "text": "复现建议"
        },
        {
          "level": 2,
          "text": "注意边界"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 16. 消融实验结论` 论文最核心的消融目标是证明 template-based geometry representation 有价值。也就是说，性能提升不只是因为数据更多或模型更大，而是和新的几何文本表示有关。 主要对比对象： - text-based voxel indices 表示。 - 旧的 segmentation pipeline。 - PhysX-Anything 风格的显式分割中间阶段。 论文主张： 1. 旧表示序列长、冗余高、难生成复杂局部结构。 2. 显式 segmentation pipeline 容易把早期错误传到后续几何生成。 3. template-based RLE 能更紧凑地表达高分辨率部件几何。 4. 更好的局部几何会帮助 kinematic、scale、affordance 等物理指标。 旧方法像是先把物体切错了，再按错误切片建模。切错一步"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "17 应用：机器人策略学习精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/17_robot_policy_learning.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/17_robot_policy_learning.md",
      "lines": 63,
      "bytes": 1956,
      "outline": [
        {
          "level": 1,
          "text": "17 应用：机器人策略学习精讲"
        },
        {
          "level": 2,
          "text": "论文原意"
        },
        {
          "level": 2,
          "text": "为什么这很重要"
        },
        {
          "level": 2,
          "text": "代码证据"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "需要谨慎的地方"
        },
        {
          "level": 2,
          "text": "复现建议"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 17. 应用：机器人策略学习` PhysX-Omni 的生成资产可以进入物理仿真器，用于机器人交互和策略学习。它强调的不是单纯展示，而是生成的资产具备： - 可碰撞几何。 - 物理材料属性。 - 可驱动关节。 - 交互区域。 - 可进入仿真环境。 这对 contact-rich manipulation 很重要，例如推、拉、开门、搬运、抓取。 机器人训练依赖大量可交互资产。人工建模很慢，尤其是带物理属性和关节的模型更贵。如果能从真实照片自动生成可用资产，就可以降低仿真数据构建成本。 官方输出可以转换为： - URDF - XML / MJCF 本地 demo 已生成： - `basic.urdf` - `basic.xml` benchmark 里 KPS 渲染脚本 `kinematic_articulation_demo.py` 也说明代码会把关节资产转成运动视频证据。 对机"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "18 Simulation-ready scene generation 精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/18_scene_generation.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/18_scene_generation.md",
      "lines": 61,
      "bytes": 2117,
      "outline": [
        {
          "level": 1,
          "text": "18 Simulation-ready scene generation 精讲"
        },
        {
          "level": 2,
          "text": "论文原意"
        },
        {
          "level": 2,
          "text": "代码证据"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "和 REST3D 等工作的关系"
        },
        {
          "level": 2,
          "text": "复现建议"
        },
        {
          "level": 2,
          "text": "边界"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 18. 应用：simulation-ready scene generation` PhysX-Omni 主要是对象级 sim-ready asset 生成器。论文进一步展示了它可以嵌入场景生成流程： 1. 从输入图像估计深度。 2. 用 2D segmentation 分割对象。 3. 得到粗略 3D layout。 4. 用 PhysX-Omni 生成对象级 sim-ready assets。 5. 插入场景，构建物理合理的仿真环境。 官方仓库提供： - `convert_objects2scene.py` - `applications_scene/` README 写到：`convert_objects2scene.py` 可以把 individual objects 转成 simulation-ready scene，`applications_scene` 基于现有"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "19 论文贡献精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/19_contributions.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/19_contributions.md",
      "lines": 52,
      "bytes": 1871,
      "outline": [
        {
          "level": 1,
          "text": "19 论文贡献精讲"
        },
        {
          "level": 2,
          "text": "贡献 1：统一任务定义"
        },
        {
          "level": 2,
          "text": "贡献 2：VLM 友好的几何表示"
        },
        {
          "level": 2,
          "text": "贡献 3：PhysXVerse 数据集"
        },
        {
          "level": 2,
          "text": "贡献 4：PhysX-Bench 评测"
        },
        {
          "level": 2,
          "text": "贡献 5：仿真应用验证"
        },
        {
          "level": 2,
          "text": "总结"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 19. 这篇论文真正的贡献` PhysX-Omni 把 rigid、deformable、articulated 放进同一个 simulation-ready physical 3D generation 任务里。这个任务定义比“生成一个 articulated object”或“给 mesh 补物理属性”更完整。 大白话：它不是只做一种物体，而是尝试统一“硬的、软的、会动的”。 template-based RLE 是最核心的方法贡献。它把部件级 3D voxel 转成可由 VLM 生成的普通文本，避免新增 special tokens，同时比纯 voxel index 更紧凑。 代码证据： - `dataset/3generate_data_new_64_finetune_rle.py` - `dataset/example_64_finetune_rle.txt` Phy"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "20 论文强点精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/20_strengths.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/20_strengths.md",
      "lines": 64,
      "bytes": 1805,
      "outline": [
        {
          "level": 1,
          "text": "20 论文强点精讲"
        },
        {
          "level": 2,
          "text": "强点 1：任务方向清晰"
        },
        {
          "level": 2,
          "text": "强点 2：方法设计务实"
        },
        {
          "level": 2,
          "text": "强点 3：数据和 benchmark 都补齐"
        },
        {
          "level": 2,
          "text": "强点 4：评测贴近仿真任务"
        },
        {
          "level": 2,
          "text": "强点 5：工程链条完整"
        },
        {
          "level": 2,
          "text": "大白话总结"
        },
        {
          "level": 2,
          "text": "仍要注意"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 20. 这篇论文的强点` PhysX-Omni 把 3D 生成从 visual asset 推向 simulation-ready physical asset。这个方向对机器人、仿真、embodied AI 更实用。 它没有完全重造 3D decoder，而是组合： - Qwen2.5-VL 做视觉语言推理。 - template-based RLE 做 VLM 友好的几何文本。 - TRELLIS 做 3D decoder。 - URDF/XML 后处理做仿真接入。 这种设计降低了从零训练 3D 生成器的成本，也更容易复用现有生态。 很多论文只给模型，PhysX-Omni 同时给了： - PhysXVerse 数据集。 - PhysX-Bench benchmark。 - 模型权重。 - 代码。 - 推理和训练说明。 这对复现和后续研究很重要。 它不只看 CD、F-scor"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "21 需要警惕的边界精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/21_boundaries.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/21_boundaries.md",
      "lines": 65,
      "bytes": 2330,
      "outline": [
        {
          "level": 1,
          "text": "21 需要警惕的边界精讲"
        },
        {
          "level": 2,
          "text": "边界 1：VLM judge 的主观性"
        },
        {
          "level": 2,
          "text": "边界 2：物理属性是合理性，不是测量值"
        },
        {
          "level": 2,
          "text": "边界 3：训练成本高"
        },
        {
          "level": 2,
          "text": "边界 4：几何质量不是所有指标第一"
        },
        {
          "level": 2,
          "text": "边界 5：商业使用受限"
        },
        {
          "level": 2,
          "text": "边界 6：本地复现边界"
        },
        {
          "level": 2,
          "text": "建议写法"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 21. 需要警惕的边界` PhysX-Bench 依赖 VLM judge 来评估很多复杂属性，例如 affordance、description、kinematic plausibility。好处是能评估没有 ground-truth 的真实图片，坏处是评分会受模型、prompt 和证据质量影响。 风险： - 换一个 VLM judge，排名可能变化。 - prompt 写法会影响分数。 - VLM 的物理直觉不等于真实仿真动力学。 - 分数高不代表材料参数真实。 从单张图像很难精确反推密度、弹性、摩擦、惯量等物理属性。论文更多是在生成 physically plausible asset，而不是做实验室物性测量。 大白话：模型能猜“这个看起来像金属”，但不能保证知道它真实密度、摩擦系数和内部质量分布。 论文训练成本是 64 张 A100、约 14 天。个人 4090 不适合"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "22 和前序工作的关系精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/22_prior_work.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/22_prior_work.md",
      "lines": 63,
      "bytes": 2389,
      "outline": [
        {
          "level": 1,
          "text": "22 和前序工作的关系精讲"
        },
        {
          "level": 2,
          "text": "PhysXGen / PhysX-3D"
        },
        {
          "level": 2,
          "text": "PhysX-Anything"
        },
        {
          "level": 2,
          "text": "TRELLIS"
        },
        {
          "level": 2,
          "text": "MonoArt"
        },
        {
          "level": 2,
          "text": "大白话说明"
        },
        {
          "level": 2,
          "text": "复现含义"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 22. 和前序工作的关系` PhysXGen 更偏 physical-grounded 3D asset generation。它关注给 3D asset 注入物理属性，是 PhysX-Omni 的重要前置方向。 PhysX-3D / PhysXNet 也成为 PhysX-Omni 训练数据的重要组成。Hugging Face 当前公开 `Caoza/PhysX-3D` 约 1.83TB，说明它是一个很重的数据和资产体系。 PhysX-Omni 相比 PhysXGen 的推进： - 覆盖更统一的 rigid、deformable、articulated。 - 引入 PhysXVerse 扩大通用物体覆盖。 - 用 template-based RLE 改进 VLM 几何生成。 - 通过 PhysX-Bench 评估真实条件图下的物理属性。 PhysX-Anything 是 Ph"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "23 复现路线精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/23_reproduction_route.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/23_reproduction_route.md",
      "lines": 101,
      "bytes": 2368,
      "outline": [
        {
          "level": 1,
          "text": "23 复现路线精讲"
        },
        {
          "level": 2,
          "text": "第一阶段：只读代码和跑轻量 demo"
        },
        {
          "level": 2,
          "text": "第二阶段：理解数据格式"
        },
        {
          "level": 2,
          "text": "第三阶段：跑 benchmark smoke test"
        },
        {
          "level": 2,
          "text": "第四阶段：小规模真实评测"
        },
        {
          "level": 2,
          "text": "第五阶段：替换输入图片"
        },
        {
          "level": 2,
          "text": "大白话复现路线"
        },
        {
          "level": 2,
          "text": "下一步最建议做什么"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 23. 如果我要复现，建议路线` 目标： - 确认 checkpoint 可下载。 - 确认单图推理流程。 - 看输出目录结构。 - 理解 URDF/XML 转换。 关键文件： - `download.py` - `1vlm_demo.py` - `2infer_geo.py` - `3jsongen_update.py` - `requirements.txt` 本地已经完成官方 demo 主流程，并得到 `C:\\Users\\robot\\physx_outputs\\official_demo_full`。 目标： - 看 PhysXVerse annotation 结构。 - 看 template-based RLE 输入输出格式。 - 看训练数据 template。 关键目录： - `dataset/` - `configs/` - `qwen-vl-finetune/`"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "24 对机器人和仿真工作的启发精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/24_robotics_sim_insights.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/24_robotics_sim_insights.md",
      "lines": 64,
      "bytes": 1652,
      "outline": [
        {
          "level": 1,
          "text": "24 对机器人和仿真工作的启发精讲"
        },
        {
          "level": 2,
          "text": "启发 1：资产不是 mesh 就结束"
        },
        {
          "level": 2,
          "text": "启发 2：评价不能只看美观"
        },
        {
          "level": 2,
          "text": "启发 3：单图物理属性天然不确定"
        },
        {
          "level": 2,
          "text": "启发 4：对象生成可以成为场景生成组件"
        },
        {
          "level": 2,
          "text": "对实际机器人工作的建议"
        },
        {
          "level": 2,
          "text": "大白话总结"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 24. 对机器人和仿真工作的启发` 机器人仿真资产至少需要： - 可碰撞几何。 - 尺寸。 - 质量和惯量。 - 材料和摩擦。 - 关节。 - 可交互区域。 - 语义部件。 PhysX-Omni 的价值在于把 asset 从 mesh 扩展成带物理结构的对象。 传统 3D 生成容易追求漂亮图。机器人关心的是： - 能不能抓。 - 能不能推。 - 能不能开。 - 会不会穿模。 - 关节能不能驱动。 - 放到仿真器里会不会炸。 PhysX-Bench 的多维指标就是为了避免只看视觉质量。 从一张图判断材料、质量和摩擦很难。生成模型更像是在做常识补全。 所以 benchmark 评估的是 plausibility，而不是精确物理测量。 对象级生成器可以和： - depth estimation - segmentation - scene layout reconstruction"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "25 核心术语表精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/25_glossary.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/25_glossary.md",
      "lines": 59,
      "bytes": 1731,
      "outline": [
        {
          "level": 1,
          "text": "25 核心术语表精讲"
        },
        {
          "level": 2,
          "text": "Simulation-ready"
        },
        {
          "level": 2,
          "text": "Affordance"
        },
        {
          "level": 2,
          "text": "Kinematics"
        },
        {
          "level": 2,
          "text": "Absolute scale"
        },
        {
          "level": 2,
          "text": "Material"
        },
        {
          "level": 2,
          "text": "Template-based RLE"
        },
        {
          "level": 2,
          "text": "VLM judge"
        },
        {
          "level": 2,
          "text": "URDF / XML / MJCF"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 25. 核心术语表` 不是只可视化，而是可以进入物理仿真器。至少包含尺度、碰撞、材料、关节、功能语义等信息。 大白话：不是摆着看的模型，而是仿真器能拿来碰、推、抓、转的模型。 物体给人或机器人提供的可操作性。比如： - 把手可抓。 - 按钮可按。 - 椅面可坐。 - 门可拉。 - 轮子可滚。 在 PhysX-Bench 中，APS 用 condition image 和 affordance heatmap 判断可交互区域是否合理。 物体部件的运动学结构，包括： - joint type - joint axis - pivot - motion limit - parent-child relation 大白话：告诉仿真器哪个部件能怎么动。 真实世界尺寸。对仿真非常重要，因为碰撞、抓取、动力学、稳定性都和尺度相关。 不只是纹理外观，还包括密度、弹性、硬度、泊松比、杨氏模量等物"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "26 用一句话记住整篇论文精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/26_one_sentence_memory.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/26_one_sentence_memory.md",
      "lines": 39,
      "bytes": 1101,
      "outline": [
        {
          "level": 1,
          "text": "26 用一句话记住整篇论文精讲"
        },
        {
          "level": 2,
          "text": "一句话"
        },
        {
          "level": 2,
          "text": "拆成四段记"
        },
        {
          "level": 2,
          "text": "大白话版本"
        },
        {
          "level": 2,
          "text": "为什么这句话重要"
        },
        {
          "level": 2,
          "text": "记忆口诀"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 26. 用一句话记住整篇论文` PhysX-Omni 用 VLM 从单图推理物体的全局物理语义，再用 template-based RLE 文本表示生成部件级高分辨率几何，最后解码成带尺寸、材料、affordance 和运动学结构的 simulation-ready 3D 资产。 1. `看图`：Qwen2.5-VL 理解输入图。 2. `拆件`：识别物体部件和父子关系。 3. `写几何`：用 RLE 文本表达 part-level voxel。 4. `进仿真`：转成 mesh、URDF、XML 等资产。 给模型一张物体照片，它不只是生成一个好看的 3D 壳，而是要生成一份能放进仿真器里的“物体工程包”。 这句话同时包含了论文的四个核心： - VLM。 - 部件级物理语义。 - template-based RLE。 - simulation-ready 输出。 缺任何一个，"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "27 阅读判断精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/27_reading_judgement.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/27_reading_judgement.md",
      "lines": 59,
      "bytes": 1586,
      "outline": [
        {
          "level": 1,
          "text": "27 阅读判断精讲"
        },
        {
          "level": 2,
          "text": "总体判断"
        },
        {
          "level": 2,
          "text": "为什么值得精读"
        },
        {
          "level": 2,
          "text": "对工程落地的判断"
        },
        {
          "level": 2,
          "text": "大白话判断"
        },
        {
          "level": 2,
          "text": "后续真正落地还缺什么"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 27. 我的阅读判断` PhysX-Omni 适合作为 physical 3D generation 路线图来读。它的价值不只是模型分数，而是把任务拆成完整工程链： - 数据集：PhysXVerse。 - 表示：template-based RLE。 - 模型：Qwen2.5-VL + TRELLIS。 - 输出：URDF/XML/sim-ready asset。 - 评测：PhysX-Bench。 - 应用：机器人策略学习和场景生成。 这篇论文把几个原本分散的问题放到一个框架里： - 3D 生成。 - 视觉语言模型。 - 物理属性。 - 关节结构。 - 仿真资产格式。 - VLM benchmark。 因此它更像一个系统论文，而不是单点模型论文。 当前可以做： - 学习和复现推理流程。 - 小样本检查输出资产。 - 用 PhysX-Bench 做小规模评测。 - 复现 Phy"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "28 最适合继续追的问题精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/28_followup_questions.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/28_followup_questions.md",
      "lines": 69,
      "bytes": 2081,
      "outline": [
        {
          "level": 1,
          "text": "28 最适合继续追的问题精讲"
        },
        {
          "level": 2,
          "text": "问题 1：单图物理属性有多少是真实推断"
        },
        {
          "level": 2,
          "text": "问题 2：换 VLM judge 后排名是否稳定"
        },
        {
          "level": 2,
          "text": "问题 3：不同仿真器中是否稳定"
        },
        {
          "level": 2,
          "text": "问题 4：URDF/XML 是否足够可靠"
        },
        {
          "level": 2,
          "text": "问题 5：真实机器人任务是否提升 sim-to-real"
        },
        {
          "level": 2,
          "text": "问题 6：RLE 是否能泛化到更复杂拓扑"
        },
        {
          "level": 2,
          "text": "问题 7：换 TRELLIS.2 后瓶颈在哪"
        },
        {
          "level": 2,
          "text": "建议下一步实验"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 28. 最适合继续追的问题` 从单图看不出内部密度、摩擦、惯量。模型很多时候是在根据类别和外观做常识补全。后续可以比较生成属性和真实物体测量值，区分“合理”与“准确”。 PhysX-Bench 依赖 VLM judge。后续可以用多个 judge 复评： - Qwen3.5 - GPT 系列 - Gemini 系列 - Claude 系列 - 本地开源 VLM 看 ranking 是否稳定，尤其是 affordance、material、kinematic。 同一 URDF/XML 在 MuJoCo、Isaac Sim、Genesis 中可能表现不同。需要检查： - 尺度。 - 质量。 - 惯量。 - 接触。 - 关节 limit。 - mesh 碰撞近似。 当前输出能生成 URDF/XML，但还要看： - link 是否完整。 - joint 是否合理。 - inertia"
    },
    {
      "type": "markdown",
      "group": "Step 8 概念逐项精讲",
      "title": "29 BibTeX 精讲",
      "relPath": "learning_materials/physx_omni_step8_deepdives/29_bibtex.md",
      "href": "../learning_materials/physx_omni_step8_deepdives/29_bibtex.md",
      "lines": 39,
      "bytes": 1500,
      "outline": [
        {
          "level": 1,
          "text": "29 BibTeX 精讲"
        },
        {
          "level": 2,
          "text": "BibTeX"
        },
        {
          "level": 2,
          "text": "引用时应写清楚的内容"
        },
        {
          "level": 2,
          "text": "推荐中文引用说明"
        },
        {
          "level": 2,
          "text": "注意事项"
        }
      ],
      "excerpt": "对应 `paper-reading.md`：`## 29. 适合引用的 BibTeX` 如果在报告或笔记中引用，建议同时标注： - arXiv v1：2026-05-20。 - 项目页：`https://physx-omni.github.io/` - 代码：`https://github.com/physx-omni/PhysX-Omni` - 模型：`https://huggingface.co/PhysX-Omni/PhysX-Omni` - 数据：`https://huggingface.co/datasets/PhysX-Omni/PhysXVerse` - benchmark：`https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench` 论文仍是 arXiv v1。若后续出现 v2、会议版本或正式出版版本，引用应更新到最新正式版本。代码和 Hugging Face"
    },
    {
      "type": "markdown",
      "group": "Step 9 审稿人质疑",
      "title": "PhysX-Omni 第九步：审稿人视角的灵魂拷问",
      "relPath": "learning_materials/physx_omni_step9_reviewer/00_reviewer_soul_questions.md",
      "href": "../learning_materials/physx_omni_step9_reviewer/00_reviewer_soul_questions.md",
      "lines": 254,
      "bytes": 16207,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第九步：审稿人视角的灵魂拷问"
        },
        {
          "level": 2,
          "text": "一句话审稿结论"
        },
        {
          "level": 2,
          "text": "1. 单图生成的物理属性到底有多少是真实推断，多少是常识补全？"
        },
        {
          "level": 2,
          "text": "2. PhysX-Bench 换一个 VLM judge 后排名是否稳定？"
        },
        {
          "level": 2,
          "text": "3. 生成资产在 MuJoCo、Isaac Sim、Genesis 等不同仿真器中是否一致稳定？"
        },
        {
          "level": 2,
          "text": "4. URDF/XML 输出是否包含足够可靠的质量、惯量、摩擦、关节限制？"
        },
        {
          "level": 2,
          "text": "5. 真实机器人任务中，使用这些生成资产训练是否能提升 sim-to-real 表现？"
        },
        {
          "level": 2,
          "text": "6. template-based RLE 是否能泛化到更复杂拓扑或更高分辨率？"
        },
        {
          "level": 2,
          "text": "7. 如果换成 TRELLIS.2 或更强 3D decoder，瓶颈会转移到哪里？"
        },
        {
          "level": 2,
          "text": "作为审稿人的最终问题清单"
        },
        {
          "level": 2,
          "text": "我会建议的论文措辞修订"
        },
        {
          "level": 2,
          "text": "总结"
        }
      ],
      "excerpt": "论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 官方代码：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) 官方模型：[https://huggingface.co/PhysX-Omni/PhysX-Omni](https://huggingface.co/PhysX-Omni/PhysX-Omni) PhysXVerse：[https://huggingface.co/datasets/PhysX-Omni/PhysXVerse](https://huggingface.co/datasets/PhysX-Omni/PhysXVerse) PhysX-Bench：[https://huggingface"
    },
    {
      "type": "markdown",
      "group": "Step 9 审稿人质疑",
      "title": "第九步证据矩阵：审稿问题与本地代码/复现证据",
      "relPath": "learning_materials/physx_omni_step9_reviewer/01_evidence_matrix.md",
      "href": "../learning_materials/physx_omni_step9_reviewer/01_evidence_matrix.md",
      "lines": 153,
      "bytes": 7401,
      "outline": [
        {
          "level": 1,
          "text": "第九步证据矩阵：审稿问题与本地代码/复现证据"
        },
        {
          "level": 2,
          "text": "源文件与本地资产"
        },
        {
          "level": 2,
          "text": "证据 1：benchmark 使用单一默认 VLM judge"
        },
        {
          "level": 2,
          "text": "证据 2：缺失证据进入分母并计 0 分"
        },
        {
          "level": 2,
          "text": "证据 3：DQS 明确使用类别先验和日常尺寸"
        },
        {
          "level": 2,
          "text": "证据 4：APS 使用日常常识和安全常识"
        },
        {
          "level": 2,
          "text": "证据 5：MPS 用材料常识、视频和参数共同评分"
        },
        {
          "level": 2,
          "text": "证据 6：KPS/VAPS 使用图像结构先验再看视频"
        },
        {
          "level": 2,
          "text": "证据 7：官方 demo 的 JSON 和 URDF/XML 物理字段存在落差"
        },
        {
          "level": 2,
          "text": "证据 8：RLE 是 64³ voxel 的无损编码，但复杂度受 token 约束"
        },
        {
          "level": 2,
          "text": "证据 9：README 将 TRELLIS.2 作为可替换 decoder"
        },
        {
          "level": 2,
          "text": "七个问题的证据强度表"
        }
      ],
      "excerpt": "本文件把审稿判断挂到具体证据上，避免第九步只是主观评论。 `benchmark\\README.md` 和 `benchmark\\code\\vlm\\multi.py` 中默认 judge 是： 这说明官方评估的主通道依赖一个具体 VLM。缺失证据自动 0 分的分母策略是严格的，但 judge 选择本身仍可能影响 ranking。 审稿含义： - 需要跨 judge 稳定性实验。 - 如果只报告 Qwen3.5 下的排名，不能排除 prompt/model-specific bias。 `benchmark\\README.md` 的 Missing Evidence Policy 覆盖： - RQS/MCS 缺渲染视图； - DCS 缺 color/mask/description； - DQS 缺生成尺寸或格式错误； - APS 缺 heatmap； - KPS 缺 video； - MPS 缺 water/floor video"
    },
    {
      "type": "markdown",
      "group": "Step 9 审稿人质疑",
      "title": "第九步：审稿人要求的补实验清单",
      "relPath": "learning_materials/physx_omni_step9_reviewer/02_required_experiments.md",
      "href": "../learning_materials/physx_omni_step9_reviewer/02_required_experiments.md",
      "lines": 250,
      "bytes": 6909,
      "outline": [
        {
          "level": 1,
          "text": "第九步：审稿人要求的补实验清单"
        },
        {
          "level": 2,
          "text": "实验 A：物理属性真实值标定"
        },
        {
          "level": 2,
          "text": "实验 B：VLM judge 稳定性"
        },
        {
          "level": 2,
          "text": "实验 C：跨仿真器一致性"
        },
        {
          "level": 2,
          "text": "实验 D：URDF/MJCF 物理字段完整性审计"
        },
        {
          "level": 2,
          "text": "实验 E：真实机器人 sim-to-real"
        },
        {
          "level": 2,
          "text": "实验 F：RLE 表示 scaling"
        },
        {
          "level": 2,
          "text": "实验 G：TRELLIS vs TRELLIS.2 controlled swap"
        },
        {
          "level": 2,
          "text": "推荐 rebuttal 优先级"
        },
        {
          "level": 2,
          "text": "最低可接受补充材料"
        }
      ],
      "excerpt": "本文件把七个灵魂拷问转化为可以执行的补实验设计。目标不是否定 PhysX-Omni，而是明确“怎样才能把 plausible asset generation 提升到 calibrated physical asset generation”。 目的：回答单图物理属性到底有多少是真实推断。 设计： - 采集 100-300 个真实物体。 - 每个物体提供单张输入图。 - 对真实物体测量： - 外形尺寸； - 总质量； - 部件质量； - 惯量近似； - 材料类别； - 摩擦系数； - 关节类型、轴、限位、阻尼。 - 用 PhysX-Omni 生成资产。 - 比较生成值和实测值。 指标： - 尺寸相对误差； - mass 相对误差； - inertia eigenvalue 相对误差； - material class accuracy； - friction error； - joint type accuracy； - joi"
    },
    {
      "type": "markdown",
      "group": "Step 9 审稿人质疑",
      "title": "PhysX-Omni 第九步：审稿人灵魂拷问",
      "relPath": "learning_materials/physx_omni_step9_reviewer/README.md",
      "href": "../learning_materials/physx_omni_step9_reviewer/README.md",
      "lines": 34,
      "bytes": 2246,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第九步：审稿人灵魂拷问"
        },
        {
          "level": 2,
          "text": "文件说明"
        },
        {
          "level": 2,
          "text": "最核心结论"
        }
      ],
      "excerpt": "本目录是第九步交付物，围绕用户提出的 7 个审稿问题： 1. 单图生成的物理属性到底有多少是真实推断，多少是常识补全？ 2. PhysX-Bench 换一个 VLM judge 后排名是否稳定？ 3. 生成资产在 MuJoCo、Isaac Sim、Genesis 等不同仿真器中是否一致稳定？ 4. URDF/XML 输出是否包含足够可靠的质量、惯量、摩擦、关节限制？ 5. 真实机器人任务中，使用这些生成资产训练是否能提升 sim-to-real 表现？ 6. template-based RLE 是否能泛化到更复杂拓扑或更高分辨率？ 7. 如果换成 TRELLIS.2 或更强 3D decoder，瓶颈会转移到哪里？ PhysX-Omni 的强项是把单图到可交互仿真资产的系统链路跑通；但从审稿人视角看，它目前更能证明“生成视觉/语义/物理常识一致的候选资产”，还不能充分证明“从单图恢复真实、可校准、跨仿真器稳定、能提升真实机器人"
    },
    {
      "type": "markdown",
      "group": "项目入口与交付说明",
      "title": "PhysX-Omni 学习材料",
      "relPath": "learning_materials/README.md",
      "href": "../learning_materials/README.md",
      "lines": 63,
      "bytes": 2177,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 学习材料"
        },
        {
          "level": 2,
          "text": "1. 主线精读"
        },
        {
          "level": 2,
          "text": "2. 复现和实测"
        },
        {
          "level": 2,
          "text": "3. 专题深挖"
        },
        {
          "level": 2,
          "text": "4. 项目内其他资产"
        }
      ],
      "excerpt": "这里不按文件名逐个翻。按用途分三层读：先主线，再复现，最后专题深挖。 Step 1-7 都在： 建议顺序： 对应 `.ipynb` 也在同一目录，适合 Jupyter 讲解。 复现报告都在： 优先看： 新增材料优先放进对应目录。项目根目录只留入口，不再散放长文档。"
    },
    {
      "type": "markdown",
      "group": "复现记录与实测",
      "title": "PhysX-Omni 2605.21572v1 复现报告",
      "relPath": "learning_materials/reproduction/physx-omni-2605.21572v1-repro-report.md",
      "href": "../learning_materials/reproduction/physx-omni-2605.21572v1-repro-report.md",
      "lines": 145,
      "bytes": 4472,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 2605.21572v1 复现报告"
        },
        {
          "level": 2,
          "text": "结论"
        },
        {
          "level": 2,
          "text": "可视化结果"
        },
        {
          "level": 2,
          "text": "VLM 阶段输出"
        },
        {
          "level": 2,
          "text": "TRELLIS mesh 输出"
        },
        {
          "level": 2,
          "text": "官方默认解码阻塞点"
        },
        {
          "level": 2,
          "text": "关键脚本"
        },
        {
          "level": 2,
          "text": "继续完成全量官方资产的条件"
        }
      ],
      "excerpt": "复现日期：2026-06-20 远端机器：4090 主机 `y12` 论文地址：https://arxiv.org/abs/2605.21572v1 远端复现根目录：`/data/light/repro/physx_omni_2605_21572` 已拿到明确输出测试效果： 1. **VLM / RLE voxel 阶段全量成功**：同一张 demo 图检测出 7 个部件，生成 22031 个 voxel，输出 `coord_*.txt`、`ind_*.npy`、`ind_*.ply`、`allind.npy`、`allind.ply`。 2. **TRELLIS mesh 解码链路成功跑通一个部件**：用官方 `microsoft/TRELLIS-image-large`、官方 mesh decoder、同一次 VLM 输出的第 0 个部件，生成 `OBJ / GLB / PLY`。mesh 结果为 1716 vertices"
    },
    {
      "type": "markdown",
      "group": "复现记录与实测",
      "title": "PhysX-Omni 自定义图片测试：黄色 M&M's 罐",
      "relPath": "learning_materials/reproduction/physx-omni-mms-yellow-image-test-report.md",
      "href": "../learning_materials/reproduction/physx-omni-mms-yellow-image-test-report.md",
      "lines": 76,
      "bytes": 2089,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 自定义图片测试：黄色 M&M's 罐"
        },
        {
          "level": 2,
          "text": "运行结果"
        },
        {
          "level": 2,
          "text": "可视化输出"
        },
        {
          "level": 2,
          "text": "TRELLIS Mesh 结果"
        },
        {
          "level": 2,
          "text": "质量边界"
        }
      ],
      "excerpt": "测试日期：2026-06-20 输入图片：`C:\\Users\\robot\\xwechat_files\\a29884271_7b59\\temp\\RWTemp\\2026-06\\7a1b6ebdd17d94869fd79244d8b91f84\\170406c2c260543630fc3cf40452fe0a.jpg` 远端输入：`/data/light/repro/physx_omni_2605_21572/custom_inputs/mms_yellow_170406c2.jpg` 远端输出目录：`/data/light/repro/physx_omni_2605_21572/repro_runs/user_mms_yellow_vlm/mms_yellow_170406c2` VLM/RLE 阶段运行成功： - status：`success` - mode：`4bit` - detected_parts：`4` - parts_"
    },
    {
      "type": "markdown",
      "group": "复现记录与实测",
      "title": "PhysX-Omni 当前未完成项与继续推进记录",
      "relPath": "learning_materials/reproduction/physx-omni-next-steps-and-mms-body-focus.md",
      "href": "../learning_materials/reproduction/physx-omni-next-steps-and-mms-body-focus.md",
      "lines": 59,
      "bytes": 1811,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 当前未完成项与继续推进记录"
        },
        {
          "level": 2,
          "text": "已闭环"
        },
        {
          "level": 2,
          "text": "还可继续推进"
        },
        {
          "level": 2,
          "text": "本次继续推进：高罐预处理 VLM"
        }
      ],
      "excerpt": "更新时间：2026-06-20 - 官方 demo 参考链路已完成：VLM/RLE -> `2infer_geo.py` -> `3jsongen_update.py` - 本地产物：`C:\\Users\\robot\\physx_outputs\\official_demo_full` - 打包文件：`C:\\Users\\robot\\physx_outputs\\physx_omni_official_demo_full_repro.zip` - 复现补丁：`physx-omni-assets/physx_omni_repro_quality.patch` 1. 真实 M&M's 高罐质量复现 原图只生成了盖子，预处理后已经明显改善。下一步可以对预处理图跑 TRELLIS mesh/GLB。 2. 官方产物交互查看器 目前已有静态 7 部件预览图，可继续做一个本地 HTML/Three.js 查看器加载 7 个 GLB。 3. 远端复现"
    },
    {
      "type": "markdown",
      "group": "复现记录与实测",
      "title": "PhysX-Omni 官方参考链路完整复现报告",
      "relPath": "learning_materials/reproduction/physx-omni-official-demo-full-repro-report.md",
      "href": "../learning_materials/reproduction/physx-omni-official-demo-full-repro-report.md",
      "lines": 103,
      "bytes": 3704,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 官方参考链路完整复现报告"
        },
        {
          "level": 2,
          "text": "结论"
        },
        {
          "level": 2,
          "text": "关键输出"
        },
        {
          "level": 2,
          "text": "运行中修正过的问题"
        },
        {
          "level": 2,
          "text": "复现命令摘要"
        },
        {
          "level": 2,
          "text": "关于自定义 M&M's 罐图片"
        }
      ],
      "excerpt": "复现日期：2026-06-20 论文地址：https://arxiv.org/abs/2605.21572v1 远端机器：4090 主机 `y12` 远端根目录：`/data/light/repro/physx_omni_2605_21572` 官方参考链路已走完： 1. `1vlm_demo.py` 对应的 VLM/RLE 阶段：已复用前面成功生成的 demo VLM 输出。 2. `2infer_geo.py` 几何/贴图解码阶段：已生成 7 个部件的 textured `GLB + OBJ + MTL + PNG`。 3. `3jsongen_update.py` 结构转换阶段：已生成 `basic.urdf`、`basic.xml`、`basic_info.json`。 本地完整产物目录： `C:\\Users\\robot\\physx_outputs\\official_demo_full` 本地打包文件： `C:\\User"
    },
    {
      "type": "markdown",
      "group": "复现记录与实测",
      "title": "PhysX-Omni 当前推进交付记录",
      "relPath": "learning_materials/reproduction/physx_omni_current_delivery_report.md",
      "href": "../learning_materials/reproduction/physx_omni_current_delivery_report.md",
      "lines": 167,
      "bytes": 5216,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 当前推进交付记录"
        },
        {
          "level": 2,
          "text": "1. M&M's 高罐几何解码"
        },
        {
          "level": 2,
          "text": "2. 官方 7 部件交互查看器"
        },
        {
          "level": 2,
          "text": "3. 固化复现脚本和补丁"
        },
        {
          "level": 2,
          "text": "4. 远端环境清理"
        },
        {
          "level": 2,
          "text": "5. 后续建议"
        }
      ],
      "excerpt": "日期：2026-06-20 输入： VLM 结果： - 原图：4 个 part 里只有 1 个非空，总计 2237 voxels。 - body-focus 裁剪图：4 个 part 里有 3 个非空，总计 6188 voxels。 - 本地已同步远端 `ind_*.npy`、`ind_*.ply`、`allind.*`、`cond_img.png`。 TRELLIS 低显存几何解码： - 已在 4090 上启动多 part 低显存 TRELLIS mesh 解码脚本。 - 第一次失败：`trellis` 未进入 Python path。 - 第二次失败：远端直连 Hugging Face 超时，且本地没有 `microsoft/TRELLIS-image-large` 的 `pipeline.json` cache。 - 已改用 `HF_ENDPOINT=https://hf-mirror.com`，完成 TRELLIS-im"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "专题 1：Template-based RLE 几何表示深挖",
      "relPath": "learning_materials/supporting_notes/physx_omni_step3_innovation_1_template_rle_deepdive.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step3_innovation_1_template_rle_deepdive.md",
      "lines": 154,
      "bytes": 5013,
      "outline": [
        {
          "level": 1,
          "text": "专题 1：Template-based RLE 几何表示深挖"
        },
        {
          "level": 2,
          "text": "1. 设计目标"
        },
        {
          "level": 2,
          "text": "2. 从 3D part 到文本"
        },
        {
          "level": 2,
          "text": "3. 为什么还需要 template"
        },
        {
          "level": 2,
          "text": "4. 编码算法"
        },
        {
          "level": 2,
          "text": "5. 解码算法"
        },
        {
          "level": 2,
          "text": "6. 为什么它对 kinematics 也有帮助"
        },
        {
          "level": 2,
          "text": "7. 和我们复现产物的对应"
        }
      ],
      "excerpt": "这是 PhysX-Omni 最值得细读的创新。它解决的是：**如何让一个普通 VLM 在不增加 special tokens、不训练专用 3D tokenizer 的情况下，稳定输出高分辨率 part-level 3D geometry。** 假设一个 part 的 voxel 网格是 `64 x 64 x 64`： 每张 2D mask 用 row-major/linear scan 展平。如果某段连续像素为 1，就记录： 如果 length=1，代码里可以省略 length，只写 `start`。 例如： 意思是：从 index 10 开始连续 4 个 occupied pixels；从 22 开始连续 3 个；index 51 单点占用。 普通 RLE 只压缩单张 2D mask 内部的连续区域。但 3D 物体沿 z 轴相邻切片往往很像，比如圆柱、轮子、箱体。PhysX-Omni 再加一层模板压缩： 这里 `a` 是公共模"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "专题 2：PhysXVerse 与 PhysX-Bench 深挖",
      "relPath": "learning_materials/supporting_notes/physx_omni_step3_innovation_2_physxverse_physxbench_deepdive.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step3_innovation_2_physxverse_physxbench_deepdive.md",
      "lines": 132,
      "bytes": 4541,
      "outline": [
        {
          "level": 1,
          "text": "专题 2：PhysXVerse 与 PhysX-Bench 深挖"
        },
        {
          "level": 2,
          "text": "1. PhysXVerse：解决数据稀缺"
        },
        {
          "level": 3,
          "text": "1.1 问题"
        },
        {
          "level": 3,
          "text": "1.2 构建流程"
        },
        {
          "level": 3,
          "text": "1.3 标注内容"
        },
        {
          "level": 3,
          "text": "1.4 数据规模"
        },
        {
          "level": 3,
          "text": "1.5 为什么是创新"
        },
        {
          "level": 2,
          "text": "2. PhysX-Bench：解决评估缺口"
        },
        {
          "level": 3,
          "text": "2.1 问题"
        },
        {
          "level": 3,
          "text": "2.2 六维评估"
        },
        {
          "level": 3,
          "text": "2.3 为什么用 VLM 评估"
        },
        {
          "level": 3,
          "text": "2.4 Human alignment"
        }
      ],
      "excerpt": "这一专题讲两件事：训练数据怎么支撑创新，评估体系怎么证明它不是只会生成漂亮 mesh。 Simulation-ready physical 3D generation 需要的训练样本远比普通 image-to-3D 复杂。普通 3D 数据可能只有 mesh/texture；PhysX-Omni 需要： - object category； - absolute scale； - part hierarchy； - part geometry； - material / density / elastic parameters； - affordance； - kinematic relation； - functional description。 所以论文构建 PhysXVerse。 PhysXVerse 的创新不在“数量最大”，而在“物理标注 + 部件结构 + 类别覆盖 + VLM 可学习格式”。它让模型不只是记住几类关节物"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "专题 3：创新点与官方代码/复现产物对齐",
      "relPath": "learning_materials/supporting_notes/physx_omni_step3_innovation_3_pipeline_code_repro_mapping.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step3_innovation_3_pipeline_code_repro_mapping.md",
      "lines": 117,
      "bytes": 4347,
      "outline": [
        {
          "level": 1,
          "text": "专题 3：创新点与官方代码/复现产物对齐"
        },
        {
          "level": 2,
          "text": "1. 官方主流程"
        },
        {
          "level": 2,
          "text": "2. `1vlm_demo.py`：VLM 结构化生成"
        },
        {
          "level": 2,
          "text": "3. `dataset/3generate_data_new_64_finetune_rle.py`：训练表示生成"
        },
        {
          "level": 2,
          "text": "4. `decoder_each.py`：接 TRELLIS"
        },
        {
          "level": 2,
          "text": "5. `3jsongen_update.py`：simulation-ready 装配"
        },
        {
          "level": 2,
          "text": "6. 复现证据"
        },
        {
          "level": 2,
          "text": "7. 后续复现质量建议"
        }
      ],
      "excerpt": "这份文档把论文创新点落到代码和我们已经跑出的文件上。 对应数据流： 这个脚本回答“训练时目标文本从哪里来”。核心函数： 这说明 template-based RLE 不是推理时临时 hack，而是训练目标的一部分。 我们在 4090 上为了稳定复现，把输出格式限制为 `mesh + gaussian`，避免默认 radiance_field 在 24GB 显存上 OOM。这不改变论文方法，只是工程适配。 官方 demo 生成的 `basic_info.json` 已经能看到： - `object_name`: Dumpster； - 7 个 parts； - 每个 part 的 material、density、Young's Modulus、Poisson's Ratio； - `group_info` 中多个 C 类型关节参数； - `basic.urdf` 和 `basic.xml`。 本地官方 demo： 关键数字： 本"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "PhysX-Omni 第四步附录 A：Baseline 矩阵与可比性分析",
      "relPath": "learning_materials/supporting_notes/physx_omni_step4_baseline_matrix.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step4_baseline_matrix.md",
      "lines": 123,
      "bytes": 5056,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第四步附录 A：Baseline 矩阵与可比性分析"
        },
        {
          "level": 2,
          "text": "1. 为什么 baseline 不能只看谁分数高"
        },
        {
          "level": 2,
          "text": "2. Baseline 逐个拆解"
        },
        {
          "level": 3,
          "text": "2.1 Articulate-Anything"
        },
        {
          "level": 3,
          "text": "2.2 MonoArt"
        },
        {
          "level": 3,
          "text": "2.3 PhysXGen"
        },
        {
          "level": 3,
          "text": "2.4 PhysX-Anything"
        },
        {
          "level": 2,
          "text": "3. Baseline 输出和 benchmark 代码格式"
        },
        {
          "level": 2,
          "text": "4. 对比时最容易犯的错误"
        }
      ],
      "excerpt": "PhysX-Omni 论文里的 baseline 覆盖了不同问题定义： - 有些方法主要做 articulated object。 - 有些方法主要做几何生成或重建。 - 有些方法开始输出物理属性。 - PhysX-Anything 和 PhysX-Omni 才更接近“从单图生成 simulation-ready physical 3D asset”的完整目标。 因此表中的 `--` 不是 0 分，而是方法没有对应输出，或不适合按该物理属性指标评估。 定位： - 面向 articulated object 的生成或构建。 - 更关注可动部件、关节、运动结构，而不是完整材料、尺度、affordance、description。 论文里怎么评： - conventional table 中有 PSNR、CD、F-score、kinematic。 - scale、material、affordance、description 为 `-"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "PhysX-Omni 第四步附录 C：Benchmark 代码与论文实验对应",
      "relPath": "learning_materials/supporting_notes/physx_omni_step4_benchmark_code_mapping.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step4_benchmark_code_mapping.md",
      "lines": 314,
      "bytes": 8923,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第四步附录 C：Benchmark 代码与论文实验对应"
        },
        {
          "level": 2,
          "text": "1. 代码总流程"
        },
        {
          "level": 2,
          "text": "2. 配置入口"
        },
        {
          "level": 2,
          "text": "3. 指标到代码的逐项对应"
        },
        {
          "level": 2,
          "text": "4. 每个指标的证据资产"
        },
        {
          "level": 3,
          "text": "RQS"
        },
        {
          "level": 3,
          "text": "MCS"
        },
        {
          "level": 3,
          "text": "DCS"
        },
        {
          "level": 3,
          "text": "DQS"
        },
        {
          "level": 3,
          "text": "APS"
        },
        {
          "level": 3,
          "text": "KPS"
        },
        {
          "level": 3,
          "text": "MPS"
        }
      ],
      "excerpt": "本地 benchmark 代码在： `C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-assets\\code\\PhysX-Omni\\benchmark` `benchmark/README.md` 的主流程可以压缩成： 这个结构和论文 PhysX-Bench 对应：PhysX-Bench 不直接读模型内部参数打分，而是把物理属性转成可视化证据，再让 VLM 按统一 rubric 判断。 默认配置模板： `benchmark/configs/paths.example.yaml` 关键字段： 脚本公共逻辑： `benchmark/scripts/common.sh` 其中 `METHODS`、`DATASETS`、`RUN_VLM`、`RUN_AGGREGATE`、`RUN_VALIDATE`、`LIMIT` 都在这里统一处理。 输入： - 4 张 rendered views。 - `benc"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "PhysX-Omni 第四步附录 B：论文实验表格逐项分析",
      "relPath": "learning_materials/supporting_notes/physx_omni_step4_experiment_tables_analysis.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step4_experiment_tables_analysis.md",
      "lines": 116,
      "bytes": 5923,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第四步附录 B：论文实验表格逐项分析"
        },
        {
          "level": 2,
          "text": "1. Conventional Metrics 表"
        },
        {
          "level": 3,
          "text": "1.1 PhysXVerse"
        },
        {
          "level": 3,
          "text": "1.2 PhysX-Mobility"
        },
        {
          "level": 2,
          "text": "2. PhysX-Bench 表"
        },
        {
          "level": 2,
          "text": "3. Human alignment"
        },
        {
          "level": 2,
          "text": "4. Ablation 的严谨边界"
        }
      ],
      "excerpt": "论文表格列： - Geometry：PSNR 越高越好，Chamfer Distance 越低越好，F-score 越高越好。 - Physical Attributes：Absolute scale 越低越好；Material、Affordance、Kinematic、Description 越高越好。 - CD 单位是 `x10^-3`。 - F-score 单位是 `x10^-2`，阈值 `0.05`。 解释： - PhysX-Omni 在 PhysXVerse 上全列最优。 - 相对 MonoArt，CD 从 `7.03` 到 `2.95`，下降约 `58.0%`。 - 相对 PhysX-Anything，CD 从 `37.06` 到 `2.95`，下降约 `92.0%`。 - 绝对尺度误差相对 PhysX-Anything 从 `298.19` 到 `2.79`，下降约 `99.1%`。 - Kinematic 从 P"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "PhysX-Omni 第五步附录：PhysX-Bench 数据字段字典",
      "relPath": "learning_materials/supporting_notes/physx_omni_step5_bench_data_fields.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step5_bench_data_fields.md",
      "lines": 396,
      "bytes": 11860,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第五步附录：PhysX-Bench 数据字段字典"
        },
        {
          "level": 2,
          "text": "1. HF 原始数据层"
        },
        {
          "level": 2,
          "text": "2. Prepared condition image 层"
        },
        {
          "level": 2,
          "text": "3. Method output 层"
        },
        {
          "level": 2,
          "text": "4. Metric asset 层"
        },
        {
          "level": 2,
          "text": "5. Manifest 公共字段"
        },
        {
          "level": 2,
          "text": "6. RQS / MCS manifest 字段"
        },
        {
          "level": 2,
          "text": "7. DCS manifest 字段"
        },
        {
          "level": 2,
          "text": "8. DQS manifest 字段"
        },
        {
          "level": 2,
          "text": "9. APS manifest 字段"
        },
        {
          "level": 2,
          "text": "10. KPS manifest 字段"
        },
        {
          "level": 2,
          "text": "11. MPS manifest 字段"
        }
      ],
      "excerpt": "官方数据集： [https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench](https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench) 文件树： 核心字段： 三个 description JSON 都是简单 key-value： 转换脚本： `benchmark/code/assets/prepare_demo_condition_images.py` 输入： 输出： 字段： 默认输出根目录： `benchmark/scripts/common.sh` 中的映射： 常见文件： 所有 manifest 都是 JSONL 和 CSV 双格式。最核心公共字段： 构建脚本： `benchmark/code/manifests/build_render_view_manifest.py` 字段： 构建脚本： `benchmark/cod"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "PhysX-Omni 第六步附录：数据 schema 与预处理管线",
      "relPath": "learning_materials/supporting_notes/physx_omni_step6_dataset_schema_pipeline.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step6_dataset_schema_pipeline.md",
      "lines": 288,
      "bytes": 7136,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第六步附录：数据 schema 与预处理管线"
        },
        {
          "level": 2,
          "text": "1. 数据目录结构"
        },
        {
          "level": 2,
          "text": "2. JSON schema"
        },
        {
          "level": 2,
          "text": "3. 运动类型参数"
        },
        {
          "level": 2,
          "text": "4. `1voxel_verse.py`"
        },
        {
          "level": 2,
          "text": "5. `2encode_representation_64_finetune.py`"
        },
        {
          "level": 2,
          "text": "6. `3generate_data_new_64_finetune_rle.py`"
        },
        {
          "level": 2,
          "text": "7. Template-RLE 具体机制"
        },
        {
          "level": 2,
          "text": "8. 训练配置字段"
        },
        {
          "level": 2,
          "text": "9. Split 与本地证据"
        },
        {
          "level": 2,
          "text": "10. Dataset 与模型能力的对应关系"
        }
      ],
      "excerpt": "PhysXVerse 在本地预处理脚本中假设解压后结构大致为： 预处理临时输出： 结构化文本输出： 训练 JSON 输出： 顶层： part： group： 解释： - group `0` 通常是 base group。 - 非 0 group 形如 `[child_parts, parent_group, params, type]`。 - `params` 的含义依赖 `type`。 脚本里会把归一化变换同步应用到这些参数，避免 mesh 坐标变了但关节轴还在旧坐标。 主要任务： 1. 读取 `partobj/<object_id>` 下的 part OBJ。 2. 合并成整体 mesh，计算 bbox。 3. 归一化到统一尺度和中心。 4. 对关节参数做相同坐标变换。 5. 逐 part 生成 voxel indices。 6. 输出多个分辨率：`16 / 32 / 64`。 关键函数： 输出字段： 主要任务： - 把 o"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "PhysX-Omni 第七步附录 B：后续/同期文献扫描",
      "relPath": "learning_materials/supporting_notes/physx_omni_step7_literature_followup_scan.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step7_literature_followup_scan.md",
      "lines": 119,
      "bytes": 5157,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第七步附录 B：后续/同期文献扫描"
        },
        {
          "level": 2,
          "text": "1. 检索范围"
        },
        {
          "level": 2,
          "text": "2. 是否发现后续论文超越 PhysX-Omni"
        },
        {
          "level": 2,
          "text": "3. 同期/近同期值得关注的论文"
        },
        {
          "level": 3,
          "text": "3.1 MonoArt"
        },
        {
          "level": 3,
          "text": "3.2 MotionAnymesh"
        },
        {
          "level": 3,
          "text": "3.3 REST3D"
        },
        {
          "level": 3,
          "text": "3.4 Articulate AnyMesh"
        },
        {
          "level": 2,
          "text": "4. 结论"
        }
      ],
      "excerpt": "检索日期：2026-06-20 目标：确认是否已有论文明确提到 PhysX-Omni 并声称超越它；同时查找同方向、同 baseline、同时间段的相关工作。 使用过的检索入口： 目前没有发现。 arXiv API `all:\"PhysX-Omni\"` 的 `totalResults` 为 1，只返回 PhysX-Omni 本文。 arXiv API `all:\"simulation-ready physical 3D\"` 的结果为 PhysX-Omni 和 PhysX-Anything。 Web search 结果主要是 arXiv、Hugging Face、alphaXiv、项目页、新闻稿、中文解读和社交媒体内容，没有发现新的同协议论文声称在 PhysX-Bench / PhysXVerse / PhysX-Mobility 上超过 PhysX-Omni。 注意：Semantic Scholar API 本轮返回 429，因"
    },
    {
      "type": "markdown",
      "group": "支撑笔记与矩阵",
      "title": "PhysX-Omni 第七步附录 A：Baseline 复现优先级与执行路线",
      "relPath": "learning_materials/supporting_notes/physx_omni_step7_reproduction_priority.md",
      "href": "../learning_materials/supporting_notes/physx_omni_step7_reproduction_priority.md",
      "lines": 130,
      "bytes": 5984,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 第七步附录 A：Baseline 复现优先级与执行路线"
        },
        {
          "level": 2,
          "text": "1. 优先级算法"
        },
        {
          "level": 2,
          "text": "2. 复现排序"
        },
        {
          "level": 2,
          "text": "3. P0：PhysX-Anything 复现路线"
        },
        {
          "level": 3,
          "text": "为什么先做"
        },
        {
          "level": 3,
          "text": "小样本目标"
        },
        {
          "level": 3,
          "text": "风险"
        },
        {
          "level": 2,
          "text": "4. P1：MonoArt 复现路线"
        },
        {
          "level": 3,
          "text": "为什么做"
        },
        {
          "level": 3,
          "text": "小样本目标"
        },
        {
          "level": 3,
          "text": "风险"
        },
        {
          "level": 2,
          "text": "5. P2：PhysXGen / PhysX-3D 复现路线"
        }
      ],
      "excerpt": "复现优先级按四个因素打分： 官方代码：[https://github.com/ziangcao0312/PhysX-Anything](https://github.com/ziangcao0312/PhysX-Anything) 模型/数据入口：[https://huggingface.co/Caoza/PhysX-Anything](https://huggingface.co/Caoza/PhysX-Anything)，[https://huggingface.co/datasets/Caoza/PhysX-Mobility](https://huggingface.co/datasets/Caoza/PhysX-Mobility) - PhysX-Omni 论文中最高频。 - 和 PhysX-Omni 一样有 VLM + geometry text representation + simulation-ready 输出"
    },
    {
      "type": "markdown",
      "group": "前端查看器",
      "title": "PhysX-Omni 论文精读与复现教学站",
      "relPath": "official_viewer/README.md",
      "href": "README.md",
      "lines": 39,
      "bytes": 1607,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读与复现教学站"
        },
        {
          "level": 2,
          "text": "Run"
        },
        {
          "level": 2,
          "text": "Loaded assets"
        }
      ],
      "excerpt": "本目录是一个本地静态前端，不只是 3D viewer。它按“课程 + 证据 + 材料库”组织 PhysX-Omni 精读内容： - Step 1-10 论文精读路线； - 论文主线和官方 pipeline； - `1vlm_demo.py`、`2infer_geo.py`、`decoder_each.py`、`3jsongen_update.py` 核心代码入口； - 官方 7 部件复现记录； - M&M's 高罐 body-focus 实测记录； - PhysX-Bench、数据集和 reviewer 问题； - 全量 Markdown / Notebook 材料库，可搜索、过滤、预览章节大纲； - 官方 7 部件 GLB 与 M&M's 3 个 lowmem GLB 的 Three.js 交互查看。 当前材料清单由 `materials-data.js` 提供，来源是 `build_materials_data.py` 扫描"
    },
    {
      "type": "markdown",
      "group": "项目入口与交付说明",
      "title": "PhysX-Omni 阅读索引",
      "relPath": "physx_omni_reading_index.md",
      "href": "../physx_omni_reading_index.md",
      "lines": 340,
      "bytes": 10793,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 阅读索引"
        },
        {
          "level": 2,
          "text": "0. 最快读懂路线"
        },
        {
          "level": 2,
          "text": "1. 论文精读主线"
        },
        {
          "level": 2,
          "text": "2. Step 8 概念精讲入口"
        },
        {
          "level": 2,
          "text": "3. 复现证据索引"
        },
        {
          "level": 3,
          "text": "官方 demo 完整复现"
        },
        {
          "level": 3,
          "text": "M&M's 黄色高罐"
        },
        {
          "level": 2,
          "text": "4. 交互查看器"
        },
        {
          "level": 2,
          "text": "5. 审稿与技术质疑索引"
        },
        {
          "level": 3,
          "text": "第九步：Reviewer 灵魂拷问"
        },
        {
          "level": 3,
          "text": "第十步：技术实验回答"
        },
        {
          "level": 2,
          "text": "6. 代码与脚本索引"
        }
      ],
      "excerpt": "论文：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 官方代码：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) 本地资料根目录：`C:\\Users\\robot\\Documents\\成长学习库` 本地复现输出：`C:\\Users\\robot\\physx_outputs` 这个索引用来把前面 1-10 步精读、复现、审稿质疑、技术实验和 M&M's 实测输出串起来。建议不要从所有文件顺序硬读，而是按下面路径读。 如果只想快速建立全局认识，按这个顺序： 1. `physx-omni-2605.21572v1-paper-reading.md` 最早的论文精读总览，适合先建立问题、方法、实验和结论的整体图。 2. `ph"
    },
    {
      "type": "markdown",
      "group": "项目入口与交付说明",
      "title": "PhysX-Omni 项目质量标准",
      "relPath": "PROJECT_QUALITY_STANDARD.md",
      "href": "../PROJECT_QUALITY_STANDARD.md",
      "lines": 75,
      "bytes": 2165,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 项目质量标准"
        },
        {
          "level": 2,
          "text": "Gate 1：阅读完整性"
        },
        {
          "level": 2,
          "text": "Gate 2：复现证据"
        },
        {
          "level": 2,
          "text": "Gate 3：来源可追溯"
        },
        {
          "level": 2,
          "text": "Gate 4：前端质量"
        },
        {
          "level": 2,
          "text": "Gate 5：自动化"
        },
        {
          "level": 2,
          "text": "Gate 6：非声明项"
        }
      ],
      "excerpt": "本项目按“可阅读、可复现、可验证”的研究交付标准整理。每个重要结论都应能对应到一个入口文件、一个来源记录、一个本地证据路径和一个可运行的验证检查。 状态：通过 要求： - Step 1-7 论文精读 Markdown 存在。 - Step 8 概念逐项精讲索引存在。 - Step 9 审稿人质疑存在。 - Step 10 技术实验回答存在。 - 教学前端通过 `materials-data.js` 索引 Markdown 和 Notebook。 状态：通过，但带明确边界 要求： - 官方 demo 有 7 个 GLB 部件。 - 官方 demo 在复现报告中记录了 `basic_info.json`、`basic.urdf`、`basic.xml`。 - M&M's body-focus 测试记录 voxel 数量和 mesh-only 输出。 - 复现证据旁必须说明限制，不能把压力测试说成 benchmark 成功。 已知限制"
    },
    {
      "type": "markdown",
      "group": "项目入口与交付说明",
      "title": "PhysX-Omni 2605.21572v1 精读与复现包",
      "relPath": "README.md",
      "href": "../README.md",
      "lines": 116,
      "bytes": 3774,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 2605.21572v1 精读与复现包"
        },
        {
          "level": 2,
          "text": "入口"
        },
        {
          "level": 2,
          "text": "已完成内容"
        },
        {
          "level": 2,
          "text": "没有声称完成的内容"
        },
        {
          "level": 2,
          "text": "目录结构"
        },
        {
          "level": 2,
          "text": "复现输出"
        },
        {
          "level": 2,
          "text": "质量检查"
        },
        {
          "level": 2,
          "text": "更新教学前端"
        }
      ],
      "excerpt": "这是 PhysX-Omni 的本地精读、代码导读、复现证据和交互查看包。 这次整理参考了 `dictmap/roboplay` 的轻量复现仓库风格：主入口清楚、证据边界清楚、来源清单清楚、脚本入口清楚、验证结果可复跑；大体积运行输出不塞进项目树，而是通过 manifest 和报告说明位置与可信边界。 - 论文精读材料已经组织为 Step 1-10。 - 官方参考 demo 已跑通 VLM/RLE、几何解码、URDF/MuJoCo XML 生成。 - 教学前端已经索引 90 个 Markdown/Notebook 文档。 - 官方 7 部件 demo 和 M&M's body-focus mesh 输出都可以在 Three.js viewer 中查看。 - M&M's 高罐结果被明确标注为真实图片压力测试，不等价于官方 benchmark 成功。 - 项目级验证脚本会检查结构、manifest、材料索引、viewer 资产和关键证"
    },
    {
      "type": "markdown",
      "group": "项目入口与交付说明",
      "title": "PhysX-Omni Remote Cleanup Notes",
      "relPath": "REMOTE_CLEANUP_NOTES.md",
      "href": "../REMOTE_CLEANUP_NOTES.md",
      "lines": 32,
      "bytes": 1046,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni Remote Cleanup Notes"
        },
        {
          "level": 2,
          "text": "Intentional code changes"
        },
        {
          "level": 2,
          "text": "Transient dirty files"
        }
      ],
      "excerpt": "Remote host: `light-47022` Remote root: `/data/light/repro/physx_omni_2605_21572` Remote repo: `/data/light/repro/physx_omni_2605_21572/code/PhysX-Omni` These are preserved and captured by `physx_omni_repro_quality.patch`: - `decoder_each.py`: call `pipeline.run_decoder(..., formats=['mesh', 'gaussian'])` to avoid the unused `radiance_field` branch that OOMs on 24GB 4090. - `trellis/pipelines/trellis_image_to_3d.py`:"
    },
    {
      "type": "markdown",
      "group": "项目入口与交付说明",
      "title": "PhysX-Omni 复现证据清单",
      "relPath": "REMOTE_EVIDENCE_MANIFEST.md",
      "href": "../REMOTE_EVIDENCE_MANIFEST.md",
      "lines": 134,
      "bytes": 2912,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 复现证据清单"
        },
        {
          "level": 2,
          "text": "官方参考 Demo"
        },
        {
          "level": 2,
          "text": "M&M's 黄色高罐 Body-Focus 测试"
        },
        {
          "level": 2,
          "text": "复现脚本"
        },
        {
          "level": 2,
          "text": "学习材料证据"
        }
      ],
      "excerpt": "日期：2026-06-25 这个文件只记录已经有证据支持的内容，以及不能越界声称的内容。它和教学叙述分开，方便快速审计。 状态：已复现 本地证据目录： 教学前端同步证据： 允许声称： - 本地 viewer 有 7 个官方 GLB 部件。 - 官方参考链路已生成 `basic_info.json`、`basic.urdf`、`basic.xml`。 - 官方 demo 可以在 HTTP 版 Three.js viewer 中交互查看。 不允许声称： - 生成的物理参数已经被证明真实可靠。 - 资产已经通过跨仿真器动态验证。 - 这些资产已经证明能提升真实机器人 sim-to-real。 状态：压力测试解码完成 本地证据目录： 教学前端同步证据： 实测事实： 允许声称： - body-focus 预处理提升了非空部件覆盖。 - TRELLIS 低显存 mesh-only 解码为 3 个非空部件生成了 GLB。 - 用户观察“罐子看"
    },
    {
      "type": "notebook",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读：第 2 步 - 作者、团队与研究谱系",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_author_deep_reading_step2.ipynb",
      "href": "../learning_materials/paper_reading/physx_omni_paper_author_deep_reading_step2.ipynb",
      "markdownCells": 15,
      "codeCells": 1,
      "bytes": 22114,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读：第 2 步 - 作者、团队与研究谱系"
        },
        {
          "level": 2,
          "text": "0. 作者和单位的核对"
        },
        {
          "level": 2,
          "text": "1. 两个团队：为什么这篇论文像“学术 + 机器人产品化”结合"
        },
        {
          "level": 3,
          "text": "1.1 S-Lab / MMLab@NTU"
        },
        {
          "level": 3,
          "text": "1.2 ACE Robotics / Ambient Capture Group"
        },
        {
          "level": 2,
          "text": "2. 作者逐个介绍"
        },
        {
          "level": 3,
          "text": "2.1 Ziang Cao"
        },
        {
          "level": 3,
          "text": "2.2 Yinghao Liu"
        },
        {
          "level": 3,
          "text": "2.3 Haitian Li"
        },
        {
          "level": 3,
          "text": "2.4 Runmao Yao"
        },
        {
          "level": 3,
          "text": "2.5 Fangzhou Hong"
        },
        {
          "level": 3,
          "text": "2.6 Zhaoxi Chen"
        }
      ],
      "excerpt": "这一章先不进入公式和实验，而是回答一个更基础的问题：这篇论文是谁做的，他们来自哪些团队，他们之前做过什么研究？ 结论先说：PhysX-Omni 不是一个孤立项目，而是 **NTU S-Lab / MMLab@NTU 的 3D 生成、物理 3D 资产、具身智能研究线** 与 **ACE Robotics 的 3D Vision / World Models / Embodied AI 工程研究线** 的一次汇合。它最直接的前序工作是 **PhysX-3D -> PhysX-Anything -> PhysX-Omni**。 论文 arXiv HTML/PDF 头部给出的作者和单位是： 对应来源：论文 HTML 头部列出 `Ziang Cao1, Yinghao Liu2, Haitian Li1, Runmao Yao1, Fangzhou Hong1, Zhaoxi Chen1, Liang Pan2, Ziwei Liu1`，"
    },
    {
      "type": "notebook",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读 第四步：Baseline 与实验严谨梳理",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_baselines_experiments_step4.ipynb",
      "href": "../learning_materials/paper_reading/physx_omni_paper_baselines_experiments_step4.ipynb",
      "markdownCells": 5,
      "codeCells": 6,
      "bytes": 73052,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读 第四步：Baseline 与实验严谨梳理"
        },
        {
          "level": 2,
          "text": "0. 这一部分先给结论"
        },
        {
          "level": 2,
          "text": "1. Baseline 分类"
        },
        {
          "level": 2,
          "text": "2. Conventional Evaluation 该怎么读"
        },
        {
          "level": 2,
          "text": "3. PhysX-Bench 该怎么读"
        },
        {
          "level": 2,
          "text": "4. Baseline 与代码输出格式的对应关系"
        },
        {
          "level": 2,
          "text": "5. 本地复现证据与边界"
        },
        {
          "level": 2,
          "text": "6. 下一步 full benchmark 的质量复现顺序"
        },
        {
          "level": 1,
          "text": "PhysX-Omni 第四步附录 A：Baseline 矩阵与可比性分析"
        },
        {
          "level": 2,
          "text": "1. 为什么 baseline 不能只看谁分数高"
        },
        {
          "level": 2,
          "text": "2. Baseline 逐个拆解"
        },
        {
          "level": 3,
          "text": "2.1 Articulate-Anything"
        }
      ],
      "excerpt": "论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) 本地代码：`C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-assets\\code\\PhysX-Omni`，当前 `git` 版本 `46fa1cd` 本地论文源码：`C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-author-sources\\src\\main.tex` 本地官方 demo 复现输出：`C:\\Users\\robot\\physx_outputs\\official_demo_full` 本地 benchmark s"
    },
    {
      "type": "notebook",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读 第五步：PhysX-Bench 评测设计与数据字段",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_bench_step5.ipynb",
      "href": "../learning_materials/paper_reading/physx_omni_paper_bench_step5.ipynb",
      "markdownCells": 3,
      "codeCells": 7,
      "bytes": 59669,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读 第五步：PhysX-Bench 评测设计与数据字段"
        },
        {
          "level": 2,
          "text": "0. 一句话理解 PhysX-Bench"
        },
        {
          "level": 2,
          "text": "1. Bench 的核心设计"
        },
        {
          "level": 2,
          "text": "2. 数据来源与规模"
        },
        {
          "level": 2,
          "text": "3. 原始数据到本地评测布局"
        },
        {
          "level": 2,
          "text": "4. 七类评测指标"
        },
        {
          "level": 3,
          "text": "4.1 RQS - Render Quality Score"
        },
        {
          "level": 3,
          "text": "4.2 MCS - Multi-view Consistency Score"
        },
        {
          "level": 3,
          "text": "4.3 DCS - Description Consistency Score"
        },
        {
          "level": 3,
          "text": "4.4 DQS - Dimension Quality Score"
        },
        {
          "level": 3,
          "text": "4.5 APS - Affordance Plausibility Score"
        },
        {
          "level": 3,
          "text": "4.6 KPS - Kinematic Plausibility Score"
        }
      ],
      "excerpt": "论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) 代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni) PhysX-Bench 数据集：[https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench](https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench) 本地代码：`C:\\Users\\robot\\Documents\\成长学习库\\physx-omni-assets\\code\\PhysX-Omni` PhysX-Bench 是给 simulation-ready physical 3D generat"
    },
    {
      "type": "notebook",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读：第 1 步 - 开源代码、数据资产与主流程对齐",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_code_assets_deep_reading_step1.ipynb",
      "href": "../learning_materials/paper_reading/physx_omni_paper_code_assets_deep_reading_step1.ipynb",
      "markdownCells": 14,
      "codeCells": 3,
      "bytes": 26118,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读：第 1 步 - 开源代码、数据资产与主流程对齐"
        },
        {
          "level": 2,
          "text": "0. 本章阅读对象"
        },
        {
          "level": 2,
          "text": "1. 论文主张先用一句话落地"
        },
        {
          "level": 2,
          "text": "2. 开源代码的真实结构"
        },
        {
          "level": 2,
          "text": "3. 官方推理链路：从图片到 URDF/XML"
        },
        {
          "level": 2,
          "text": "4. `1vlm_demo.py`：最关键的语义到结构步骤"
        },
        {
          "level": 2,
          "text": "5. `2infer_geo.py` + `decoder_each.py`：从稀疏 voxel 到 textured mesh"
        },
        {
          "level": 2,
          "text": "6. `3jsongen_update.py`：从生成部件到仿真资产"
        },
        {
          "level": 2,
          "text": "7. 已下载的数据资产怎么分工"
        },
        {
          "level": 2,
          "text": "8. 官方 demo 复现结果：质量门槛已经过了"
        },
        {
          "level": 2,
          "text": "9. 用户 M&M 罐子图片：为什么第一次看起来“矮”"
        },
        {
          "level": 2,
          "text": "10. 训练数据管线：为什么 dataset 脚本存在"
        }
      ],
      "excerpt": "本 notebook 是论文精读的第一章，目标不是先复述论文全文，而是先把“论文说的系统”落到我们已经下载和跑通的真实材料上：GitHub 代码、Hugging Face 模型、PhysXVerse 数据集、官方 demo 复现产物，以及用户 M&M 罐子图片的测试结果。 核心结论先放前面：PhysX-Omni 已开源，代码、模型权重和数据集都能访问并已下载到 4090；官方三步推理链路已经在 4090 跑通，产生了 VLM 结构化理解、分部 voxel/RLE、TRELLIS 解码的 textured mesh，以及最终 URDF/XML。 后续章节会继续深入：论文方法细节、RLE 表示、VLM prompt/解析、TRELLIS 解码、URDF/XML 生成、benchmark 设计和自定义图片失败案例分析。本章只把“所有东西在哪里、怎么连起来”讲清楚。 PhysX-Omni 要解决的问题是：给一张物体图片，不只生成“看起来"
    },
    {
      "type": "notebook",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni Deep Reading - Step 7: Competitor Landscape and Reproduction Priority",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_competitor_landscape_step7.ipynb",
      "href": "../learning_materials/paper_reading/physx_omni_paper_competitor_landscape_step7.ipynb",
      "markdownCells": 13,
      "codeCells": 5,
      "bytes": 47616,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni Deep Reading - Step 7: Competitor Landscape and Reproduction Priority"
        },
        {
          "level": 2,
          "text": "1. Main Step 7 Reading"
        },
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读 第七步：被超越方法、接近分数与复现优先级"
        },
        {
          "level": 2,
          "text": "0. 结论先行"
        },
        {
          "level": 2,
          "text": "1. 论文中被比较的方法"
        },
        {
          "level": 2,
          "text": "2. 高频程度"
        },
        {
          "level": 2,
          "text": "3. 分数最接近和反超点"
        },
        {
          "level": 3,
          "text": "3.1 PhysXVerse conventional metrics"
        },
        {
          "level": 3,
          "text": "3.2 PhysX-Mobility conventional metrics"
        },
        {
          "level": 3,
          "text": "3.3 PhysX-Bench"
        },
        {
          "level": 2,
          "text": "4. 推荐复现矩阵"
        },
        {
          "level": 2,
          "text": "5. “是否已有论文超越 PhysX-Omni”的检索结论"
        }
      ],
      "excerpt": "This notebook is the executable companion for Step 7. It embeds the Markdown notes and verifies the method frequency, score proximity, reproduction priority, arXiv follow-up scan, and repo reachability. Loaded from `physx_omni_paper_competitor_landscape_step7.md`. 论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1) HTML 版本：[https://arxiv.org/html/2605.21572v1](https://arxiv.org/html/2605.215"
    },
    {
      "type": "notebook",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni 论文精读：第 3 步 - 核心创新点与实现机制",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_core_innovations_step3.ipynb",
      "href": "../learning_materials/paper_reading/physx_omni_paper_core_innovations_step3.ipynb",
      "markdownCells": 4,
      "codeCells": 1,
      "bytes": 6361,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读：第 3 步 - 核心创新点与实现机制"
        },
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读：第 3 步 - 核心创新点与实现机制"
        },
        {
          "level": 2,
          "text": "核心创新速览"
        },
        {
          "level": 2,
          "text": "产物文件"
        }
      ],
      "excerpt": "本 notebook 是第三章的可执行讲义。完整主文档和三个专题 markdown 已经生成在同一目录。本 notebook 重点保留核心结论和一个 toy template-based RLE 演示，帮助把论文表示法转成直观代码。 这一章聚焦“创新点是什么、为什么重要、分别怎么做”。我把 PhysX-Omni 的创新拆成四个核心层级和两个辅助验证层级： 1. 统一 sim-ready physical 3D generation：从单图生成几何、部件、尺度、材料、affordance、运动学和仿真格式。 2. Template-based RLE：把 part-level 64³ voxel 变成 VLM 可生成的普通文本。 3. PhysXVerse：>8.7K assets、>2.9K categories、part count 1-65 的物理 3D 数据集。 4. PhysX-Bench：用 VLM/渲染图像视频评估"
    },
    {
      "type": "notebook",
      "group": "主线精读 Step 1-7",
      "title": "PhysX-Omni Paper Deep Reading - Step 6: Datasets",
      "relPath": "learning_materials/paper_reading/physx_omni_paper_datasets_step6.ipynb",
      "href": "../learning_materials/paper_reading/physx_omni_paper_datasets_step6.ipynb",
      "markdownCells": 13,
      "codeCells": 7,
      "bytes": 58972,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni Paper Deep Reading - Step 6: Datasets"
        },
        {
          "level": 2,
          "text": "1. Main Dataset Reading"
        },
        {
          "level": 1,
          "text": "PhysX-Omni 论文精读 第六步：数据集设计、来源、数量与构建方法"
        },
        {
          "level": 2,
          "text": "0. 这一节先分清楚“数据集”的两层含义"
        },
        {
          "level": 2,
          "text": "1. 为什么要新建 PhysXVerse"
        },
        {
          "level": 2,
          "text": "2. 数据集家族总览"
        },
        {
          "level": 2,
          "text": "3. PhysXVerse 的来源：PartVerse"
        },
        {
          "level": 2,
          "text": "4. PhysXVerse 构建流程"
        },
        {
          "level": 3,
          "text": "4.1 清洗与结构整理"
        },
        {
          "level": 3,
          "text": "4.2 多视角渲染"
        },
        {
          "level": 3,
          "text": "4.3 物理属性初标注"
        },
        {
          "level": 3,
          "text": "4.4 人工验证与 refinement"
        }
      ],
      "excerpt": "This notebook is the executable companion for Step 6. It explains why the datasets are needed, where they come from, how they are built, how large they are, and how they enter training and evaluation. Suggested order: read the two embedded Markdown notes first, then run the evidence cells below. The following section is loaded from `physx_omni_paper_datasets_step6.md`. 论文地址：[https://arxiv.org/abs/2605.21572v1](https:"
    },
    {
      "type": "notebook",
      "group": "Step 10 技术实验回答",
      "title": "PhysX-Omni ????????????",
      "relPath": "learning_materials/physx_omni_step10_technical_experiments/02_technical_experiment_notebook.ipynb",
      "href": "../learning_materials/physx_omni_step10_technical_experiments/02_technical_experiment_notebook.ipynb",
      "markdownCells": 8,
      "codeCells": 8,
      "bytes": 20480,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni ????????????"
        },
        {
          "level": 2,
          "text": "1. ????????"
        },
        {
          "level": 2,
          "text": "2. URDF/MJCF ??????"
        },
        {
          "level": 2,
          "text": "3. MuJoCo smoke test"
        },
        {
          "level": 2,
          "text": "4. M&M's ??????"
        },
        {
          "level": 2,
          "text": "5. RLE ????"
        },
        {
          "level": 2,
          "text": "6. Benchmark judge/prompt ??"
        },
        {
          "level": 2,
          "text": "7. ?????????"
        }
      ],
      "excerpt": "?? notebook ?? `results/step10_experiment_results.json`????????????????? 7 ???? ????? benchmark ????????????????????????????????????????????????? ???????????????? ????????????????????????????????? ????????? MuJoCo ?????????????????????????????? ?????????????????????????????? voxel projection ????????????? ??? synthetic voxel shape ? template/RLE ? token ???`approx_tokens_char_div4` ??? proxy???????? ????? PhysX-Bench"
    },
    {
      "type": "notebook",
      "group": "Step 9 审稿人质疑",
      "title": "PhysX-Omni ????????? Notebook",
      "relPath": "learning_materials/physx_omni_step9_reviewer/03_reviewer_audit_notebook.ipynb",
      "href": "../learning_materials/physx_omni_step9_reviewer/03_reviewer_audit_notebook.ipynb",
      "markdownCells": 7,
      "codeCells": 8,
      "bytes": 31175,
      "outline": [
        {
          "level": 1,
          "text": "PhysX-Omni ????????? Notebook"
        },
        {
          "level": 2,
          "text": "1. Benchmark ? judge ??"
        },
        {
          "level": 2,
          "text": "2. Prompt ????????"
        },
        {
          "level": 2,
          "text": "3. ?? demo JSON/URDF/XML ??????"
        },
        {
          "level": 2,
          "text": "4. RLE ????"
        },
        {
          "level": 2,
          "text": "5. ?????????????"
        },
        {
          "level": 2,
          "text": "6. ?????????"
        }
      ],
      "excerpt": "?? notebook ?? `00_reviewer_soul_questions.md` ????????????????????????????????? - benchmark ?? VLM judge ???????? - DQS/APS/MPS/KPS prompt ????????? - ?? demo ???? URDF/XML/JSON ????? - RLE ??????? 64? voxel ? token ??? ?????https://arxiv.org/abs/2605.21572v1 ?????? benchmark ??????? VLM judge???????????? 0 ?? ????? DQS/APS/MPS/KPS prompt ??????????? prompt ??????????? benchmark ???????/??????????????????????? ?????"
    }
  ]
};
