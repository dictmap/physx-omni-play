# 发布检查清单

这个清单用于确认 `dictmap/physx-omni-play` 不是一次性文件堆，而是一个可公开阅读、可验证、可继续维护的轻量复现仓库。

## 每次发布前必须通过

- `python official_viewer/build_materials_data.py`
- `python scripts/validate_physx_omni_quality.py`
- `python scripts/audit_publish_ready.py`
- `python scripts/audit_public_links.py`
- GitHub Actions `quality` workflow 通过

## 必须保持的边界

- `hf/` 不进入 Git；模型和数据集只在 `SOURCE_MANIFEST.json` 记录位置。
- `logs/` 不进入 Git；远端运行日志只在证据清单中说明。
- `__pycache__/`、Jupyter 临时目录、benchmark generated 输出不进入 Git。
- 单个 tracked 文件不得超过 GitHub 硬限制，接近大文件时要改成 manifest 记录。
- 不把 token、私钥、VNC 密码、API key 或个人凭证写入仓库。
- 面向公开读者的入口文件不能残留个人机器绝对路径；本地证据路径只放在证据清单或实验记录里。
- 下载脚本不能硬编码个人 Python、Hugging Face CLI 或 4090 根目录，必须允许环境变量覆盖。
- 上游代码、论文、模型、数据集和复现同步资产的授权边界必须写在 `THIRD_PARTY_NOTICES.md`。

## 公开入口

- 根目录 `index.html` 是公开入口。
- `README.md` 是文字入口。
- `LEARNING_INDEX.md` 是阅读路径入口。
- `official_viewer/index.html` 是教学前端入口。
- `REMOTE_EVIDENCE_MANIFEST.md` 是证据边界入口。
- `CITATION.cff` 是引用入口。
- `THIRD_PARTY_NOTICES.md` 是第三方授权边界入口。

## 质量判定

通过不代表论文全部主张都被证明，只代表本仓库的结构、来源、材料索引、证据边界和前端资产满足当前交付标准。真实机器人 sim-to-real、跨仿真器动态一致性、替换 VLM judge 后排名稳定性仍然是未完成的研究验证项。
