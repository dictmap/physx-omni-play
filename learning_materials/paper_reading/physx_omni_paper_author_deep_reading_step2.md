# PhysX-Omni 论文精读：第 2 步 - 作者、团队与研究谱系

这一章先不进入公式和实验，而是回答一个更基础的问题：这篇论文是谁做的，他们来自哪些团队，他们之前做过什么研究？

结论先说：PhysX-Omni 不是一个孤立项目，而是 **NTU S-Lab / MMLab@NTU 的 3D 生成、物理 3D 资产、具身智能研究线** 与 **ACE Robotics 的 3D Vision / World Models / Embodied AI 工程研究线** 的一次汇合。它最直接的前序工作是 **PhysX-3D -> PhysX-Anything -> PhysX-Omni**。


## 0. 作者和单位的核对

论文 arXiv HTML/PDF 头部给出的作者和单位是：

| 作者 | 论文单位标号 | 单位 |
|---|---:|---|
| Ziang Cao | 1 | S-Lab, Nanyang Technological University |
| Yinghao Liu | 2 | ACE Robotics |
| Haitian Li | 1 | S-Lab, Nanyang Technological University |
| Runmao Yao | 1 | S-Lab, Nanyang Technological University |
| Fangzhou Hong | 1 | S-Lab, Nanyang Technological University |
| Zhaoxi Chen | 1 | S-Lab, Nanyang Technological University |
| Liang Pan | 2 | ACE Robotics |
| Ziwei Liu | 1 | S-Lab, Nanyang Technological University |

对应来源：论文 HTML 头部列出 `Ziang Cao1, Yinghao Liu2, Haitian Li1, Runmao Yao1, Fangzhou Hong1, Zhaoxi Chen1, Liang Pan2, Ziwei Liu1`，并写明 `1 S-Lab, Nanyang Technological University, 2 ACE Robotics`。

来源链接：<https://arxiv.org/html/2605.21572v1>


## 1. 两个团队：为什么这篇论文像“学术 + 机器人产品化”结合

### 1.1 S-Lab / MMLab@NTU

MMLab@NTU 是 NTU 的多媒体实验室，公开介绍里写到它关注 computer vision、multimodal AI、generative AI、embodied AI，并覆盖 large multimodal models、generative intelligence、3D content creation、scene understanding 等方向。

这解释了 PhysX-Omni 的学术基因：它不是只做 robotics，也不是只做 3D graphics，而是把 **VLM、多模态生成、3D 内容生成、具身 AI** 放到同一条线上。

来源：<https://www.mmlab-ntu.com/>

### 1.2 ACE Robotics / Ambient Capture Group

Liang Pan 个人主页显示他目前是 ACE Robotics 的 Ambient Capture Group Director，研究兴趣包括 3D Vision、World Models、Embodied AI。论文中 Yinghao Liu 和 Liang Pan 都标注为 ACE Robotics。

这说明 ACE Robotics 侧更像是把“可生成的 3D/4D 空间资产”接到机器人、世界模型和物理 AI 需求上的工程/应用团队。

来源：<https://ethan7899.github.io/>


## 2. 作者逐个介绍

下面不是完整简历，而是和 PhysX-Omni 相关的“研究定位 + 代表论文/项目”。其中 Yinghao Liu 当前可核验公开信息较少，本章只保留论文单位和参与作品，不扩写未经证实的履历。


### 2.1 Ziang Cao

**身份与方向**：Ziang Cao 是 NTU College of Computing and Data Science / MMLab@NTU 的 PhD student，导师是 Ziwei Liu。他主页写到研究兴趣包括 computer vision、deep learning、3D generation。

**和 PhysX-Omni 的关系**：他是 PhysX 系列最核心的第一作者之一。PhysX-Omni 可以理解为他此前物理 3D 生成工作的统一扩展。

| 代表工作 | 年份/venue | 和 PhysX-Omni 的关系 |
|---|---|---|
| PhysX-3D: Physical-Grounded 3D Asset Generation | NeurIPS 2025 Spotlight | 先定义“physical-grounded 3D asset generation”，提出 PhysXNet/PhysXGen 路线 |
| PhysX-Anything: Simulation-Ready Physical 3D Assets from Single Image | CVPR 2026 | 从单图生成 simulation-ready assets，是 PhysX-Omni 的直接前序 |
| 3DTopia-XL | CVPR 2025 Highlight | 高质量 3D asset generation，支撑团队在 3D 内容生成上的技术积累 |
| DiffTF / DiffTF++ | ICLR / TPAMI | 大词表/Transformer 3D diffusion 生成线 |

读法：如果要理解 PhysX-Omni 的技术动机，应重点串读 Ziang Cao 的 `PhysX-3D -> PhysX-Anything -> PhysX-Omni` 三篇。

来源：<https://ziangcao0312.github.io/>


### 2.2 Yinghao Liu

**身份与单位**：论文标注 Yinghao Liu 属于 ACE Robotics。

**公开信息状态**：我没有检索到可稳定核验的独立作者主页、Google Scholar 页面或机构个人页。因此这里不推断他的学历、职务或过往论文。

| 可核验项目 | 说明 |
|---|---|
| PhysX-Omni | 论文第二作者，单位为 ACE Robotics |
| 团队上下文 | 与 Liang Pan 同属 ACE Robotics 侧；可推测其贡献可能与 ACE Robotics 的 3D/机器人应用线相关，但这只是从合作者与单位关系得到的弱推断，不能当作事实履历 |

读法：在精读时把 Yinghao Liu 暂时视为 ACE Robotics 侧贡献者。若后续需要更完整作者画像，可以继续检索 ACE Robotics 官网、LinkedIn、GitHub 或论文补充材料。

来源：<https://arxiv.org/html/2605.21572v1>


### 2.3 Haitian Li

**身份与方向**：Haitian Li 主页显示他是 NTU MSAI 硕士生，位于 MMLab@NTU，受 Haozhe Xie 和 Ziwei Liu 指导，研究关注 computer vision，尤其是 3D vision。

| 代表工作 | 年份/venue | 和 PhysX-Omni 的关系 |
|---|---|---|
| PhysX-Omni | arXiv 2026 | 本文作者，参与 simulation-ready physical 3D generation |
| MonoArt: Progressive Structural Reasoning for Monocular Articulated 3D Reconstruction | arXiv 2026 | 和 articulated 3D reconstruction 直接相关，理解关节/结构推理很有帮助 |
| Trans-Adapter: A Plug-and-Play Framework for Transparent Image Inpainting | ICCV 2025 | 图像编辑/修复方向，体现视觉生成与编辑能力 |

读法：Haitian Li 的研究线更靠近“3D vision + articulated reconstruction”，对 PhysX-Omni 中 kinematics / articulated objects 这部分有上下文价值。

来源：<https://lihaitian.com/>


### 2.4 Runmao Yao

**身份与方向**：Runmao Yao 主页显示他是 MMLab@NTU incoming PhD student / research assistant，导师为 Ziwei Liu，本科来自清华大学软件学院。他写明自己的研究方向是 video generation、world models、physical AI。

| 代表工作 | 年份/venue | 研究线索 |
|---|---|---|
| PhysX-Omni | arXiv 2026 | physical 3D asset generation |
| S-Agent: Spatial Tool-Use Elicits Reasoning for Spatial Intelligence | arXiv 2026 | spatial reasoning / tool-use agent |
| SpatialBench | arXiv 2026 | spatial foundation model evaluation |
| AnchoredDream | arXiv 2026 | single-view 360° indoor scene generation |
| SuperPC | CVPR 2025 | 点云补全/上采样/去噪/上色统一模型 |
| AirRoom | CVPR 2025 | room re-identification，偏空间/场景理解 |

读法：Runmao Yao 的背景和 PhysX-Omni 的“world model / physical AI / spatial intelligence”侧更贴近，尤其适合帮助理解 PhysX-Omni 为什么关心模拟器和机器人策略学习。

来源：<https://21yrm.github.io/>


### 2.5 Fangzhou Hong

**身份与方向**：Fangzhou Hong 主页显示他在 NTU / MMLab@NTU / S-Lab 完成 PhD，导师为 Ziwei Liu。他的研究兴趣是 3D computer vision 与 computer graphics 的交叉，近期关注 egocentric spatial intelligence。

| 代表工作 | 年份/venue | 研究线索 |
|---|---|---|
| EgoLM | CVPR 2025 Oral | egocentric motion 的多模态语言模型 |
| 3DTopia | arXiv 2024 | 大规模 text-to-3D generation |
| 3DTopia-XL | CVPR 2025 Highlight | 高质量 3D asset generation |
| EVA3D | ICLR 2023 Spotlight | compositional 3D human generation |
| AvatarCLIP | SIGGRAPH 2022 journal track | text-driven 3D avatar generation/animation |
| HCMoCo / DS-Net / 4D-DS-Net | CVPR/TPAMI | 3D/4D perception 与 panoptic segmentation |

读法：Fangzhou Hong 代表的是团队里很强的 3D 人体、3D 内容生成、egocentric/spatial intelligence 研究积累。PhysX-Omni 的 3D 资产质量、场景/机器人应用叙事，与这条线关系很深。

来源：<https://hongfz16.github.io/>


### 2.6 Zhaoxi Chen

**身份与方向**：Zhaoxi Chen 是 NTU / MMLab@NTU PhD candidate，导师为 Ziwei Liu，本科来自清华。他主页集中展示 neural rendering、generative models、3D/4D 生成、城市/场景生成等工作。

| 代表工作 | 年份/venue | 研究线索 |
|---|---|---|
| PhysX-3D | NeurIPS 2025 Spotlight | physical-grounded 3D asset generation，PhysX-Omni 直接前序 |
| 3DTopia-XL | CVPR 2025 Highlight | primitive-based representation + 3D diffusion transformer |
| LGM | ECCV 2024 Oral | feed-forward multi-view Gaussian 3D generation |
| CityDreamer / CityDreamer4D | ICCV/TPAMI | unbounded 3D/4D city generation |
| SceneDreamer / Text2Light / Relighting4D | ICCV/ECCV/TOG 等 | 神经渲染、场景生成、光照/人体重建 |

读法：Zhaoxi Chen 的线索解释了 PhysX-Omni 为什么会把“生成高质量 3D 资产”与“物理可用性”结合。PhysX-Omni 不是从机器人系统里凭空长出来的，而是建立在高质量 3D/4D 生成积累上。

来源：<https://frozenburning.github.io/>


### 2.7 Liang Pan

**身份与方向**：Liang Pan 主页显示他目前是 ACE Robotics Ambient Capture Group Director。此前曾在 Shanghai AI Lab 领导 World Model Team，也曾在 NTU S-Lab 从事研究。他的研究兴趣包括 3D Vision、World Models、Embodied AI。

| 代表工作 | 年份/venue | 研究线索 |
|---|---|---|
| PhysX-3D | NeurIPS 2025 Spotlight | physical-grounded 3D asset generation |
| PhysX-Anything | arXiv 2025 / CVPR 2026 | simulation-ready 3D assets from single image |
| GeneMAN | NeurIPS 2025 | single-image 3D human reconstruction |
| Hi3DEval | NeurIPS 2025 Datasets and Benchmarks | 3D generation evaluation |
| MVPaint | CVPR 2025 | multi-view diffusion for painting 3D assets |

读法：Liang Pan 是连接学术 3D 视觉、world model 和 ACE Robotics 应用侧的关键作者。PhysX-Omni 需要“可进模拟器、可用于机器人策略学习”的资产，这和他的研究兴趣高度吻合。

来源：<https://ethan7899.github.io/>


### 2.8 Ziwei Liu

**身份与方向**：Ziwei Liu 是 NTU College of Computing and Data Science 的 Associate Professor / Provost’s Chair in AI，位于 MMLab@NTU。他主页写到研究兴趣包括 computer vision、machine learning、computer graphics。

| 代表研究线 | 例子 | 对 PhysX-Omni 的意义 |
|---|---|---|
| 多模态/视觉语言模型 | LLaVA-OneVision、NEO、Ego-R1 等团队工作 | 支撑 VLM-based physical asset generation 的方法范式 |
| 3D/4D 生成 | 3DTopia、LGM、CityDreamer、4D 生成线 | 支撑高质量 3D 内容生成能力 |
| 物理/具身 AI | PhysX-3D、PhysX-Anything、DynamicVLA、EgoLife 等 | 支撑从“看起来像”转到“能仿真、能交互、能训练机器人” |
| 团队平台 | MMLab@NTU / S-Lab | 形成大规模学生/研究员协作的技术生态 |

读法：Ziwei Liu 更像这条研究线的 PI / 组织者。PhysX-Omni 继承的是他团队近年来从视觉感知、3D 生成、多模态模型到 embodied AI 的综合布局。

来源：<https://liuziwei7.github.io/>，<https://liuziwei7.github.io/publications.html>


## 3. 这篇论文背后的研究谱系

把作者和论文串起来，PhysX-Omni 的技术来源大致可以分成四条线：

| 研究线 | 代表作者 | 代表论文/项目 | 对 PhysX-Omni 的贡献 |
|---|---|---|---|
| 高质量 3D 资产生成 | Ziang Cao, Fangzhou Hong, Zhaoxi Chen, Liang Pan, Ziwei Liu | DiffTF, DiffTF++, 3DTopia, 3DTopia-XL, LGM | 让生成结果不只是结构标签，而能落到高质量 3D geometry/texture |
| 物理/仿真就绪 3D 资产 | Ziang Cao, Zhaoxi Chen, Liang Pan, Ziwei Liu | PhysX-3D, PhysX-Anything | 直接定义 physical attributes、simulation-ready、PhysXNet/PhysX-Mobility 等前序概念 |
| 关节/结构/空间推理 | Haitian Li, Runmao Yao, Fangzhou Hong, Zhaoxi Chen | MonoArt, SpatialBench, S-Agent, EgoLM | 支撑部件层级、kinematics、spatial reasoning、物体/场景理解 |
| 具身智能/机器人应用 | Liang Pan, Ziwei Liu, Runmao Yao, ACE Robotics 侧作者 | DynamicVLA、robotic policy learning、world models | 解释为什么论文最后强调 MuJoCo/robotic policy learning，而不是只做 mesh 指标 |

一句话记忆：**PhysX-Omni = 3D 生成团队的视觉资产能力 + VLM 的结构化输出能力 + 机器人/物理仿真的资产需求。**


## 4. 推荐阅读顺序

为了理解作者研究脉络，建议不要按时间全读，而是按和 PhysX-Omni 的距离读：

1. **PhysX-3D**：先理解 physical-grounded 3D asset 是怎么定义的，尤其是 absolute scale、material、affordance、kinematics、function description。
2. **PhysX-Anything**：理解 single-image 到 simulation-ready asset 的第一版 VLM pipeline，以及它为什么需要压缩几何表示。
3. **PhysX-Omni**：看它如何把类别扩展到 rigid / deformable / articulated，并用 PhysXVerse + PhysX-Bench 提升泛化与评估。
4. **3DTopia-XL / LGM / DiffTF++**：补团队在高质量 3D 生成上的技术背景。
5. **MonoArt / SpatialBench / S-Agent / DynamicVLA**：补 articulated reconstruction、spatial intelligence 和 embodied AI 的应用背景。

如果只读三篇，优先：`PhysX-3D -> PhysX-Anything -> PhysX-Omni`。


## 5. 源记录

| 来源 | 用途 |
|---|---|
| <https://arxiv.org/html/2605.21572v1> | 作者名单、单位、论文摘要和方法定位 |
| <https://www.mmlab-ntu.com/> | MMLab@NTU 团队方向：CV、多模态、生成式 AI、具身 AI、3D content creation |
| <https://ziangcao0312.github.io/> | Ziang Cao 主页、研究兴趣和代表论文 |
| <https://lihaitian.com/> | Haitian Li 主页、身份和论文列表 |
| <https://21yrm.github.io/> | Runmao Yao 主页、身份、研究兴趣和论文列表 |
| <https://hongfz16.github.io/> | Fangzhou Hong 主页、研究兴趣和代表论文 |
| <https://frozenburning.github.io/> | Zhaoxi Chen 主页、身份和代表论文 |
| <https://ethan7899.github.io/> | Liang Pan 主页、ACE Robotics 角色和代表论文 |
| <https://liuziwei7.github.io/> | Ziwei Liu 主页、身份和研究兴趣 |
| <https://liuziwei7.github.io/publications.html> | Ziwei Liu 代表性团队论文列表 |

边界说明：Yinghao Liu 当前只找到论文页中的作者/单位信息，未找到可靠独立公开主页或论文列表；本章避免对其个人研究经历做扩写。


```python
# 轻量结构化索引：方便后续章节引用作者、单位、方向和代表工作

authors = [
    {"name": "Ziang Cao", "team": "S-Lab / MMLab@NTU", "focus": "3D generation; physical/sim-ready 3D assets", "key_papers": ["PhysX-3D", "PhysX-Anything", "3DTopia-XL", "DiffTF++"]},
    {"name": "Yinghao Liu", "team": "ACE Robotics", "focus": "public profile not verified; paper-affiliated ACE Robotics contributor", "key_papers": ["PhysX-Omni"]},
    {"name": "Haitian Li", "team": "S-Lab / MMLab@NTU", "focus": "3D vision; articulated reconstruction", "key_papers": ["PhysX-Omni", "MonoArt", "Trans-Adapter"]},
    {"name": "Runmao Yao", "team": "S-Lab / MMLab@NTU", "focus": "video generation; world models; physical AI", "key_papers": ["PhysX-Omni", "S-Agent", "SpatialBench", "AnchoredDream", "SuperPC", "AirRoom"]},
    {"name": "Fangzhou Hong", "team": "S-Lab / MMLab@NTU", "focus": "3D computer vision; graphics; egocentric spatial intelligence", "key_papers": ["EgoLM", "3DTopia", "EVA3D", "AvatarCLIP", "4D-DS-Net"]},
    {"name": "Zhaoxi Chen", "team": "S-Lab / MMLab@NTU", "focus": "neural rendering; 3D/4D generative models", "key_papers": ["PhysX-3D", "3DTopia-XL", "LGM", "CityDreamer4D", "SceneDreamer"]},
    {"name": "Liang Pan", "team": "ACE Robotics", "focus": "3D Vision; World Models; Embodied AI", "key_papers": ["PhysX-3D", "PhysX-Anything", "GeneMAN", "Hi3DEval", "MVPaint"]},
    {"name": "Ziwei Liu", "team": "S-Lab / MMLab@NTU", "focus": "computer vision; machine learning; computer graphics; multimodal and embodied AI", "key_papers": ["PhysX-3D", "PhysX-Anything", "3DTopia", "LGM", "LLaVA-OneVision", "DynamicVLA"]},
]

for a in authors:
    print(f"{a['name']}: {a['team']} | {a['focus']} | {', '.join(a['key_papers'])}")
```
