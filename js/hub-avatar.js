/**
 * Hub avatar renderer, shop catalog, and inventory defaults (profile + nav).
 */
(function () {
  const DEFAULT_INVENTORY = {
    base: ["#8b5cf6", "#ef4444", "#10b981", "#f59e0b", "#3b82f6"],
    mouth: ["smile", "flat", "surprised"],
    hat: ["none"],
    accessory: ["none"],
    nameColor: ["inherit"],
    glow: ["none"],
    nameEffect: ["none"],
  };

  const MOUTH_PATHS = {
    smile: "M40 65 Q50 75 60 65",
    flat: "M40 65 L60 65",
    surprised: "M45 70 A5 5 0 1 1 55 70 A5 5 0 1 1 45 70",
    cool: "M40 70 Q50 75 60 70",
    sleepy: "M45 68 Q50 72 55 68",
    grin: "M36 64 Q50 80 64 64",
    wink: "M40 65 Q50 74 60 65",
    tongue: "M42 66 Q50 78 58 66",
    laugh: "M42 68 Q50 76 58 68",
  };

  const HAT_LABELS = {
    none: "None",
    cap: "Cap",
    crown: "Crown",
    wizard: "Wizard",
    tophat: "Top Hat",
    beanie: "Beanie",
    headphones: "Headphones",
    halo: "Halo",
    horns: "Horns",
  };

  const MOUTH_LABELS = {
    smile: "Happy",
    flat: "Neutral",
    surprised: "O-O",
    cool: "Cool",
    sleepy: "Sleepy",
    grin: "Grin",
    wink: "Wink",
    tongue: "Silly",
    laugh: "Laugh",
  };

  const GLOW_LABELS = {
    none: "None",
    "glow-violet": "Violet",
    "glow-emerald": "Emerald",
    "glow-pulse": "Pulse",
    "glow-cyan": "Cyan",
    "glow-rose": "Rose",
    "glow-gold": "Gold",
    "glow-rainbow": "Rainbow",
  };

  const ACCESSORY_LABELS = { none: "None", blush: "Blush", freckles: "Freckles", stars: "Star Eyes" };

  const NAME_EFFECT_LABELS = { none: "None", shimmer: "Shimmer", outline: "Outline" };

  /** @type {{ type: string, value: string, price: number, label: string, category: string }[]} */
  const SHOP_ITEMS = [
    { category: "Colors", type: "base", value: "#f43f5e", price: 50, label: "Rose Red" },
    { category: "Colors", type: "base", value: "#0ea5e9", price: 50, label: "Sky Blue" },
    { category: "Colors", type: "base", value: "#d946ef", price: 50, label: "Magenta" },
    { category: "Colors", type: "base", value: "#84cc16", price: 60, label: "Lime" },
    { category: "Colors", type: "base", value: "#fb718b", price: 60, label: "Coral" },
    { category: "Colors", type: "base", value: "#312e81", price: 75, label: "Midnight" },
    { category: "Face", type: "mouth", value: "cool", price: 100, label: "Cool" },
    { category: "Face", type: "mouth", value: "sleepy", price: 100, label: "Sleepy" },
    { category: "Face", type: "mouth", value: "grin", price: 120, label: "Big Grin" },
    { category: "Face", type: "mouth", value: "wink", price: 120, label: "Wink" },
    { category: "Face", type: "mouth", value: "tongue", price: 140, label: "Silly" },
    { category: "Face", type: "mouth", value: "laugh", price: 150, label: "Laugh" },
    { category: "Hats", type: "hat", value: "cap", price: 75, label: "Cap" },
    { category: "Hats", type: "hat", value: "crown", price: 150, label: "Crown" },
    { category: "Hats", type: "hat", value: "wizard", price: 150, label: "Wizard" },
    { category: "Hats", type: "hat", value: "tophat", price: 100, label: "Top Hat" },
    { category: "Hats", type: "hat", value: "beanie", price: 90, label: "Beanie" },
    { category: "Hats", type: "hat", value: "headphones", price: 110, label: "Headphones" },
    { category: "Hats", type: "hat", value: "halo", price: 200, label: "Halo" },
    { category: "Hats", type: "hat", value: "horns", price: 175, label: "Horns" },
    { category: "Extras", type: "accessory", value: "blush", price: 80, label: "Blush" },
    { category: "Extras", type: "accessory", value: "freckles", price: 90, label: "Freckles" },
    { category: "Extras", type: "accessory", value: "stars", price: 180, label: "Star Eyes" },
    { category: "Name", type: "nameColor", value: "#818cf8", price: 200, label: "Indigo" },
    { category: "Name", type: "nameColor", value: "#f43f5e", price: 200, label: "Rose" },
    { category: "Name", type: "nameColor", value: "#22d3ee", price: 220, label: "Cyan" },
    { category: "Name", type: "nameColor", value: "#fbbf24", price: 220, label: "Gold" },
    { category: "Name", type: "nameColor", value: "#a78bfa", price: 250, label: "Lavender" },
    { category: "Name", type: "nameEffect", value: "shimmer", price: 350, label: "Shimmer" },
    { category: "Name", type: "nameEffect", value: "outline", price: 400, label: "Outline" },
    { category: "Glow", type: "glow", value: "glow-violet", price: 500, label: "Violet Glow" },
    { category: "Glow", type: "glow", value: "glow-emerald", price: 500, label: "Emerald Glow" },
    { category: "Glow", type: "glow", value: "glow-cyan", price: 550, label: "Cyan Glow" },
    { category: "Glow", type: "glow", value: "glow-rose", price: 550, label: "Rose Glow" },
    { category: "Glow", type: "glow", value: "glow-gold", price: 600, label: "Gold Glow" },
    { category: "Glow", type: "glow", value: "glow-pulse", price: 750, label: "Pulse Glow" },
    { category: "Glow", type: "glow", value: "glow-rainbow", price: 900, label: "Rainbow Glow" },
  ];

  function normalizeConfig(config) {
    const c = config || {};
    return {
      base: c.base || "#8b5cf6",
      mouth: c.mouth || "smile",
      hat: c.hat || "none",
      accessory: c.accessory || "none",
      nameColor: c.nameColor || "inherit",
      glow: c.glow || "none",
      nameEffect: c.nameEffect || "none",
    };
  }

  function buildEyes(config) {
    if (config.accessory === "stars") {
      return `
        <g class="star-eyes">
          <polygon points="40,38 41.5,42 46,42 42.5,44.5 44,49 40,46.5 36,49 37.5,44.5 34,42 38.5,42" fill="#fef08a" stroke="#eab308" stroke-width="0.4"/>
          <polygon points="60,38 61.5,42 66,42 62.5,44.5 64,49 60,46.5 56,49 57.5,44.5 54,42 58.5,42" fill="#fef08a" stroke="#eab308" stroke-width="0.4"/>
        </g>`;
    }
    if (config.mouth === "cool") {
      return `
        <g class="sunglasses">
          <path d="M25 40 L45 40 L48 48 L28 48 Z" fill="#111" />
          <path d="M52 40 L72 40 L75 48 L55 48 Z" fill="#111" />
          <path d="M45 42 L55 42" stroke="#111" stroke-width="2" />
          <path d="M28 42 L35 42" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
          <path d="M55 42 L62 42" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
        </g>`;
    }
    if (config.mouth === "sleepy") {
      return `
        <g class="sleepy-eyes">
          <path d="M35 45 Q40 48 45 45" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="2" stroke-linecap="round" />
          <path d="M55 45 Q60 48 65 45" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="2" stroke-linecap="round" />
          <text x="72" y="34" font-size="7" fill="rgba(255,255,255,0.45)" font-family="system-ui" font-weight="bold">Z</text>
        </g>`;
    }
    if (config.mouth === "wink") {
      return `
        <g class="wink-eyes">
          <circle cx="40" cy="45" r="5" fill="white" />
          <circle cx="40" cy="45" r="2" fill="#111" />
          <path d="M55 45 Q60 48 65 45" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="2" stroke-linecap="round" />
        </g>`;
    }
    return `
      <g class="eyes">
        <circle cx="40" cy="45" r="5" fill="white" />
        <circle cx="40" cy="45" r="2" fill="#111" />
        <circle cx="60" cy="45" r="5" fill="white" />
        <circle cx="60" cy="45" r="2" fill="#111" />
      </g>`;
  }

  function buildAccessory(config) {
    if (config.accessory === "blush") {
      return `<ellipse cx="32" cy="58" rx="6" ry="4" fill="rgba(251,113,133,0.45)"/><ellipse cx="68" cy="58" rx="6" ry="4" fill="rgba(251,113,133,0.45)"/>`;
    }
    if (config.accessory === "freckles") {
      const dots = [
        [36, 52], [42, 55], [58, 52], [64, 55], [50, 58],
      ];
      return dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="rgba(120,53,15,0.5)"/>`).join("");
    }
    return "";
  }

  function buildHat(hat) {
    if (!hat || hat === "none") return "";
    const hats = {
      cap: `<g class="hat cap"><ellipse cx="50" cy="14" rx="34" ry="6" fill="#1f2937"/><path d="M18 14 Q18 2 50 -2 Q82 2 82 14" fill="#374151"/></g>`,
      crown: `<g class="hat crown"><path d="M22 14 L30 14 L34 -1 L38 14 L46 14 L50 -3 L54 14 L62 14 L66 -1 L70 14 L78 14 L78 16 L22 16 Z" fill="#eab308" stroke="#b45309" stroke-width="0.6"/><circle cx="34" cy="-1" r="2.5" fill="#fef08a"/><circle cx="50" cy="-3" r="2.5" fill="#fef08a"/><circle cx="66" cy="-1" r="2.5" fill="#fef08a"/></g>`,
      wizard: `<g class="hat wizard"><path d="M30 14 L70 14 L50 -10 Z" fill="#4c1d95"/><path d="M34 12 L66 12 L50 -6 Z" fill="#5b21b6"/><circle cx="50" cy="-10" r="2" fill="#7c3aed"/></g>`,
      tophat: `<g class="hat tophat"><ellipse cx="50" cy="12" rx="36" ry="6" fill="#1c1917"/><path d="M26 12 L26 -16 L74 -16 L74 12 Z" fill="#1c1917"/><ellipse cx="50" cy="-16" rx="24" ry="4" fill="#292524"/></g>`,
      beanie: `<g class="hat beanie"><path d="M22 16 Q22 4 50 0 Q78 4 78 16 Z" fill="#dc2626"/><path d="M20 16 L80 16 L80 20 L20 20 Z" fill="#b91c1c"/><circle cx="50" cy="-2" r="5" fill="#fecaca"/></g>`,
      headphones: `<g class="hat headphones"><path d="M22 42 Q22 8 50 6 Q78 8 78 42" fill="none" stroke="#334155" stroke-width="4"/><rect x="14" y="38" width="12" height="18" rx="4" fill="#1e293b"/><rect x="74" y="38" width="12" height="18" rx="4" fill="#1e293b"/></g>`,
      halo: `<g class="hat halo"><ellipse cx="50" cy="2" rx="22" ry="5" fill="none" stroke="#fde047" stroke-width="3" opacity="0.9"/></g>`,
      horns: `<g class="hat horns"><path d="M32 14 L28 -4 L36 10 Z" fill="#7f1d1d"/><path d="M68 14 L72 -4 L64 10 Z" fill="#7f1d1d"/></g>`,
    };
    return hats[hat] || "";
  }

  function buildMouthExtra(config) {
    if (config.mouth === "tongue") {
      return `<ellipse cx="50" cy="74" rx="7" ry="5" fill="#fb718b"/><path d="M46 70 L54 70" stroke="#be123c" stroke-width="1"/>`;
    }
    if (config.mouth === "laugh") {
      return `<ellipse cx="50" cy="70" rx="10" ry="7" fill="#111" opacity="0.85"/>`;
    }
    return "";
  }

  function render(container, config, classes) {
    if (!container) return;
    const c = normalizeConfig(config);
    const mouthStroke = c.mouth === "cool" || c.mouth === "laugh" ? "rgba(0,0,0,0.7)" : "white";
    const mouthPath = MOUTH_PATHS[c.mouth] || MOUTH_PATHS.smile;
    const showMouthLine = c.mouth !== "laugh";

    container.innerHTML = `
      <svg viewBox="0 0 100 100" class="${classes || ""}" role="img" aria-hidden="true">
        <circle cx="50" cy="50" r="40" fill="${c.base}" />
        ${buildEyes(c)}
        ${buildAccessory(c)}
        ${showMouthLine ? `<path d="${mouthPath}" stroke="${mouthStroke}" stroke-width="3" fill="none" stroke-linecap="round" />` : ""}
        ${buildMouthExtra(c)}
        ${buildHat(c.hat)}
      </svg>`;
  }

  function renderShopPreview(type, value) {
    const mini = normalizeConfig({ base: "#8b5cf6", mouth: "smile", hat: "none", accessory: "none" });
    if (type === "base") mini.base = value;
    if (type === "mouth") mini.mouth = value;
    if (type === "hat") mini.hat = value;
    if (type === "accessory") mini.accessory = value;
    const wrap = document.createElement("div");
    wrap.className = "w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center hub-shop-preview";
    render(wrap, mini, "w-full h-full");
    return wrap.outerHTML;
  }

  function applyNameStyles(nameEl, config) {
    if (!nameEl) return;
    const c = normalizeConfig(config);
    nameEl.style.color = c.nameColor === "inherit" ? "" : c.nameColor;
    const glowClass = c.glow && c.glow !== "none" ? c.glow : "";
    const effectClass = c.nameEffect && c.nameEffect !== "none" ? `name-effect-${c.nameEffect}` : "";
    nameEl.className = `text-lg font-semibold ${glowClass} ${effectClass}`.trim();
  }

  window.gameHubAvatar = {
    DEFAULT_INVENTORY,
    SHOP_ITEMS,
    MOUTH_LABELS,
    HAT_LABELS,
    GLOW_LABELS,
    ACCESSORY_LABELS,
    NAME_EFFECT_LABELS,
    normalizeConfig,
    render,
    renderShopPreview,
    applyNameStyles,
  };
})();
