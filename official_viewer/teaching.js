(function () {
  const roadmap = [
    ["01", "GitHub 代码、官方流程与资产总览", "先确认 repo、模型、数据、脚本和复现输出各自承担什么角色。", [["Markdown", "../learning_materials/paper_reading/physx_omni_paper_code_assets_deep_reading_step1.md"], ["Notebook", "../learning_materials/paper_reading/physx_omni_paper_code_assets_deep_reading_step1.ipynb"]]],
    ["02", "作者与团队背景", "梳理 NTU、NVIDIA、研究方向和作者过往工作，判断问题来源与技术谱系。", [["Markdown", "../learning_materials/paper_reading/physx_omni_paper_author_deep_reading_step2.md"], ["Notebook", "../learning_materials/paper_reading/physx_omni_paper_author_deep_reading_step2.ipynb"]]],
    ["03", "核心创新点", "精读 template RLE、PhysXVerse/PhysX-Bench、端到端资产生成链路。", [["Markdown", "../learning_materials/paper_reading/physx_omni_paper_core_innovations_step3.md"], ["拆分精讲", "../learning_materials/supporting_notes/physx_omni_step3_innovation_1_template_rle_deepdive.md"]]],
    ["04", "Baseline 与实验", "把论文表格、benchmark 脚本、VLM judge 和复现边界对应起来。", [["Markdown", "../learning_materials/paper_reading/physx_omni_paper_baselines_experiments_step4.md"], ["代码映射", "../learning_materials/supporting_notes/physx_omni_step4_benchmark_code_mapping.md"]]],
    ["05", "PhysX-Bench 设计", "看清评测任务、核心字段、prompt、render manifest 和聚合逻辑。", [["Markdown", "../learning_materials/paper_reading/physx_omni_paper_bench_step5.md"], ["字段精讲", "../learning_materials/supporting_notes/physx_omni_step5_bench_data_fields.md"]]],
    ["06", "数据集构建", "解释为什么需要 PhysXVerse，怎么从资产生成 voxel/RLE/文本样本。", [["Markdown", "../learning_materials/paper_reading/physx_omni_paper_datasets_step6.md"], ["Schema", "../learning_materials/supporting_notes/physx_omni_step6_dataset_schema_pipeline.md"]]],
    ["07", "竞品、后续论文与复现优先级", "找出最该复现的对比项，不把范围扩成无边界文献综述。", [["Markdown", "../learning_materials/paper_reading/physx_omni_paper_competitor_landscape_step7.md"], ["复现优先级", "../learning_materials/supporting_notes/physx_omni_step7_reproduction_priority.md"]]],
    ["08", "paper-reading.md 逐项精讲", "把概念拆成 30 个短章节，适合逐条讲给别人听。", [["Index", "../learning_materials/physx_omni_step8_deepdives/00_index.md"]]],
    ["09", "审稿人灵魂拷问", "从物理属性真实性、judge 稳定性、仿真器一致性、sim-to-real 等角度审稿。", [["质疑全文", "../learning_materials/physx_omni_step9_reviewer/00_reviewer_soul_questions.md"], ["证据矩阵", "../learning_materials/physx_omni_step9_reviewer/01_evidence_matrix.md"]]],
    ["10", "技术专家实验回答", "用现有实验结果回答 Step 9，不把未验证内容说成已验证。", [["实验回答", "../learning_materials/physx_omni_step10_technical_experiments/00_technical_experiment_answer.md"], ["结果 JSON", "../learning_materials/physx_omni_step10_technical_experiments/results/step10_experiment_results.json"]]],
  ];

  const codeCards = [
    ["1vlm_demo.py", "../code/PhysX-Omni/1vlm_demo.py", "图像理解、部件拆解、template RLE 解析与体素落盘。", ["Qwen2.5-VL 推理", "string_to_runs_by_z_lossless_robust()", "decode_voxel_2drle_by_z()"], ["VLM", "RLE", "voxel"]],
    ["2infer_geo.py", "../code/PhysX-Omni/2infer_geo.py", "枚举 case 和 part，调用 decoder_each.py 生成几何资产。", ["--outputpath", "--range", "decoder(name, basepath, imgpath)"], ["geometry", "batch"]],
    ["decoder_each.py", "../code/PhysX-Omni/decoder_each.py", "加载 TRELLIS pipeline，把 allind.npy/ind_*.npy 解码成 mesh/GLB。", ["TrellisImageTo3DPipeline.from_pretrained()", "pipeline.run_decoder()", "postprocessing_utils.to_glb()"], ["TRELLIS", "GLB", "mesh"]],
    ["3jsongen_update.py", "../code/PhysX-Omni/3jsongen_update.py", "根据 basic_info 和 group_info 生成 URDF/MuJoCo XML。", ["reparent_by_group_info()", "generate_mjcf()", "basic.urdf / basic.xml"], ["URDF", "MJCF", "physics"]],
    ["benchmark/", "../code/PhysX-Omni/benchmark/README.md", "PhysX-Bench 的 manifest、render、VLM judge、score、aggregation 入口。", ["prompts/*.yaml", "scripts/run_*.sh", "code/aggregation/aggregate_vlm_results.py"], ["Bench", "VLM judge"]],
    ["dataset/", "../code/PhysX-Omni/dataset/3generate_data_new_64_finetune_rle.py", "PhysXVerse 体素与 RLE 数据生成链路。", ["1voxel_verse.py", "2encode_representation_64_finetune.py", "3generate_data_new_64_finetune_rle.py"], ["dataset", "RLE"]],
  ];

  const reviewerQuestions = [
    ["单图生成的物理属性到底有多少是真实推断，多少是常识补全？", "现有证据更支持“视觉线索 + 常识补全”，需要真实质量/摩擦/惯量标定实验。"],
    ["PhysX-Bench 换一个 VLM judge 后排名是否稳定？", "Step 10 已把它列为关键风险，当前还不能把单一 judge 结果视为稳定真值。"],
    ["生成资产在 MuJoCo、Isaac Sim、Genesis 等不同仿真器中是否一致稳定？", "官方链路生成 URDF/XML，但跨仿真器一致性仍需要系统化加载与动态测试。"],
    ["URDF/XML 是否包含足够可靠的质量、惯量、摩擦、关节限制？", "结构文件存在不等于物理参数可靠；惯量、摩擦和关节限制需要独立校验。"],
    ["真实机器人任务中，生成资产训练是否能提升 sim-to-real？", "论文给出方向性证据，但真正的 sim-to-real 增益需要机器人任务闭环实验。"],
    ["template-based RLE 是否能泛化到更复杂拓扑或更高分辨率？", "M&M's 案例显示输入与体素阶段是瓶颈，复杂拓扑会进一步放大该问题。"],
    ["如果换成 TRELLIS.2 或更强 3D decoder，瓶颈会转移到哪里？", "更强 decoder 可能缓解几何质量，但瓶颈会转向 VLM 部件/RLE、物理参数和评测可信度。"],
  ];

  const libraryData = window.PHYSX_OMNI_LIBRARY || { documents: [], counts: {}, groups: {} };
  const state = { group: "全部", search: "", selected: null };

  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function anchor(text, href, className) {
    const a = node("a", className, text);
    a.href = href;
    a.target = "_blank";
    a.rel = "noreferrer";
    return a;
  }

  function renderRoadmap() {
    const root = document.querySelector("#roadmapGrid");
    if (!root) return;
    root.replaceChildren();
    roadmap.forEach(([step, title, why, links]) => {
      const card = node("article", "roadmap-card");
      const index = node("div", "roadmap-index", step);
      const body = node("div");
      body.append(node("h3", "", title), node("p", "", why));
      const linkWrap = node("div", "roadmap-links");
      links.forEach(([label, href]) => linkWrap.append(anchor(label, href)));
      body.append(linkWrap);
      card.append(index, body);
      root.append(card);
    });
  }

  function renderCodeCards() {
    const root = document.querySelector("#codeGrid");
    if (!root) return;
    root.replaceChildren();
    codeCards.forEach(([title, href, role, points, tags]) => {
      const card = node("article", "code-card");
      card.append(anchor(title, href, "file-link"), node("p", "", role));
      const list = node("ul");
      points.forEach((point) => {
        const li = node("li");
        li.append(node("code", "", point));
        list.append(li);
      });
      const tagRow = node("div", "tag-row");
      tags.forEach((tag) => tagRow.append(node("span", "tag", tag)));
      card.append(list, tagRow);
      root.append(card);
    });
  }

  function renderQuestions() {
    const root = document.querySelector("#questionList");
    if (!root) return;
    root.replaceChildren();
    reviewerQuestions.forEach(([question, answer], index) => {
      const card = node("article");
      card.append(node("b", "", String(index + 1)));
      const body = node("div");
      body.append(node("h3", "", question), node("p", "", answer));
      card.append(body);
      root.append(card);
    });
  }

  function docSearchText(doc) {
    return [doc.title, doc.relPath, doc.group, doc.excerpt, ...(doc.outline || []).map((item) => item.text)].join(" ").toLowerCase();
  }

  function filteredDocs() {
    const query = state.search.trim().toLowerCase();
    return libraryData.documents.filter((doc) => {
      return (state.group === "全部" || doc.group === state.group) && (!query || docSearchText(doc).includes(query));
    });
  }

  function renderFilters() {
    const root = document.querySelector("#libraryFilters");
    if (!root) return;
    root.replaceChildren();
    ["全部", ...Object.keys(libraryData.groups || {}).sort((a, b) => a.localeCompare(b, "zh-CN"))].forEach((group) => {
      const count = group === "全部" ? libraryData.documents.length : libraryData.groups[group];
      const btn = node("button", group === state.group ? "active" : "", `${group} ${count}`);
      btn.type = "button";
      btn.addEventListener("click", () => {
        state.group = group;
        renderLibrary();
      });
      root.append(btn);
    });
  }

  function renderPreview(doc) {
    const root = document.querySelector("#docPreview");
    if (!root) return;
    root.replaceChildren();
    if (!doc) {
      root.append(node("span", "section-label", "No result"), node("h3", "", "没有可预览材料"));
      return;
    }
    root.append(node("span", "section-label", doc.group), node("h3", "", doc.title));
    const meta = node("div", "doc-meta");
    meta.append(node("span", "", doc.type === "notebook" ? "Notebook" : "Markdown"), node("span", "", `${Math.round((doc.bytes || 0) / 1024)} KB`));
    root.append(meta, node("code", "", doc.relPath), node("p", "", doc.excerpt || "该文件没有可提取的正文摘要。"));
    if (doc.outline && doc.outline.length) {
      root.append(node("h3", "", "章节大纲"));
      const outline = node("ul", "outline-list");
      doc.outline.forEach((item) => outline.append(node("li", `level-${item.level}`, item.text)));
      root.append(outline);
    }
    root.append(anchor("打开文件", doc.href));
  }

  function renderLibraryList() {
    const root = document.querySelector("#libraryList");
    if (!root) return;
    root.replaceChildren();
    const docs = filteredDocs();
    if (!docs.length) {
      root.append(node("p", "doc-card", "没有匹配的材料。"));
      renderPreview(null);
      return;
    }
    if (!state.selected || !docs.includes(state.selected)) state.selected = docs[0];
    docs.forEach((doc) => {
      const card = node("article", `doc-card${doc === state.selected ? " active" : ""}`);
      const meta = node("div", "doc-meta");
      meta.append(node("span", "", doc.group), node("span", "", doc.type === "notebook" ? "Notebook" : "Markdown"), node("span", "", doc.type === "notebook" ? `${doc.markdownCells} markdown cells` : `${doc.lines} lines`));
      card.append(node("h3", "", doc.title), meta, node("p", "", doc.excerpt || "无摘要。"));
      card.addEventListener("click", () => {
        state.selected = doc;
        renderLibraryList();
        renderPreview(doc);
      });
      root.append(card);
    });
    renderPreview(state.selected);
  }

  function renderLibrary() {
    renderFilters();
    renderLibraryList();
  }

  function addFileModeNotice() {
    if (location.protocol !== "file:") return;
    const lead = document.querySelector("#course .lead-copy");
    if (lead && !document.querySelector(".file-mode-notice")) {
      const note = node("p", "file-mode-notice", "当前是 file:// 直开模式：教学内容和材料库可用；3D GLB 交互查看器需要用 http://127.0.0.1:8017/index.html 打开。");
      lead.append(note);
    }
    const status = document.querySelector("#status");
    if (status) status.textContent = "HTTP for 3D";
    const meta = document.querySelector("#assetMeta");
    if (meta) meta.textContent = "file:// 会拦截 ES module；请用本地 HTTP 服务查看 3D。";
    const partList = document.querySelector("#partList");
    if (partList) {
      partList.replaceChildren(node("p", "stage-message", "教学内容已加载。3D 模型交互请切到 http://127.0.0.1:8017/index.html。"));
    }
  }

  function bindCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((button) => {
      if (button.dataset.copyBound) return;
      button.dataset.copyBound = "1";
      button.addEventListener("click", async () => {
        const text = button.getAttribute("data-copy");
        try {
          await navigator.clipboard.writeText(text);
          const oldText = button.textContent;
          button.textContent = "已复制";
          setTimeout(() => {
            button.textContent = oldText;
          }, 1200);
        } catch {
          window.prompt("复制路径", text);
        }
      });
    });
  }

  function init() {
    const count = document.querySelector("#docCount");
    if (count) count.textContent = String((libraryData.counts && libraryData.counts.documents) || libraryData.documents.length || 0);
    renderRoadmap();
    renderCodeCards();
    renderQuestions();
    renderLibrary();
    const input = document.querySelector("#librarySearch");
    if (input && !input.dataset.bound) {
      input.dataset.bound = "1";
      input.addEventListener("input", (event) => {
        state.search = event.target.value;
        renderLibraryList();
      });
    }
    bindCopyButtons();
    addFileModeNotice();
    window.PHYSX_OMNI_TEACHING_READY = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
