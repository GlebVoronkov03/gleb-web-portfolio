(() => {
  const STORAGE_LANG = "gv-lang";
  const STORAGE_THEME = "gv-theme";
  const langs = ["en", "de", "ru", "es", "it", "zh"];
  const langLabels = { en: "EN", de: "DE", ru: "RU", es: "ES", it: "IT", zh: "中文" };

  const dict = {
    en: {
      "nav.home": "Home",
      "nav.work": "Work",
      "nav.pubs": "Publications",
      "nav.about": "About",
      "nav.cv": "CV",
      "home.eyebrow": "ML Engineer · R&D · Moscow",
      "home.h1": "Systems that ship — with physics and papers attached",
      "home.lead": "Local RAG products, PLER 2.0 geometric fidelity, virtual production, and acoustic DSP. Move the sphere. Click every diagram.",
      "home.ctaWork": "Explore work",
      "home.ctaPubs": "Papers & PDFs",
      "home.hint": "Drag · Fibonacci sphere · PLER rays",
      "home.m1": "MAPE · core-network 7-day forecast",
      "home.m2": "Fibonacci-sphere geometric fidelity",
      "home.m3": "secondary-path IR peak @ 48 kHz",
      "home.kicker": "Selected work",
      "home.title": "Interactive case studies",
      "home.sub": "Filter by domain. Each project page has a live SVG scheme — not a static PNG.",
      "filter.all": "All",
      "filter.3d": "3D / CV",
      "filter.llm": "LLM",
      "filter.audio": "Audio",
      "card.pler": "Geometric fidelity with interactive ray diagram",
      "card.rag": "Local Qwen pipeline you can step through",
      "card.anc": "Live cancellation loop + measured delay",
      "card.agents": "Clickable LangGraph role graph",
      "card.bench": "Degrade → metrics → MOS",
      "card.acoustic": "ILD/ITD stimulus lab",
      "work.kicker": "Work",
      "work.h1": "All projects",
      "work.tag": "Live diagrams on every case study page.",
      "pubs.kicker": "Publications & IP",
      "pubs.h1": "Papers & certificates",
      "pubs.tag": "Abstracts from the manuscripts — PDFs hosted on this site. Filter by venue.",
      "pubs.all": "All",
      "pubs.scopus": "Scopus",
      "pubs.rsci": "RSCI",
      "pubs.ip": "IP",
      "pubs.paper": "Paper",
      "about.kicker": "About",
      "about.h1": "Between lab and product",
      "about.tag": "MTUCI R&D · Telcore · Beeline — claims tied to measurements and papers.",
      "about.p1": "Master’s student at MTUCI, Research Department “Digital Television and Video-informatics”. I build local RAG systems, original 3D quality metrics (PLER 2.0), and acoustic DSP labs — then publish the evidence.",
      "about.p2": "ARTCam / CaT-3D: virtual-production and motion-capture tooling in Unreal Engine. Software registration № 2024682445 (Rospatent, 23 Sep 2024).",
      "about.exp": "Experience",
      "about.contact": "Contact",
      "about.cv": "Download CV",
      "about.cert": "CaT-3D · Rospatent № 2024682445 (EN: video-to-anthropomorphic motion capture registration)",
      "about.still": "ARTCam / virtual-production still from the portfolio cover set",
      "proj.logic": "Logic",
      "proj.how": "How it works",
      "proj.howSub": "Play the pipeline or hover stages — tip, legend, and edges stay in sync.",
      "proj.desc": "Description",
      "proj.narrative": "Project narrative",
      "proj.action": "In action",
      "proj.carousel": "Screenshot carousel",
      "proj.demo": "Demo",
      "proj.walk": "Short walkthrough",
      "proj.under30": "under 30s",
      "proj.real": "Real app capture",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "lang.label": "Language",
    },
    de: {
      "nav.home": "Start",
      "nav.work": "Projekte",
      "nav.pubs": "Publikationen",
      "nav.about": "Über mich",
      "nav.cv": "CV",
      "home.eyebrow": "ML-Ingenieur · F&E · Moskau",
      "home.h1": "Systeme, die liefern — mit Physik und Papers",
      "home.lead": "Lokale RAG-Produkte, PLER 2.0 geometrische Treue, Virtual Production und akustisches DSP. Beweg die Sphäre. Klicke jedes Diagramm.",
      "home.ctaWork": "Projekte erkunden",
      "home.ctaPubs": "Papers & PDFs",
      "home.hint": "Ziehen · Fibonacci-Sphäre · PLER-Strahlen",
      "home.m1": "MAPE · Kernnetz 7-Tage-Prognose",
      "home.m2": "Geometrische Treue mit Fibonacci-Sphäre",
      "home.m3": "Sekundärpfad-IR-Peak @ 48 kHz",
      "home.kicker": "Ausgewählte Arbeiten",
      "home.title": "Interaktive Fallstudien",
      "home.sub": "Nach Domäne filtern. Jede Projektseite hat ein live SVG-Schema.",
      "filter.all": "Alle",
      "filter.3d": "3D / CV",
      "filter.llm": "LLM",
      "filter.audio": "Audio",
      "card.pler": "Geometrische Treue mit interaktivem Strahlendiagramm",
      "card.rag": "Lokale Qwen-Pipeline zum Durchklicken",
      "card.anc": "Live-Löschschleife + gemessene Verzögerung",
      "card.agents": "Klickbarer LangGraph-Rollengraph",
      "card.bench": "Degradieren → Metriken → MOS",
      "card.acoustic": "ILD/ITD-Stimulus-Labor",
      "work.kicker": "Projekte",
      "work.h1": "Alle Projekte",
      "work.tag": "Live-Diagramme auf jeder Fallstudie.",
      "pubs.kicker": "Publikationen & IP",
      "pubs.h1": "Papers & Zertifikate",
      "pubs.tag": "Abstracts aus den Manuskripten — PDFs auf dieser Site. Nach Venue filtern.",
      "pubs.all": "Alle",
      "pubs.scopus": "Scopus",
      "pubs.rsci": "RSCI",
      "pubs.ip": "IP",
      "pubs.paper": "Paper",
      "about.kicker": "Über mich",
      "about.h1": "Zwischen Labor und Produkt",
      "about.tag": "MTUCI F&E · Telcore · Beeline — Aussagen mit Messungen und Papers.",
      "about.p1": "Masterstudent an der MTUCI, Forschungsabteilung „Digitales Fernsehen und Videoinformatik“. Ich baue lokale RAG-Systeme, originale 3D-Qualitätsmetriken (PLER 2.0) und akustische DSP-Labore — und veröffentliche die Belege.",
      "about.p2": "ARTCam / CaT-3D: Virtual-Production- und Motion-Capture-Tools in Unreal Engine. Softwareregistrierung № 2024682445 (Rospatent, 23. Sep 2024).",
      "about.exp": "Erfahrung",
      "about.contact": "Kontakt",
      "about.cv": "CV herunterladen",
      "about.cert": "CaT-3D · Rospatent № 2024682445 (Video-zu-anthropomorphes Motion Capture)",
      "about.still": "ARTCam / Virtual-Production-Still aus dem Portfolio-Cover",
      "proj.logic": "Logik",
      "proj.how": "So funktioniert es",
      "proj.howSub": "Pipeline abspielen oder Stufen hovern — Tip, Legende und Kanten bleiben synchron.",
      "proj.desc": "Beschreibung",
      "proj.narrative": "Projektnarrative",
      "proj.action": "In Aktion",
      "proj.carousel": "Screenshot-Karussell",
      "proj.demo": "Demo",
      "proj.walk": "Kurzer Rundgang",
      "proj.under30": "unter 30s",
      "proj.real": "Echte App-Aufnahme",
      "theme.light": "Hell",
      "theme.dark": "Dunkel",
      "lang.label": "Sprache",
    },
    ru: {
      "nav.home": "Главная",
      "nav.work": "Проекты",
      "nav.pubs": "Публикации",
      "nav.about": "Обо мне",
      "nav.cv": "CV",
      "home.eyebrow": "ML-инженер · НИР · Москва",
      "home.h1": "Системы, которые доходят до продакшена — с физикой и статьями",
      "home.lead": "Локальные RAG-продукты, геометрическая точность PLER 2.0, virtual production и акустический DSP. Двигайте сферу. Нажимайте каждую схему.",
      "home.ctaWork": "Смотреть работы",
      "home.ctaPubs": "Статьи и PDF",
      "home.hint": "Тяните · сфера Фибоначчи · лучи PLER",
      "home.m1": "MAPE · прогноз ядра сети на 7 дней",
      "home.m2": "Геометрическая точность со сферой Фибоначчи",
      "home.m3": "пик ИХ вторичного пути @ 48 кГц",
      "home.kicker": "Избранные работы",
      "home.title": "Интерактивные кейсы",
      "home.sub": "Фильтр по домену. На каждой странице — живая SVG-схема.",
      "filter.all": "Все",
      "filter.3d": "3D / CV",
      "filter.llm": "LLM",
      "filter.audio": "Аудио",
      "card.pler": "Геометрическая точность с интерактивной лучевой схемой",
      "card.rag": "Локальный конвейер Qwen по шагам",
      "card.anc": "Живой контур подавления + измеренная задержка",
      "card.agents": "Кликабельный граф ролей LangGraph",
      "card.bench": "Деградация → метрики → MOS",
      "card.acoustic": "Лаборатория стимулов ILD/ITD",
      "work.kicker": "Проекты",
      "work.h1": "Все проекты",
      "work.tag": "Живые схемы на каждой странице кейса.",
      "pubs.kicker": "Публикации и IP",
      "pubs.h1": "Статьи и свидетельства",
      "pubs.tag": "Аннотации из рукописей — PDF на этом сайте. Фильтр по площадке.",
      "pubs.all": "Все",
      "pubs.scopus": "Scopus",
      "pubs.rsci": "РИНЦ",
      "pubs.ip": "IP",
      "pubs.paper": "Статья",
      "about.kicker": "Обо мне",
      "about.h1": "Между лабораторией и продуктом",
      "about.tag": "НИР МТУСИ · Telcore · Билайн — утверждения с измерениями и статьями.",
      "about.p1": "Магистрант МТУСИ, НИО «Цифровое телевидение и видеоинформатика». Строю локальные RAG-системы, оригинальные метрики качества 3D (PLER 2.0) и акустические DSP-лаборатории — и публикую доказательства.",
      "about.p2": "ARTCam / CaT-3D: инструменты virtual production и motion capture в Unreal Engine. Свидетельство № 2024682445 (Роспатент, 23 сен 2024).",
      "about.exp": "Опыт",
      "about.contact": "Контакты",
      "about.cv": "Скачать CV",
      "about.cert": "CaT-3D · Роспатент № 2024682445 (захват движения с видео на антропоморфную модель)",
      "about.still": "Кадр ARTCam / virtual production из обложки портфолио",
      "proj.logic": "Логика",
      "proj.how": "Как это работает",
      "proj.howSub": "Проиграйте пайплайн или наведите на этапы — подсказка, легенда и рёбра синхронизированы.",
      "proj.desc": "Описание",
      "proj.narrative": "Описание проекта",
      "proj.action": "В деле",
      "proj.carousel": "Карусель скриншотов",
      "proj.demo": "Демо",
      "proj.walk": "Короткий обзор",
      "proj.under30": "до 30 с",
      "proj.real": "Запись реального приложения",
      "theme.light": "Светлая",
      "theme.dark": "Тёмная",
      "lang.label": "Язык",
    },
    es: {
      "nav.home": "Inicio",
      "nav.work": "Proyectos",
      "nav.pubs": "Publicaciones",
      "nav.about": "Sobre mí",
      "nav.cv": "CV",
      "home.eyebrow": "Ingeniero ML · I+D · Moscú",
      "home.h1": "Sistemas que llegan a producción — con física y papers",
      "home.lead": "Productos RAG locales, fidelidad geométrica PLER 2.0, producción virtual y DSP acústico. Mueve la esfera. Haz clic en cada diagrama.",
      "home.ctaWork": "Ver trabajos",
      "home.ctaPubs": "Papers y PDF",
      "home.hint": "Arrastra · esfera Fibonacci · rayos PLER",
      "home.m1": "MAPE · pronóstico de red core a 7 días",
      "home.m2": "Fidelidad geométrica con esfera Fibonacci",
      "home.m3": "pico IR de ruta secundaria @ 48 kHz",
      "home.kicker": "Trabajos seleccionados",
      "home.title": "Casos interactivos",
      "home.sub": "Filtra por dominio. Cada página tiene un esquema SVG en vivo.",
      "filter.all": "Todos",
      "filter.3d": "3D / CV",
      "filter.llm": "LLM",
      "filter.audio": "Audio",
      "card.pler": "Fidelidad geométrica con diagrama de rayos interactivo",
      "card.rag": "Pipeline Qwen local paso a paso",
      "card.anc": "Bucle de cancelación en vivo + retardo medido",
      "card.agents": "Grafo de roles LangGraph clicable",
      "card.bench": "Degradar → métricas → MOS",
      "card.acoustic": "Lab de estímulos ILD/ITD",
      "work.kicker": "Proyectos",
      "work.h1": "Todos los proyectos",
      "work.tag": "Diagramas en vivo en cada caso.",
      "pubs.kicker": "Publicaciones e IP",
      "pubs.h1": "Papers y certificados",
      "pubs.tag": "Resúmenes de los manuscritos — PDF en este sitio. Filtra por venue.",
      "pubs.all": "Todos",
      "pubs.scopus": "Scopus",
      "pubs.rsci": "RSCI",
      "pubs.ip": "IP",
      "pubs.paper": "Paper",
      "about.kicker": "Sobre mí",
      "about.h1": "Entre el laboratorio y el producto",
      "about.tag": "I+D MTUCI · Telcore · Beeline — afirmaciones con mediciones y papers.",
      "about.p1": "Estudiante de máster en MTUCI, Departamento de Investigación “Televisión digital y videoinformática”. Construyo sistemas RAG locales, métricas originales de calidad 3D (PLER 2.0) y laboratorios DSP acústicos — y publico la evidencia.",
      "about.p2": "ARTCam / CaT-3D: herramientas de producción virtual y motion capture en Unreal Engine. Registro de software № 2024682445 (Rospatent, 23 sep 2024).",
      "about.exp": "Experiencia",
      "about.contact": "Contacto",
      "about.cv": "Descargar CV",
      "about.cert": "CaT-3D · Rospatent № 2024682445 (captura de movimiento vídeo→antropomorfo)",
      "about.still": "Still ARTCam / producción virtual de la portada del portfolio",
      "proj.logic": "Lógica",
      "proj.how": "Cómo funciona",
      "proj.howSub": "Reproduce el pipeline o pasa el cursor — tip, leyenda y aristas se sincronizan.",
      "proj.desc": "Descripción",
      "proj.narrative": "Narrativa del proyecto",
      "proj.action": "En acción",
      "proj.carousel": "Carrusel de capturas",
      "proj.demo": "Demo",
      "proj.walk": "Recorrido corto",
      "proj.under30": "menos de 30s",
      "proj.real": "Captura de app real",
      "theme.light": "Claro",
      "theme.dark": "Oscuro",
      "lang.label": "Idioma",
    },
    it: {
      "nav.home": "Home",
      "nav.work": "Progetti",
      "nav.pubs": "Pubblicazioni",
      "nav.about": "Chi sono",
      "nav.cv": "CV",
      "home.eyebrow": "Ingegnere ML · R&S · Mosca",
      "home.h1": "Sistemi che arrivano in produzione — con fisica e paper",
      "home.lead": "Prodotti RAG locali, fedeltà geometrica PLER 2.0, virtual production e DSP acustico. Muovi la sfera. Clicca ogni diagramma.",
      "home.ctaWork": "Esplora i lavori",
      "home.ctaPubs": "Paper e PDF",
      "home.hint": "Trascina · sfera di Fibonacci · raggi PLER",
      "home.m1": "MAPE · forecast rete core a 7 giorni",
      "home.m2": "Fedeltà geometrica con sfera di Fibonacci",
      "home.m3": "picco IR del percorso secondario @ 48 kHz",
      "home.kicker": "Lavori selezionati",
      "home.title": "Casi interattivi",
      "home.sub": "Filtra per dominio. Ogni pagina ha uno schema SVG live.",
      "filter.all": "Tutti",
      "filter.3d": "3D / CV",
      "filter.llm": "LLM",
      "filter.audio": "Audio",
      "card.pler": "Fedeltà geometrica con diagramma a raggi interattivo",
      "card.rag": "Pipeline Qwen locale passo per passo",
      "card.anc": "Loop di cancellazione live + ritardo misurato",
      "card.agents": "Grafo ruoli LangGraph cliccabile",
      "card.bench": "Degrada → metriche → MOS",
      "card.acoustic": "Lab stimoli ILD/ITD",
      "work.kicker": "Progetti",
      "work.h1": "Tutti i progetti",
      "work.tag": "Diagrammi live su ogni caso studio.",
      "pubs.kicker": "Pubblicazioni e IP",
      "pubs.h1": "Paper e certificati",
      "pubs.tag": "Abstract dai manoscritti — PDF su questo sito. Filtra per venue.",
      "pubs.all": "Tutti",
      "pubs.scopus": "Scopus",
      "pubs.rsci": "RSCI",
      "pubs.ip": "IP",
      "pubs.paper": "Paper",
      "about.kicker": "Chi sono",
      "about.h1": "Tra laboratorio e prodotto",
      "about.tag": "R&S MTUCI · Telcore · Beeline — claim legati a misure e paper.",
      "about.p1": "Studente magistrale al MTUCI, Dipartimento di ricerca “Televisione digitale e videoinformatica”. Costruisco sistemi RAG locali, metriche originali di qualità 3D (PLER 2.0) e laboratori DSP acustici — poi pubblico le prove.",
      "about.p2": "ARTCam / CaT-3D: tooling di virtual production e motion capture in Unreal Engine. Registrazione software № 2024682445 (Rospatent, 23 set 2024).",
      "about.exp": "Esperienza",
      "about.contact": "Contatti",
      "about.cv": "Scarica CV",
      "about.cert": "CaT-3D · Rospatent № 2024682445 (motion capture video→antropomorfo)",
      "about.still": "Still ARTCam / virtual production dalla cover del portfolio",
      "proj.logic": "Logica",
      "proj.how": "Come funziona",
      "proj.howSub": "Riproduci la pipeline o passa il mouse — tip, legenda e archi restano sincronizzati.",
      "proj.desc": "Descrizione",
      "proj.narrative": "Narrativa del progetto",
      "proj.action": "In azione",
      "proj.carousel": "Carosello screenshot",
      "proj.demo": "Demo",
      "proj.walk": "Breve walkthrough",
      "proj.under30": "sotto i 30s",
      "proj.real": "Cattura app reale",
      "theme.light": "Chiaro",
      "theme.dark": "Scuro",
      "lang.label": "Lingua",
    },
    zh: {
      "nav.home": "首页",
      "nav.work": "项目",
      "nav.pubs": "论文",
      "nav.about": "关于",
      "nav.cv": "简历",
      "home.eyebrow": "机器学习工程师 · 研发 · 莫斯科",
      "home.h1": "能落地的系统——附带物理与论文",
      "home.lead": "本地 RAG 产品、PLER 2.0 几何保真、虚拟制作与声学 DSP。拖动球体，点击每张逻辑图。",
      "home.ctaWork": "浏览项目",
      "home.ctaPubs": "论文与 PDF",
      "home.hint": "拖动 · 斐波那契球面 · PLER 射线",
      "home.m1": "MAPE · 核心网 7 日预测",
      "home.m2": "斐波那契球面几何保真",
      "home.m3": "次级路径 IR 峰值 @ 48 kHz",
      "home.kicker": "精选工作",
      "home.title": "交互式案例",
      "home.sub": "按领域筛选。每个项目页都有实时 SVG 逻辑图。",
      "filter.all": "全部",
      "filter.3d": "3D / 视觉",
      "filter.llm": "大模型",
      "filter.audio": "音频",
      "card.pler": "带交互射线图的几何保真",
      "card.rag": "可逐步体验的本地 Qwen 流水线",
      "card.anc": "实时消噪环路 + 实测时延",
      "card.agents": "可点击的 LangGraph 角色图",
      "card.bench": "退化 → 指标 → MOS",
      "card.acoustic": "ILD/ITD 刺激实验室",
      "work.kicker": "项目",
      "work.h1": "全部项目",
      "work.tag": "每个案例页都有实时逻辑图。",
      "pubs.kicker": "论文与知识产权",
      "pubs.h1": "论文与证书",
      "pubs.tag": "来自手稿的摘要——本站托管 PDF。按发表类型筛选。",
      "pubs.all": "全部",
      "pubs.scopus": "Scopus",
      "pubs.rsci": "RSCI",
      "pubs.ip": "知识产权",
      "pubs.paper": "论文",
      "about.kicker": "关于",
      "about.h1": "在实验室与产品之间",
      "about.tag": "MTUCI 研发 · Telcore · Beeline——结论基于测量与论文。",
      "about.p1": "莫斯科通信与信息科技大学（MTUCI）硕士生，数字电视与视频信息学研究部。我构建本地 RAG、原创 3D 质量指标（PLER 2.0）与声学 DSP 实验，并公开发布证据。",
      "about.p2": "ARTCam / CaT-3D：Unreal Engine 中的虚拟制作与动作捕捉工具。软件登记 № 2024682445（俄罗斯专利局，2024-09-23）。",
      "about.exp": "经历",
      "about.contact": "联系",
      "about.cv": "下载简历",
      "about.cert": "CaT-3D · 俄罗斯专利局 № 2024682445（视频到拟人模型动作捕捉）",
      "about.still": "作品集封面中的 ARTCam / 虚拟制作静帧",
      "proj.logic": "逻辑",
      "proj.how": "工作原理",
      "proj.howSub": "播放流水线或悬停阶段——提示、图例与边保持同步。",
      "proj.desc": "描述",
      "proj.narrative": "项目叙事",
      "proj.action": "实机界面",
      "proj.carousel": "截图轮播",
      "proj.demo": "演示",
      "proj.walk": "短演示",
      "proj.under30": "30 秒内",
      "proj.real": "真实应用录制",
      "theme.light": "浅色",
      "theme.dark": "深色",
      "lang.label": "语言",
    },
  };

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved && dict[saved]) return saved;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (nav === "zh") return "zh";
    return dict[nav] ? nav : "en";
  }

  function detectTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved === "light" || saved === "dark") return saved;
    return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      const key = theme === "dark" ? "theme.light" : "theme.dark";
      const lang = document.documentElement.getAttribute("lang") || "en";
      btn.textContent = (dict[lang] && dict[lang][key]) || (theme === "dark" ? "Light" : "Dark");
      btn.setAttribute("aria-label", btn.textContent);
    }
  }

  function t(lang, key) {
    return (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || key;
  }

  function applyLang(lang) {
    if (!dict[lang]) lang = "en";
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : lang);
    localStorage.setItem(STORAGE_LANG, lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(lang, key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.placeholder = val;
      else el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(lang, el.getAttribute("data-i18n-html"));
    });
    const sel = document.querySelector("[data-lang-select]");
    if (sel) sel.value = lang;
    // refresh theme button label in new language
    applyTheme(document.documentElement.getAttribute("data-theme") || detectTheme());
  }

  function injectControls() {
    const links = document.querySelector(".nav-links");
    if (!links || links.querySelector(".chrome-controls")) return;
    const wrap = document.createElement("div");
    wrap.className = "chrome-controls";
    wrap.innerHTML =
      '<label class="lang-wrap"><span class="sr-only" data-i18n="lang.label">Language</span>' +
      '<select data-lang-select aria-label="Language">' +
      langs.map((l) => '<option value="' + l + '">' + langLabels[l] + "</option>").join("") +
      "</select></label>" +
      '<button type="button" class="theme-toggle" data-theme-toggle aria-label="Theme">Dark</button>';
    links.appendChild(wrap);
    wrap.querySelector("[data-lang-select]").addEventListener("change", (e) => applyLang(e.target.value));
    wrap.querySelector("[data-theme-toggle]").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(cur === "dark" ? "light" : "dark");
    });
  }

  // Apply theme ASAP to avoid flash (also set in inline head script if present)
  const theme = detectTheme();
  document.documentElement.setAttribute("data-theme", theme);

  const boot = () => {
    injectControls();
    applyTheme(theme);
    applyLang(detectLang());
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.GV_I18N = { applyLang, applyTheme, dict, t };
})();
