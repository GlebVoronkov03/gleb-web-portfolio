(() => {
  const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (touch) document.body.classList.add("is-touch");

  // ----- custom cursor -----
  let cursor, ring;
  if (!touch) {
    cursor = document.createElement("div");
    cursor.className = "cursor";
    ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.append(cursor, ring);
    let x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      cursor.style.left = x + "px";
      cursor.style.top = y + "px";
    });
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll("a, button, .node, .filter-btn, .work-card").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("big"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
    });
  }

  // ----- scroll progress -----
  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.prepend(bar);
  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
  }, { passive: true });

  // ----- nav active -----
  const path = location.pathname.replace(/\\/g, "/");
  document.querySelectorAll(".nav-links a[data-nav]").forEach((a) => {
    const key = a.getAttribute("data-nav");
    if (key === "work" && path.includes("/projects")) a.classList.add("active");
    if (key === "pubs" && path.includes("publications")) a.classList.add("active");
    if (key === "about" && path.includes("about")) a.classList.add("active");
    if (key === "home" && (path.endsWith("/") || path.endsWith("index.html") || path.endsWith("gleb-web-portfolio"))) {
      if (!path.includes("/projects") && !path.includes("about") && !path.includes("publications")) a.classList.add("active");
    }
  });

  // ----- reveal -----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ----- counters -----
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = el.getAttribute("data-count");
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
    const prefix = target.match(/^[^\d]*/)?.[0] || "";
    const suffix = target.replace(/^[^\d]*[\d.]+/, "");
    let started = false;
    const cio = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      const t0 = performance.now();
      const dur = 1100;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = numeric * eased;
        el.textContent = prefix + (Number.isInteger(numeric) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    cio.observe(el);
  });

  // ----- filters -----
  const filters = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".work-card");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      cards.forEach((c) => {
        const ok = f === "all" || (c.dataset.tags || "").includes(f);
        c.classList.toggle("hidden", !ok);
      });
    });
  });

  // ----- Fibonacci sphere points -----
  function fibSphere(n) {
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / Math.max(1, n - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }
    return pts;
  }

  // ----- Hero canvas: interactive PLER sphere -----
  const stage = document.getElementById("hero-canvas");
  if (stage) {
    const canvas = document.createElement("canvas");
    stage.prepend(canvas);
    const ctx = canvas.getContext("2d");
    const pts = fibSphere(160);
    let w = 0, h = 0, mx = 0.2, my = 0.1, t = 0;
    const resize = () => {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    const project = (p, rotY, rotX) => {
      const cy = Math.cos(rotY), sy = Math.sin(rotY);
      const cx = Math.cos(rotX), sx = Math.sin(rotX);
      let x = p.x * cy + p.z * sy;
      let z = -p.x * sy + p.z * cy;
      let y = p.y * cx - z * sx;
      z = p.y * sx + z * cx;
      const scale = Math.min(w, h) * 0.38;
      return { x: w / 2 + x * scale, y: h / 2 + y * scale, z, depth: z };
    };
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      const rotY = t * 0.35 + mx * 0.7;
      const rotX = 0.35 + my * 0.45;
      const projected = pts.map((p) => project(p, rotY, rotX)).sort((a, b) => a.depth - b.depth);
      // sphere outline
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.38, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56,189,248,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // rays toward center from subset
      for (let i = 0; i < projected.length; i += 7) {
        const p = projected[i];
        const alpha = 0.15 + (p.depth + 1) * 0.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(w / 2, h / 2);
        ctx.strokeStyle = `rgba(45,212,191,${Math.max(0.05, alpha)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      projected.forEach((p) => {
        const s = 1.2 + (p.depth + 1) * 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
        ctx.fillStyle = p.depth > 0 ? "rgba(56,189,248,0.9)" : "rgba(45,212,191,0.55)";
        ctx.fill();
      });
      // center hit
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      requestAnimationFrame(draw);
    };
    draw();
  }

  // ----- Interactive SVG diagrams -----
  const tips = {
    pler: {
      load: ["1. Load meshes", "Reference + distorted meshes via Open3D / Trimesh; optional unit-sphere normalization."],
      sphere: ["2. Bounding sphere", "Both models share an enclosing sphere; radius makes the metric scale-invariant."],
      sample: ["3. Fibonacci sample", "PLER 2.0 places ray origins with a golden spiral for uniform surface coverage."],
      cast: ["4. Ray casting", "Rays travel toward the center; first-hit distances are recorded on each mesh."],
      mse: ["5. Error stats", "Per-ray length differences form MSE (and optional skew/kurtosis features)."],
      topo: ["6. Topology", "Optional genus / Euler / edge stats enrich the feature vector."],
      score: ["7. PLER score", "Log mapping 10·log10(Lmin² / MSE); optional MOS regressor for perception studies."],
    },
    rag: {
      ingest: ["1. Ingest", "Place PDF/MD packet-core docs into data/; synthetic samples ship publicly."],
      split: ["2. Split", "RecursiveCharacterTextSplitter creates overlapping chunks."],
      embed: ["3. Embed", "HuggingFace all-MiniLM-L6-v2 turns chunks into dense vectors."],
      store: ["4. Chroma", "Persistent local vector store — no cloud round-trip after ingest."],
      retrieve: ["5. Retrieve", "Top-k similarity search builds the grounded context window."],
      llm: ["6. Generate", "Ollama Qwen2.5:7B answers in RU/EN; typical 5–40s on NVIDIA."],
      ui: ["7. Console UI", "Menu: build KB, ask questions, inspect sources."],
    },
    agents: {
      user: ["1. User task", "Kick off a multi-step research or coding request."],
      researcher: ["2. Researcher", "Pulls abstracts/papers via Chroma RAG."],
      engineer: ["3. Engineer", "Drafts implementation with LLM + tools."],
      verifier: ["4. Verifier", "Checks consistency and flags unsupported claims."],
      writer: ["5. Writer", "Methodology / report synthesis."],
      llmroute: ["LLM routing", "OpenRouter/DeepSeek with local Ollama fallback (qwen2.5-coder)."],
      ui: ["Interfaces", "FastAPI web UI and optional Telegram bot."],
    },
    anc: {
      noise: ["Primary noise", "Disturbance field to be cancelled near the quiet zone."],
      ref: ["Reference mic", "Feeds the adaptive filter with a correlated noise signal."],
      sec: ["Secondary path", "Speaker→error acoustic plant; measured as an IR."],
      ir: ["IR measure", "WASAPI capture; bench peak ≈ 43.7 ms @ 48 kHz."],
      fxlms: ["FxLMS", "Filtered-x LMS adapts coefficients using the secondary-path model."],
      speaker: ["Anti-noise", "Loudspeaker emits the cancelling waveform."],
      error: ["Error mic", "Residual drives adaptation; latency bounds feasibility."],
      sim: ["Offline sim", "python_proto FxLMS simulation before realtime claims."],
    },
    bench: {
      import: ["1. Import", "Load OBJ fixtures or local meshes into Streamlit."],
      degrade: ["2. Degrade", "Noise, smooth, decimate, hybrid generators."],
      pler: ["3. PLER family", "Core metric plus classic Chamfer/Hausdorff/F-score wrappers."],
      batch: ["4. Batch", "Run 20+ metrics across degradations."],
      norm: ["5. Normalize", "Score scaling for fair comparison."],
      mos: ["6. vs MOS", "PLCC / SROCC / Kendall correlations."],
      ui: ["7. Streamlit UI", "Interactive research console for XR QA studies."],
    },
    acoustic: {
      pos: ["Positions", "Seven presets with L/R levels and delays."],
      pan: ["Panning laws", "Linear, sin/cos, constant-power; intensity/time/mixed modes."],
      gen: ["Generator", "MLS, pink 200–5000 Hz, narrowband, or WAV @ 48 kHz."],
      adsr: ["Envelope", "ADSR shaping before playback/export."],
      play: ["Playback", "Headphones recommended for ILD/ITD listening."],
      viz: ["Visualization", "Oscillogram + spectrogram panels."],
      session: ["Session", "Build protocols and export WAV stems."],
    },
  };

  function wireTips(root, kind) {
    const tip = root.querySelector(".diagram-tip");
    if (!tip) return;
    root.querySelectorAll(".node").forEach((n) => {
      const key = n.dataset.node;
      const info = tips[kind] && tips[kind][key];
      if (!info) return;
      const show = () => {
        root.querySelectorAll(".node").forEach((x) => x.classList.remove("active"));
        n.classList.add("active");
        tip.innerHTML = "<strong>" + info[0] + "</strong>" + info[1];
        tip.classList.add("show");
        root.querySelectorAll(".logic-legend span").forEach((s) => s.classList.remove("on"));
        const legend = root.querySelector('[data-leg="' + key + '"]');
        if (legend) legend.classList.add("on");
      };
      n.addEventListener("mouseenter", show);
      n.addEventListener("focus", show);
      n.addEventListener("click", show);
      n.setAttribute("tabindex", "0");
      n.setAttribute("role", "button");
      n.setAttribute("aria-label", info[0]);
    });
  }

  function box(id, x, y, w, h, label, sub) {
    sub = sub || "";
    const subText = sub
      ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 12) + '" text-anchor="middle" fill="#8b97a8" font-size="10" font-family="JetBrains Mono, monospace">' + sub + "</text>"
      : "";
    const labelY = y + h / 2 - (sub ? 6 : 0);
    return (
      '<g class="node" data-node="' + id + '">' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" fill="#121925" stroke="#2dd4bf" stroke-width="1.5"/>' +
      '<text x="' + (x + w / 2) + '" y="' + labelY + '" text-anchor="middle" fill="#eef3f8" font-size="13" font-family="Syne,sans-serif" font-weight="700">' + label + "</text>" +
      subText +
      "</g>"
    );
  }

  function arrow(x1, y1, x2, y2, color) {
    color = color || "#2dd4bf";
    return '<line class="flow-edge" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="1.7"/>';
  }

  function svgShell(inner, caption, legendKeys, kind) {
    const legend = (legendKeys || [])
      .map(function (k) {
        const title = (tips[kind] && tips[kind][k] && tips[kind][k][0]) || k;
        return '<span data-leg="' + k + '">' + title + "</span>";
      })
      .join("");
    return (
      '<div class="diagram-shell detailed reveal">' +
      '<div class="diagram-tip" aria-live="polite">Hover or tap a stage</div>' +
      inner +
      '<div class="logic-legend">' + legend + "</div>" +
      '<div class="diagram-caption"><span>' + caption + '</span><span>Interactive · SVG logic</span></div>' +
      "</div>"
    );
  }

  function rayPreview() {
    var lines = "";
    for (var i = 0; i < 10; i++) {
      var a = (i / 10) * Math.PI * 2;
      lines +=
        '<line class="flow-edge" x1="' +
        (200 + Math.cos(a) * 70) +
        '" y1="' +
        (310 + Math.sin(a) * 70) +
        '" x2="200" y2="310"/>';
    }
    return lines;
  }

  const builders = {
    pler: function () {
      var svg =
        '<svg viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PLER detailed logic">' +
        '<rect width="720" height="420" fill="#0c1118" rx="14"/>' +
        box("load", 30, 30, 120, 56, "Load", "OBJ/mesh") +
        box("sphere", 180, 30, 120, 56, "Sphere", "normalize") +
        box("sample", 330, 30, 130, 56, "Fibonacci", "ray origins") +
        box("cast", 490, 30, 120, 56, "Cast rays", "to center") +
        arrow(150, 58, 180, 58) +
        arrow(300, 58, 330, 58) +
        arrow(460, 58, 490, 58) +
        box("mse", 180, 150, 140, 64, "MSE stats", "len diffs") +
        box("topo", 360, 150, 140, 64, "Topology", "optional") +
        box("score", 540, 150, 150, 64, "PLER score", "10log L2/MSE") +
        arrow(550, 86, 250, 150, "#38bdf8") +
        arrow(320, 182, 360, 182) +
        arrow(500, 182, 540, 182) +
        '<circle class="node" data-node="cast" cx="200" cy="310" r="70" fill="none" stroke="#38bdf8" stroke-width="2"/>' +
        '<g stroke="#2dd4bf" stroke-opacity=".5">' +
        rayPreview() +
        "</g>" +
        '<text x="200" y="400" text-anchor="middle" fill="#8b97a8" font-size="11" font-family="JetBrains Mono, monospace">ray geometry preview</text>' +
        '<text x="320" y="300" fill="#8b97a8" font-size="12" font-family="JetBrains Mono, monospace">Open3D / Trimesh · optional MOS regressor</text>' +
        "</svg>";
      return svgShell(svg, "PLER 2.0 end-to-end logic", ["load", "sphere", "sample", "cast", "mse", "topo", "score"], "pler");
    },
    rag: function () {
      var svg =
        '<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RAG detailed logic">' +
        '<rect width="720" height="360" fill="#0c1118" rx="14"/>' +
        box("ingest", 24, 40, 110, 58, "Ingest", "PDF/MD") +
        box("split", 160, 40, 110, 58, "Split", "chunks") +
        box("embed", 296, 40, 110, 58, "Embed", "MiniLM") +
        box("store", 432, 40, 110, 58, "Chroma", "persist") +
        box("retrieve", 568, 40, 120, 58, "Retrieve", "top-k") +
        arrow(134, 69, 160, 69) +
        arrow(270, 69, 296, 69) +
        arrow(406, 69, 432, 69) +
        arrow(542, 69, 568, 69) +
        box("llm", 296, 170, 160, 70, "Qwen2.5:7B", "Ollama local") +
        box("ui", 496, 170, 160, 70, "Console UI", "ask / build KB") +
        arrow(628, 98, 376, 170, "#38bdf8") +
        arrow(456, 205, 496, 205) +
        '<text x="24" y="280" fill="#8b97a8" font-size="12" font-family="JetBrains Mono, monospace">Local-only after model pull · RU/EN · synthetic docs in public repo</text>' +
        "</svg>";
      return svgShell(svg, "PS Core RAG control flow", ["ingest", "split", "embed", "store", "retrieve", "llm", "ui"], "rag");
    },
    agents: function () {
      var svg =
        '<svg viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI Team detailed logic">' +
        '<rect width="720" height="380" fill="#0c1118" rx="14"/>' +
        box("user", 40, 40, 120, 56, "User", "task") +
        box("researcher", 220, 40, 140, 56, "Researcher", "RAG") +
        box("engineer", 420, 40, 140, 56, "Engineer", "code/draft") +
        box("verifier", 220, 160, 140, 56, "Verifier", "checks") +
        box("writer", 420, 160, 140, 56, "Writer", "method") +
        box("llmroute", 40, 160, 140, 56, "LLM route", "cloud/local") +
        box("ui", 300, 280, 180, 56, "FastAPI / TG", "interfaces") +
        arrow(160, 68, 220, 68) +
        arrow(360, 68, 420, 68) +
        arrow(490, 96, 490, 160) +
        arrow(290, 96, 290, 160) +
        arrow(160, 188, 220, 188, "#38bdf8") +
        arrow(360, 188, 420, 188) +
        arrow(490, 216, 390, 280, "#38bdf8") +
        "</svg>";
      return svgShell(svg, "LangGraph multi-agent logic", ["user", "researcher", "engineer", "verifier", "writer", "llmroute", "ui"], "agents");
    },
    anc: function () {
      var svg =
        '<svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ANC detailed logic">' +
        '<rect width="720" height="400" fill="#0c1118" rx="14"/>' +
        box("noise", 30, 40, 120, 56, "Noise", "primary") +
        box("ref", 180, 40, 120, 56, "Ref mic", "x(n)") +
        box("fxlms", 340, 40, 140, 64, "FxLMS", "adaptive W") +
        box("speaker", 520, 40, 130, 56, "Speaker", "anti-noise") +
        arrow(150, 68, 180, 68) +
        arrow(300, 68, 340, 68) +
        arrow(480, 68, 520, 68) +
        box("sec", 340, 150, 140, 56, "Sec. path", "S(z)") +
        box("ir", 520, 150, 130, 64, "IR measure", "43.7ms") +
        box("error", 520, 260, 130, 56, "Error mic", "e(n)") +
        box("sim", 30, 150, 120, 56, "Sim", "offline") +
        arrow(410, 104, 410, 150, "#38bdf8") +
        arrow(480, 178, 520, 178) +
        arrow(585, 216, 585, 260, "#fb923c") +
        arrow(520, 288, 410, 104, "#fb923c") +
        '<text x="30" y="360" fill="#8b97a8" font-size="12" font-family="JetBrains Mono, monospace">WASAPI IR → plant model → FxLMS → residual</text>' +
        "</svg>";
      return svgShell(svg, "FxLMS ANC detailed loop", ["noise", "ref", "fxlms", "speaker", "sec", "ir", "error", "sim"], "anc");
    },
    bench: function () {
      var svg =
        '<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bench detailed logic">' +
        '<rect width="720" height="360" fill="#0c1118" rx="14"/>' +
        box("import", 30, 40, 120, 56, "Import", "OBJ") +
        box("degrade", 180, 40, 130, 56, "Degrade", "4 modes") +
        box("pler", 340, 40, 130, 56, "PLER+", "family") +
        box("batch", 500, 40, 150, 56, "20+ metrics", "batch") +
        arrow(150, 68, 180, 68) +
        arrow(310, 68, 340, 68) +
        arrow(470, 68, 500, 68) +
        box("norm", 180, 160, 140, 56, "Normalize", "scores") +
        box("mos", 360, 160, 150, 64, "vs MOS", "PLCC/SROCC") +
        box("ui", 540, 160, 140, 56, "Streamlit", "UI") +
        arrow(575, 96, 250, 160, "#38bdf8") +
        arrow(320, 188, 360, 188) +
        arrow(510, 188, 540, 188) +
        "</svg>";
      return svgShell(svg, "3D Quality Bench logic", ["import", "degrade", "pler", "batch", "norm", "mos", "ui"], "bench");
    },
    acoustic: function () {
      var svg =
        '<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Acoustic detailed logic">' +
        '<rect width="720" height="360" fill="#0c1118" rx="14"/>' +
        box("pos", 30, 40, 130, 56, "Positions", "7 presets") +
        box("pan", 190, 40, 130, 56, "Panning", "laws") +
        box("gen", 350, 40, 140, 56, "Generator", "48 kHz") +
        box("adsr", 520, 40, 140, 56, "ADSR", "envelope") +
        arrow(160, 68, 190, 68) +
        arrow(320, 68, 350, 68) +
        arrow(490, 68, 520, 68) +
        box("play", 190, 160, 140, 56, "Playback", "headphones") +
        box("viz", 360, 160, 140, 64, "Viz", "scope/spec") +
        box("session", 530, 160, 140, 56, "Session", "WAV out") +
        arrow(590, 96, 260, 160, "#38bdf8") +
        arrow(330, 188, 360, 188) +
        arrow(500, 188, 530, 188) +
        "</svg>";
      return svgShell(svg, "Localization tester logic", ["pos", "pan", "gen", "adsr", "play", "viz", "session"], "acoustic");
    },
  };

  document.querySelectorAll("[data-diagram]").forEach(function (el) {
    var kind = el.dataset.diagram;
    var build = builders[kind];
    if (!build) return;
    el.innerHTML = build();
    var shell = el.querySelector(".diagram-shell");
    wireTips(shell, kind);
    if (typeof io !== "undefined") io.observe(shell);
  });

  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = root.querySelectorAll(".carousel-slide");
    var cap = root.querySelector("[data-cap]");
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-dot]"));
    var captions = [];
    try {
      captions = JSON.parse(root.getAttribute("data-captions") || "[]");
    } catch (e) {}
    var i = 0;
    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = "translateX(" + -i * 100 + "%)";
      if (cap) {
        var img = slides[i].querySelector("img");
        cap.textContent = captions[i] || (img && img.alt) || "";
      }
      dots.forEach(function (d, di) {
        d.classList.toggle("active", di === i);
      });
    }
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    if (prev) prev.addEventListener("click", function () { go(i - 1); });
    if (next) next.addEventListener("click", function () { go(i + 1); });
    dots.forEach(function (d) {
      d.addEventListener("click", function () { go(+d.dataset.dot); });
    });
    var timer = setInterval(function () { go(i + 1); }, 5000);
    root.addEventListener("pointerenter", function () { clearInterval(timer); });
    root.addEventListener("pointerleave", function () {
      timer = setInterval(function () { go(i + 1); }, 5000);
    });
  });

  if (!touch && cursor) {
    document.querySelectorAll(".node, .carousel-btn, [data-dot]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("big"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("big"); });
    });
  }
})();
