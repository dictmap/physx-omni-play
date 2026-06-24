# PhysX-Omni 第七步附录 B：后续/同期文献扫描

检索日期：2026-06-20  
目标：确认是否已有论文明确提到 PhysX-Omni 并声称超越它；同时查找同方向、同 baseline、同时间段的相关工作。

## 1. 检索范围

使用过的检索入口：

| 来源 | 查询 |
|---|---|
| arXiv API | `all:"PhysX-Omni"` |
| arXiv API | `all:"simulation-ready physical 3D"` |
| Web search | `"PhysX-Omni" "outperform"` |
| Web search | `"PhysX-Omni" "PhysX-Bench"` |
| Web search | `"2605.21572"` |
| Web search | `"PhysXVerse" "outperform" "PhysX-Omni"` |
| Semantic Scholar API | `arXiv:2605.21572`，本轮返回 429 |

## 2. 是否发现后续论文超越 PhysX-Omni

目前没有发现。

arXiv API `all:"PhysX-Omni"` 的 `totalResults` 为 1，只返回 PhysX-Omni 本文。  
arXiv API `all:"simulation-ready physical 3D"` 的结果为 PhysX-Omni 和 PhysX-Anything。  
Web search 结果主要是 arXiv、Hugging Face、alphaXiv、项目页、新闻稿、中文解读和社交媒体内容，没有发现新的同协议论文声称在 PhysX-Bench / PhysXVerse / PhysX-Mobility 上超过 PhysX-Omni。

注意：Semantic Scholar API 本轮返回 429，因此 citation graph 没有完成。建议后续用 Semantic Scholar、Google Scholar 或 OpenAlex 再查一次。

## 3. 同期/近同期值得关注的论文

### 3.1 MonoArt

论文：[https://arxiv.org/html/2603.19231v1](https://arxiv.org/html/2603.19231v1)  
代码：[https://github.com/Quest4Science/MonoArt](https://github.com/Quest4Science/MonoArt)

关系：

- 是 PhysX-Omni 正文 Table 1/2 使用的 baseline。
- 自己的论文也比较了 PhysX-Anything、PhysXGen、Articulate-Anything。
- 在 PartNet-Mobility articulated reconstruction 的 full 46 classes 上，MonoArt 多项优于这些共同 baseline。

关键数值：

| 方法 | CD ↓ | F-score ↑ | PSNR ↑ | CLIP ↑ | Type Acc. ↑ | Axis Err. ↓ | Pivot Err. ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|
| ArtAny | 2.07 | 0.514 | 16.44 | 0.866 | 43.32 | 0.440 | 0.347 |
| PhysXGen | 3.06 | 0.501 | 16.38 | 0.859 | 46.82 | 0.941 | 0.208 |
| PhysXAny | 1.88 | 0.531 | 17.07 | 0.880 | 63.35 | **0.289** | 0.173 |
| MonoArt | **1.25** | **0.670** | **18.55** | **0.907** | **67.47** | 0.423 | **0.108** |

解读：

- MonoArt 在 geometry、appearance、joint type、pivot 上很强。
- Axis error 这一项 PhysXAny 更低，因此 MonoArt 不是所有 articulation 子项都赢。
- 它的任务边界是 articulated reconstruction，不能直接代表完整 PhysX-Omni 任务。

### 3.2 MotionAnymesh

论文：[https://arxiv.org/html/2603.12936v1](https://arxiv.org/html/2603.12936v1)

关系：

- 同属 simulation-ready digital twin / articulation 方向。
- 比较 Articulate-Anything、Articulate-AnyMesh、SINGAPO、URDFormer、PARIS。
- 没有直接比较 PhysX-Omni / PhysX-Anything。

关键数值：

| 方法 | mIoU ↑ | Count Acc ↑ | Type Err ↓ | Axis Err ↓ | Pivot Err ↓ | Executability ↑ |
|---|---:|---:|---:|---:|---:|---:|
| Articulate-Anything | 0.47 | 0.61 | 0.21 | 0.86 | 0.64 | 46% |
| Articulate-AnyMesh | 0.59 | 0.74 | 0.35 | 0.64 | 0.44 | 35% |
| MotionAnymesh | **0.86** | **0.92** | **0.08** | **0.12** | **0.10** | **87%** |

解读：

- 这是 articulation / physical executability 强相关工作。
- 因没有 PhysX-Omni / PhysX-Bench 对齐，暂时不能说它超越 PhysX-Omni。
- 可作为后续“关节可执行性”评测设计参考。

### 3.3 REST3D

论文：[https://arxiv.org/html/2605.30338v1](https://arxiv.org/html/2605.30338v1)

关系：

- 时间上接近 PhysX-Omni。
- 任务是 single image 到 physically stable 3D scenes。
- 它关注场景级支撑关系、碰撞、漂浮、穿模和物理稳定性。
- 没有直接比较 PhysX-Omni。

解读：

- 可以作为 PhysX-Omni `sim-ready scene generation` 应用侧的拓展阅读。
- 不适合作为 PhysX-Omni 单物体 physical asset benchmark 的直接 baseline。

### 3.4 Articulate AnyMesh

项目页：[https://articulate-anymesh.github.io/](https://articulate-anymesh.github.io/)  
代码：[https://github.com/UMass-Embodied-AGI/ArticulateAnymesh](https://github.com/UMass-Embodied-AGI/ArticulateAnymesh)

关系：

- 任意 mesh 到 articulated counterpart。
- 与 PhysX-Omni 的单图到完整 physical 3D asset 不完全同任务。
- MotionAnymesh 以它作为 baseline，并在 physical executability 上报告更高结果。

## 4. 结论

当前文献图谱可以这样理解：

1. PhysX-Omni 当前仍是“单图到统一 simulation-ready physical 3D asset”的最新高位方法之一。
2. PhysX-Anything 是它最重要的直接对照。
3. MonoArt 是几何/运动结构上最强、最接近甚至局部超过 PhysX-Omni 的 baseline，但不是完整物理属性生成器。
4. MotionAnymesh、Articulate AnyMesh、REST3D 都是相关方向，但任务边界不同，不能直接拿它们的指标说“超越 PhysX-Omni”。
5. 后续若要持续跟踪，应重点监控关键词：`PhysX-Bench`、`PhysXVerse`、`simulation-ready physical 3D generation`、`single-image physical 3D asset`、`articulated digital twin`。

