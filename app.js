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
      sphere: ["Bounding sphere", "Reference and distorted meshes share one enclosing sphere; radius normalizes scale."],
      rays: ["Fibonacci rays", "Sample points on the sphere via golden spiral — PLER 2.0 fix for uneven coverage."],
      mesh: ["Mesh surface", "Ray hit lengths on reference vs test form an MSE mapped to the PLER score."],
      score: ["PLER score", "Log-scaled fidelity score — sensitive where low quality is perceptually important."],
    },
    rag: {
      docs: ["Documents", "PDF/MD packet-core docs are chunked with RecursiveCharacterTextSplitter."],
      embed: ["Embeddings", "all-MiniLM-L6-v2 vectors land in a local Chroma store."],
      chroma: ["Chroma", "Persistent local vector DB — no cloud round-trip after ingest."],
      llm: ["Qwen2.5:7B", "Ollama serves answers on-device; typical latency often 5–40s on NVIDIA."],
    },
    agents: {
      user: ["User task", "Kick off a multi-step research / coding request."],
      researcher: ["Researcher", "Retrieves context from papers via RAG."],
      engineer: ["Engineer", "Implements or drafts solutions with LLM + tools."],
      verifier: ["Verifier", "Checks claims and consistency before handoff."],
      writer: ["Methodology writer", "Produces the structured write-up."],
    },
    anc: {
      ref: ["Reference mic", "Captures primary noise for the adaptive filter."],
      filter: ["FxLMS filter", "Filtered-x LMS adapts cancellation with secondary-path model."],
      speaker: ["Anti-noise", "Loudspeaker emits the cancelling waveform."],
      error: ["Error mic", "Residual noise drives adaptation; latency dominates feasibility."],
      delay: ["Secondary path", "Bench IR peak ≈ 43.7 ms @ 48 kHz — physics, not marketing."],
    },
    bench: {
      degrade: ["Degradations", "Noise, smooth, decimate, hybrid — controllable mesh corruption."],
      metrics: ["20+ metrics", "PLER family + classic geometric distances in one UI."],
      mos: ["MOS correl.", "PLCC / SROCC / Kendall vs subjective scores."],
    },
    acoustic: {
      gen: ["Stimulus gen", "MLS, pink, narrowband, WAV at 48 kHz stereo."],
      ild: ["ILD / ITD", "Level and time cues for seven preset positions."],
      session: ["Session", "Build listening protocols, export WAV, view spectrograms."],
    },
  };

  function wireTips(root, kind) {
    const tip = root.querySelector(".diagram-tip");
    if (!tip) return;
    root.querySelectorAll(".node").forEach((n) => {
      const key = n.dataset.node;
      const info = tips[kind]?.[key];
      if (!info) return;
      const show = () => {
        root.querySelectorAll(".node").forEach((x) => x.classList.remove("active"));
        n.classList.add("active");
        tip.innerHTML = `<strong>${info[0]}</strong>${info[1]}`;
        tip.classList.add("show");
      };
      n.addEventListener("mouseenter", show);
      n.addEventListener("focus", show);
      n.addEventListener("click", show);
      n.setAttribute("tabindex", "0");
      n.setAttribute("role", "button");
      n.setAttribute("aria-label", info[0]);
    });
  }

  function svgShell(inner, caption) {
    return `<div class="diagram-shell reveal">
      <div class="diagram-tip" aria-live="polite">Hover or tap a node</div>
      ${inner}
      <div class="diagram-caption"><span>${caption}</span><span>Interactive · SVG</span></div>
    </div>`;
  }

  const builders = {
    pler() {
      return svgShell(`<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PLER interactive diagram">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#2dd4bf"/><stop offset="1" stop-color="#38bdf8"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="#0c1118" rx="12"/>
        <circle class="node" data-node="sphere" cx="260" cy="180" r="110" fill="none" stroke="url(#g1)" stroke-width="2" opacity=".9"/>
        <g stroke="#2dd4bf" stroke-opacity=".55">
          ${Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;const x=260+Math.cos(a)*110;const y=180+Math.sin(a)*110;return `<line class="flow-edge" x1="${x}" y1="${y}" x2="260" y2="180"/>`;}).join("")}
        </g>
        <circle class="node" data-node="rays" cx="370" cy="90" r="8" fill="#38bdf8"/>
        <text x="386" y="94" fill="#8b97a8" font-size="12" font-family="JetBrains Mono, monospace">Fibonacci samples</text>
        <polygon class="node" data-node="mesh" points="230,150 290,140 310,200 250,220" fill="#2dd4bf33" stroke="#2dd4bf" stroke-width="1.5"/>
        <rect class="node" data-node="score" x="430" y="145" width="150" height="70" rx="12" fill="#121925" stroke="#2dd4bf"/>
        <text x="450" y="175" fill="#eef3f8" font-size="14" font-family="Syne,sans-serif" font-weight="700">PLER score</text>
        <text x="450" y="196" fill="#8b97a8" font-size="11" font-family="JetBrains Mono, monospace">10 log (Lmin² / MSE)</text>
        <circle cx="260" cy="180" r="4" fill="#fff"/>
      </svg>`, "PLER 2.0 — sphere rays → MSE → log fidelity");
    },
    rag() {
      const boxes = [
        ["docs",40,"Docs"],["embed",180,"Embed"],["chroma",320,"Chroma"],["llm",460,"Qwen 7B"]
      ];
      return svgShell(`<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RAG pipeline">
        <rect width="640" height="240" fill="#0c1118" rx="12"/>
        ${boxes.map(([id,x,label],i)=>`
          <rect class="node" data-node="${id}" x="${x}" y="80" width="110" height="64" rx="14" fill="#121925" stroke="${i===3?"#38bdf8":"#2dd4bf"}" stroke-width="1.6"/>
          <text x="${x+55}" y="118" text-anchor="middle" fill="#eef3f8" font-size="14" font-family="Syne,sans-serif" font-weight="700">${label}</text>
          ${i<3?`<line class="flow-edge" x1="${x+110}" y1="112" x2="${boxes[i+1][1]}" y2="112" stroke="#2dd4bf" stroke-width="2"/>`:""}
        `).join("")}
        <text x="40" y="40" fill="#8b97a8" font-size="12" font-family="JetBrains Mono, monospace">Local RAG · no cloud after model pull</text>
      </svg>`, "Hover stages — LangChain + Chroma + Ollama");
    },
    agents() {
      const nodes = [
        ["user",80,120],["researcher",220,60],["engineer",220,180],["verifier",380,120],["writer",520,120]
      ];
      return svgShell(`<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI Team graph">
        <rect width="640" height="260" fill="#0c1118" rx="12"/>
        <line class="flow-edge" x1="120" y1="120" x2="180" y2="70" stroke="#38bdf8" stroke-width="1.5"/>
        <line class="flow-edge" x1="120" y1="120" x2="180" y2="170" stroke="#38bdf8" stroke-width="1.5"/>
        <line class="flow-edge" x1="260" y1="70" x2="340" y2="110" stroke="#2dd4bf" stroke-width="1.5"/>
        <line class="flow-edge" x1="260" y1="190" x2="340" y2="130" stroke="#2dd4bf" stroke-width="1.5"/>
        <line class="flow-edge" x1="420" y1="120" x2="480" y2="120" stroke="#2dd4bf" stroke-width="1.5"/>
        ${nodes.map(([id,x,y])=>`
          <circle class="node" data-node="${id}" cx="${x}" cy="${y}" r="28" fill="#121925" stroke="#2dd4bf" stroke-width="1.8"/>
          <text x="${x}" y="${y+4}" text-anchor="middle" fill="#eef3f8" font-size="10" font-family="JetBrains Mono, monospace">${id.slice(0,3)}</text>
        `).join("")}
      </svg>`, "LangGraph roles — click a node");
    },
    anc() {
      return svgShell(`<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="FxLMS ANC">
        <rect width="640" height="260" fill="#0c1118" rx="12"/>
        <rect class="node" data-node="ref" x="40" y="40" width="100" height="48" rx="12" fill="#121925" stroke="#38bdf8"/>
        <text x="90" y="70" text-anchor="middle" fill="#eef3f8" font-size="12" font-family="Syne,sans-serif">Ref mic</text>
        <rect class="node" data-node="filter" x="200" y="100" width="120" height="56" rx="12" fill="#121925" stroke="#2dd4bf"/>
        <text x="260" y="134" text-anchor="middle" fill="#eef3f8" font-size="13" font-family="Syne,sans-serif">FxLMS</text>
        <rect class="node" data-node="speaker" x="380" y="40" width="110" height="48" rx="12" fill="#121925" stroke="#2dd4bf"/>
        <text x="435" y="70" text-anchor="middle" fill="#eef3f8" font-size="12" font-family="Syne,sans-serif">Speaker</text>
        <rect class="node" data-node="error" x="380" y="170" width="110" height="48" rx="12" fill="#121925" stroke="#fb923c"/>
        <text x="435" y="200" text-anchor="middle" fill="#eef3f8" font-size="12" font-family="Syne,sans-serif">Error mic</text>
        <rect class="node" data-node="delay" x="520" y="100" width="90" height="56" rx="12" fill="#121925" stroke="#38bdf8"/>
        <text x="565" y="125" text-anchor="middle" fill="#eef3f8" font-size="11" font-family="JetBrains Mono, monospace">43.7ms</text>
        <text x="565" y="142" text-anchor="middle" fill="#8b97a8" font-size="10" font-family="JetBrains Mono, monospace">@48kHz</text>
        <line class="flow-edge" x1="140" y1="64" x2="200" y2="120" stroke="#38bdf8" stroke-width="1.5"/>
        <line class="flow-edge" x1="320" y1="120" x2="380" y2="64" stroke="#2dd4bf" stroke-width="1.5"/>
        <line class="flow-edge" x1="435" y1="88" x2="435" y2="170" stroke="#fb923c" stroke-width="1.5"/>
        <line class="flow-edge" x1="490" y1="194" x2="320" y2="145" stroke="#fb923c" stroke-width="1.5"/>
        <line class="flow-edge" x1="320" y1="128" x2="520" y2="128" stroke="#38bdf8" stroke-width="1.5"/>
      </svg>`, "FxLMS loop with measured secondary-path delay");
    },
    bench() {
      return svgShell(`<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="3D Quality Bench">
        <rect width="640" height="240" fill="#0c1118" rx="12"/>
        <rect class="node" data-node="degrade" x="50" y="70" width="140" height="100" rx="16" fill="#121925" stroke="#2dd4bf"/>
        <text x="120" y="120" text-anchor="middle" fill="#eef3f8" font-size="14" font-family="Syne,sans-serif" font-weight="700">Degrade</text>
        <text x="120" y="142" text-anchor="middle" fill="#8b97a8" font-size="11" font-family="JetBrains Mono, monospace">noise·LOD</text>
        <rect class="node" data-node="metrics" x="250" y="70" width="140" height="100" rx="16" fill="#121925" stroke="#38bdf8"/>
        <text x="320" y="120" text-anchor="middle" fill="#eef3f8" font-size="14" font-family="Syne,sans-serif" font-weight="700">Metrics</text>
        <text x="320" y="142" text-anchor="middle" fill="#8b97a8" font-size="11" font-family="JetBrains Mono, monospace">20+</text>
        <rect class="node" data-node="mos" x="450" y="70" width="140" height="100" rx="16" fill="#121925" stroke="#2dd4bf"/>
        <text x="520" y="120" text-anchor="middle" fill="#eef3f8" font-size="14" font-family="Syne,sans-serif" font-weight="700">vs MOS</text>
        <text x="520" y="142" text-anchor="middle" fill="#8b97a8" font-size="11" font-family="JetBrains Mono, monospace">PLCC</text>
        <line class="flow-edge" x1="190" y1="120" x2="250" y2="120" stroke="#2dd4bf" stroke-width="2"/>
        <line class="flow-edge" x1="390" y1="120" x2="450" y2="120" stroke="#38bdf8" stroke-width="2"/>
      </svg>`, "Streamlit research loop");
    },
    acoustic() {
      return svgShell(`<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Acoustic localization">
        <rect width="640" height="240" fill="#0c1118" rx="12"/>
        <rect class="node" data-node="gen" x="40" y="80" width="130" height="70" rx="14" fill="#121925" stroke="#2dd4bf"/>
        <text x="105" y="122" text-anchor="middle" fill="#eef3f8" font-size="13" font-family="Syne,sans-serif">Generator</text>
        <rect class="node" data-node="ild" x="230" y="50" width="180" height="130" rx="16" fill="#121925" stroke="#38bdf8"/>
        <text x="320" y="100" text-anchor="middle" fill="#eef3f8" font-size="14" font-family="Syne,sans-serif" font-weight="700">ILD / ITD</text>
        <text x="320" y="124" text-anchor="middle" fill="#8b97a8" font-size="11" font-family="JetBrains Mono, monospace">7 positions · 48 kHz</text>
        <path d="M250 150 Q320 170 390 150" fill="none" stroke="#2dd4bf" stroke-width="2"/>
        <rect class="node" data-node="session" x="460" y="80" width="140" height="70" rx="14" fill="#121925" stroke="#2dd4bf"/>
        <text x="530" y="122" text-anchor="middle" fill="#eef3f8" font-size="13" font-family="Syne,sans-serif">Session</text>
        <line class="flow-edge" x1="170" y1="115" x2="230" y2="115" stroke="#2dd4bf" stroke-width="2"/>
        <line class="flow-edge" x1="410" y1="115" x2="460" y2="115" stroke="#38bdf8" stroke-width="2"/>
      </svg>`, "PyQt6 localization tester");
    },
  };

  document.querySelectorAll("[data-diagram]").forEach((el) => {
    const kind = el.dataset.diagram;
    const build = builders[kind];
    if (!build) return;
    el.innerHTML = build();
    const shell = el.querySelector(".diagram-shell");
    wireTips(shell, kind);
    io.observe(shell);
  });
})();