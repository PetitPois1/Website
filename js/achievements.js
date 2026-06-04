/**
 * Game Hub achievements API (UI + helpers).
 * Load order: registry.js → helpers.js → definitions-bundle.js → this file.
 */
(function () {
  const registry = window.gameHubAchievementRegistry;
  if (!registry) {
    console.error("[GameHub] achievements/registry.js must load before achievements.js");
    return;
  }

  function getDefinitions(gameId) {
    if (!gameId) return registry.getAllDefinitions();
    return registry.getGameDefinitions(gameId);
  }

  function getAchievementCount(gameId) {
    return getDefinitions(gameId).length;
  }

  function getCoinReward(achievementDef) {
    if (registry.getCoinReward) return registry.getCoinReward(achievementDef);
    return achievementDef && achievementDef.value ? achievementDef.value : 10;
  }

  function getAchievementValue(gameId, achId) {
    const gameDefs = getDefinitions(gameId);
    const ach = gameDefs.find((a) => a.id === achId);
    return ach ? getCoinReward(ach) : 10;
  }

  const DIFFICULTY_LABELS = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    insane: "Insane",
  };

  function checkThresholdAchievements(gameId, value) {
    const H = window.gameHubAchievementHelpers;
    if (!H) return;
    const defs = getDefinitions(gameId);
    defs.forEach((ach) => {
      if (ach.threshold != null && !ach.statKey && value >= ach.threshold) {
        H.unlock(gameId, ach.id);
      }
    });
  }

  function checkStatThresholdAchievements(gameId, statKey, value) {
    const H = window.gameHubAchievementHelpers;
    if (!H || !statKey) return;
    const defs = getDefinitions(gameId);
    defs.forEach((ach) => {
      if (ach.statKey === statKey && ach.threshold != null && value >= ach.threshold) {
        H.unlock(gameId, ach.id);
      }
    });
  }

  async function showAchievementsModal(gameId) {
    const body = document.body;
    if (!body) return;

    console.log("showAchievementsModal called for:", gameId);

    const existing = document.getElementById("gamehub-achievements-modal");
    if (existing) {
      console.log("Existing modal found, removing it first!");
      existing.remove();
    }

    const allDefs = getDefinitions(gameId);
    let unlockedIds = [];
    try {
      if (window.gameHubProgress && window.gameHubProgress.getUserAchievements) {
        unlockedIds = await window.gameHubProgress.getUserAchievements(gameId);
      }
    } catch (e) {
      console.warn("[GameHub] Could not load achievements", e);
    }

    const overlay = document.createElement("div");
    overlay.id = "gamehub-achievements-modal";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(15,23,42,0.85);background-image:radial-gradient(circle at 0% 0%, var(--theme-glow, rgba(139, 92, 246, 0.15)) 0%, transparent 50%), radial-gradient(circle at 100% 100%, var(--theme-glow-secondary, rgba(59, 130, 246, 0.1)) 0%, transparent 50%);display:flex;align-items:center;justify-content:center;z-index:9999;";
    overlay.addEventListener("click", (e) => {
      console.log("Achievement modal overlay clicked!", e.target);
      if (e.target === overlay) {
        console.log("Removing achievement modal!");
        overlay.remove();
      }
    });

    const panel = document.createElement("div");
    panel.style.cssText =
      "background:linear-gradient(to bottom right,rgba(15,23,42,0.98),rgba(15,23,42,0.9));border-radius:16px;padding:24px;color:#e5e7eb;min-width:280px;max-width:420px;max-height:80vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(148,163,184,0.2);";

    const title = document.createElement("div");
    title.style.cssText =
      "display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;";

    const h = document.createElement("h2");
    h.textContent = "Achievements";
    h.style.cssText = "font-size:1.25rem;font-weight:700;margin:0;";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText =
      "background:transparent;border:none;color:#9ca3af;cursor:pointer;font-size:1rem;";
    closeBtn.onclick = () => {
      console.log("Achievement modal close button clicked!");
      overlay.remove();
    };

    title.appendChild(h);
    title.appendChild(closeBtn);
    panel.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.style.cssText = "font-size:0.85rem;color:#9ca3af;margin-bottom:12px;";
    const user = window.gameHubAuth && window.gameHubAuth.getCurrentUser
      ? window.gameHubAuth.getCurrentUser()
      : null;
    subtitle.textContent = user
      ? "Unlocked achievements award hub coins to your account."
      : "Sign in to sync achievements and earn hub coins on your profile.";
    panel.appendChild(subtitle);

    const legend = document.createElement("p");
    legend.style.cssText = "font-size:0.75rem;color:#64748b;margin:0 0 12px;line-height:1.4;";
    const tiers = registry.DIFFICULTY_REWARDS || { easy: 10, medium: 25, hard: 50, insane: 100 };
    legend.textContent = `Rewards: Easy ${tiers.easy}🪙 · Medium ${tiers.medium}🪙 · Hard ${tiers.hard}🪙 · Insane ${tiers.insane}🪙`;
    panel.appendChild(legend);

    if (!allDefs.length) {
      const empty = document.createElement("p");
      empty.textContent = "No achievements defined yet.";
      empty.style.cssText = "color:#6b7280;font-size:0.9rem;";
      panel.appendChild(empty);
    } else {
      allDefs.forEach((ach) => {
        const unlocked = unlockedIds.includes(ach.id);
        const isSecret = ach.description.toLowerCase().includes("secret:");
        let displayDesc = ach.description;
        let displayName = ach.name;
        if (isSecret && !unlocked) {
          displayDesc = "??? (Secret achievement)";
          displayName = "???";
        }

        const card = document.createElement("div");
        card.style.cssText = `border-radius:12px;padding:10px 12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;background:${unlocked ? "rgba(22,163,74,0.12)" : "rgba(15,23,42,0.9)"};border:1px solid ${unlocked ? "rgba(34,197,94,0.6)" : "rgba(148,163,184,0.25)"};opacity:${unlocked ? 1 : 0.6};`;

        const icon = document.createElement("div");
        icon.textContent = unlocked ? "★" : "☆";
        icon.style.cssText = `font-size:1.1rem;color:${unlocked ? "#fbbf24" : "#6b7280"};`;

        const textWrap = document.createElement("div");
        const nameEl = document.createElement("div");
        nameEl.textContent = displayName;
        nameEl.style.cssText = "font-weight:600;font-size:0.95rem;";
        const descEl = document.createElement("div");
        descEl.textContent = displayDesc;
        descEl.style.cssText = "font-size:0.8rem;color:#9ca3af;";

        const metaRow = document.createElement("div");
        metaRow.style.cssText =
          "display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap;";

        const rewardEl = document.createElement("span");
        const coins = getCoinReward(ach);
        rewardEl.textContent = `+${coins} 🪙`;
        rewardEl.style.cssText = `font-size:0.72rem;font-weight:700;color:${unlocked ? "#fbbf24" : "#94a3b8"};`;

        const diffEl = document.createElement("span");
        const diffKey = ach.difficulty || "easy";
        diffEl.textContent = DIFFICULTY_LABELS[diffKey] || diffKey;
        const diffColors = {
          easy: "#34d399",
          medium: "#60a5fa",
          hard: "#f97316",
          insane: "#f472b6",
        };
        diffEl.style.cssText = `font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${diffColors[diffKey] || "#94a3b8"};`;

        metaRow.appendChild(rewardEl);
        metaRow.appendChild(diffEl);

        textWrap.appendChild(nameEl);
        textWrap.appendChild(descEl);
        textWrap.appendChild(metaRow);
        card.appendChild(icon);
        card.appendChild(textWrap);
        panel.appendChild(card);
      });
    }

    overlay.appendChild(panel);
    body.appendChild(overlay);
  }

  async function showLeaderboardModal(gameId) {
    const body = document.body;
    if (!body) return;

    console.log("showLeaderboardModal called for:", gameId);

    const existing = document.getElementById("gamehub-leaderboard-modal");
    if (existing) {
      console.log("Existing leaderboard modal found, removing it first!");
      existing.remove();
    }

    const overlay = document.createElement("div");
    overlay.id = "gamehub-leaderboard-modal";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(15,23,42,0.85);background-image:radial-gradient(circle at 0% 0%, var(--theme-glow, rgba(139, 92, 246, 0.15)) 0%, transparent 50%), radial-gradient(circle at 100% 100%, var(--theme-glow-secondary, rgba(59, 130, 246, 0.1)) 0%, transparent 50%);display:flex;align-items:center;justify-content:center;z-index:9999;";
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    const panel = document.createElement("div");
    panel.style.cssText =
      "background:linear-gradient(to bottom right,rgba(15,23,42,0.98),rgba(15,23,42,0.9));border-radius:20px;padding:24px;color:#e5e7eb;width:90%;max-width:500px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,0.6);";

    const header = document.createElement("div");
    header.style.cssText =
      "display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;";

    const title = document.createElement("h2");
    title.textContent = `${(gameId || "").charAt(0).toUpperCase() + (gameId || "").slice(1)} Leaderboard`;
    title.style.cssText = "font-size:1.5rem;font-weight:800;margin:0;color:#fff;";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText =
      "background:rgba(255,255,255,0.05);border:none;color:#9ca3af;width:32px;height:32px;border-radius:50%;cursor:pointer;";
    closeBtn.onclick = () => {
      console.log("Leaderboard modal close button clicked!");
      overlay.remove();
    };

    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    const filterRow = document.createElement("div");
    filterRow.style.cssText = "display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;";

    const periods = ["daily", "monthly", "alltime"];
    const periodLabels = { daily: "Daily", monthly: "Monthly", alltime: "All Time" };
    const scopes = ["everyone", "friends"];
    const scopeLabels = { everyone: "Everyone", friends: "Friends" };

    let currentPeriod = "alltime";
    let currentScope = "everyone";

    const listContainer = document.createElement("div");
    listContainer.style.cssText = "flex:1;overflow-y:auto;padding-right:4px;";

    async function refreshList() {
      listContainer.innerHTML =
        '<p style="text-align:center;padding:40px;color:#64748b;">Loading scores...</p>';
      const entries = await window.gameHubProgress.getLeaderboard(
        gameId,
        currentPeriod,
        currentScope
      );
      listContainer.innerHTML = "";
      if (!entries.length) {
        listContainer.innerHTML =
          '<p style="text-align:center;padding:40px;color:#64748b;">No scores yet.</p>';
        return;
      }
      entries.forEach((entry, index) => {
        const row = document.createElement("div");
        row.style.cssText =
          "display:flex;align-items:center;padding:12px 16px;border-radius:12px;margin-bottom:4px;border:1px solid rgba(255,255,255,0.05);";
        const rank = document.createElement("div");
        rank.textContent = index + 1;
        rank.style.cssText = `width:30px;font-weight:800;color:${index === 0 ? "#fbbf24" : "#94a3b8"};`;
        const name = document.createElement("div");
        name.textContent = entry.username;
        name.style.cssText = "flex:1;font-weight:600;";
        const score = document.createElement("div");
        score.textContent = Math.floor(entry.score).toLocaleString();
        score.style.cssText = "font-weight:800;color:#8b5cf6;";
        row.appendChild(rank);
        row.appendChild(name);
        row.appendChild(score);
        listContainer.appendChild(row);
      });
    }

    periods.forEach((p) => {
      const chip = document.createElement("button");
      chip.textContent = periodLabels[p];
      chip.className = "period-chip";
      chip.style.cssText =
        "padding:6px 14px;border-radius:20px;font-size:0.75rem;font-weight:700;border:1px solid rgba(255,255,255,0.1);cursor:pointer;";
      const updateStyle = () => {
        chip.style.background = currentPeriod === p ? "#8b5cf6" : "rgba(255,255,255,0.05)";
        chip.style.color = currentPeriod === p ? "#fff" : "#94a3b8";
      };
      updateStyle();
      chip.onclick = () => {
        currentPeriod = p;
        filterRow.querySelectorAll(".period-chip").forEach((c) => {
          c.style.background = "rgba(255,255,255,0.05)";
          c.style.color = "#94a3b8";
        });
        updateStyle();
        refreshList();
      };
      filterRow.appendChild(chip);
    });

    scopes.forEach((s) => {
      const chip = document.createElement("button");
      chip.textContent = scopeLabels[s];
      chip.className = "scope-chip";
      chip.style.cssText =
        "padding:6px 14px;border-radius:20px;font-size:0.75rem;font-weight:700;border:1px solid rgba(255,255,255,0.1);cursor:pointer;";
      const updateStyle = () => {
        chip.style.background = currentScope === s ? "#10b981" : "rgba(255,255,255,0.05)";
        chip.style.color = currentScope === s ? "#fff" : "#94a3b8";
      };
      updateStyle();
      chip.onclick = () => {
        currentScope = s;
        filterRow.querySelectorAll(".scope-chip").forEach((c) => {
          c.style.background = "rgba(255,255,255,0.05)";
          c.style.color = "#94a3b8";
        });
        updateStyle();
        refreshList();
      };
      filterRow.appendChild(chip);
    });

    panel.appendChild(filterRow);
    panel.appendChild(listContainer);
    overlay.appendChild(panel);
    body.appendChild(overlay);
    refreshList();
  }

  function notifyAchievement(gameId, achId, rewardValue = null) {
    const gameDefs = getDefinitions(gameId);
    const ach = gameDefs.find((a) => a.id === achId);
    if (!ach) return;

    const existing = document.getElementById("achievement-banner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "achievement-banner";
    banner.style.cssText =
      "position:fixed;top:24px;right:-400px;width:320px;background:rgba(15,23,42,0.95);backdrop-filter:blur(12px);border:1px solid rgba(139,92,246,0.5);border-radius:16px;padding:16px;display:flex;align-items:center;gap:14px;z-index:2147483647;transition:right 0.6s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s;cursor:pointer;opacity:0;";

    const icon = document.createElement("div");
    icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34"/><path d="M18 9V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2Z"/></svg>';

    const textContainer = document.createElement("div");
    textContainer.style.flex = "1";

    const title = document.createElement("div");
    title.textContent = "ACHIEVEMENT UNLOCKED";
    title.style.cssText =
      "color:#a78bfa;font-size:10px;font-weight:800;letter-spacing:0.1em;";

    const name = document.createElement("div");
    name.textContent = ach.name;
    name.style.cssText = "color:#fff;font-size:15px;font-weight:700;margin-top:4px;";

    const desc = document.createElement("div");
    desc.textContent = ach.description;
    desc.style.cssText = "color:#94a3b8;font-size:12px;margin-top:2px;";

    textContainer.appendChild(title);
    if (rewardValue !== null) {
      const reward = document.createElement("div");
      reward.textContent = `+${rewardValue} 🪙`;
      reward.style.cssText = "color:#fbbf24;font-size:11px;font-weight:bold;margin-top:2px;";
      textContainer.appendChild(reward);
    }
    textContainer.appendChild(name);
    textContainer.appendChild(desc);
    banner.appendChild(icon);
    banner.appendChild(textContainer);
    document.body.appendChild(banner);

    requestAnimationFrame(() => {
      banner.style.right = "24px";
      banner.style.opacity = "1";
    });

    const hide = () => {
      banner.style.right = "-400px";
      banner.style.opacity = "0";
      setTimeout(() => banner.remove(), 700);
    };
    banner.onclick = hide;
    setTimeout(hide, 5000);
  }

  const definitions = registry.getAllDefinitions();

  window.gameHubAchievements = {
    definitions,
    getDefinitions,
    getAchievementCount,
    getCoinReward,
    getAchievementValue,
    checkThresholdAchievements,
    checkStatThresholdAchievements,
    showAchievementsModal,
    showLeaderboardModal,
    notifyAchievement,
  };
})();
