(function () {
  const definitions = {
    snake: [
      {
        id: "snake_first_apple",
        name: "First Bite",
        description: "Eat your first food.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "snake_score_10",
        name: "Getting Warmed Up",
        description: "Reach a score of 10.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "snake_score_25",
        name: "Serious Snake",
        description: "Reach a score of 25.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "snake_score_50",
        name: "Snake Master",
        description: "Reach a score of 50.",
        difficulty: "hard",
        value: 50
      },
      {
        id: "snake_score_100",
        name: "Snake God",
        description: "Reach a score of 100.",
        difficulty: "insane",
        value: 100
      },
      {
        id: "snake_total_100",
        name: "Fruit Salad",
        description: "Eat 100 fruit in total.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "snake_total_500",
        name: "Hungry Hungry Snake",
        description: "Eat 500 fruit in total.",
        difficulty: "hard",
        value: 50
      },
      {
        id: "snake_total_1000",
        name: "Fruit Extinction",
        description: "Eat 1000 fruit in total.",
        difficulty: "insane",
        value: 100
      },
      {
        id: "snake_complete",
        name: "Board Master",
        description: "Fill the entire board with the snake.",
        difficulty: "insane",
        value: 150
      }
    ],
    blockblast: [
      {
        id: "blockblast_first_clear",
        name: "First Clear",
        description: "Clear your first line or column.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "blockblast_500_score",
        name: "Solid Start",
        description: "Score 500 points in a single run.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "blockblast_1000_score",
        name: "Combo Artist",
        description: "Score 1000 points in a single run.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "blockblast_2500_score",
        name: "Block Expert",
        description: "Score 2500 points in a single run.",
        difficulty: "hard",
        value: 50
      },
      {
        id: "blockblast_5000_score",
        name: "Blast Master",
        description: "Score 5000 points in a single run.",
        difficulty: "insane",
        value: 100
      },
      {
        id: "blockblast_insane_mode",
        name: "Reality Warp",
        description: "Secret: You activated Insane Mode.",
        difficulty: "hard",
        value: 50
      }
    ],
    blackjack: [
      {
        id: "blackjack_first_win",
        name: "First Win",
        description: "Win your first hand.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "blackjack_5_wins",
        name: "On a Roll",
        description: "Win 5 hands in total.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "blackjack_2000_money",
        name: "High Roller",
        description: "Reach $2000 or more.",
        difficulty: "hard",
        value: 50
      }
    ],
    clicker: [
      {
        id: "clicker_1_click",
        name: "Novice",
        description: "Click 1 time.",
        difficulty: "easy",
        value: 5
      },
      {
        id: "clicker_100_clicks",
        name: "Grinder",
        description: "Click 100 times.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "clicker_1000_clicks",
        name: "Click King",
        description: "Click 1,000 times.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "clicker_1m_credits",
        name: "Wealthy",
        description: "Earn 1 Million Credits.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "clicker_1b_credits",
        name: "Tycoon",
        description: "Earn 1 Billion Credits.",
        difficulty: "hard",
        value: 50
      },
      {
        id: "clicker_1q_credits",
        name: "Godhood",
        description: "Earn 1 Quadrillion Credits.",
        difficulty: "insane",
        value: 100
      },
      {
        id: "clicker_50_pickers",
        name: "Automation",
        description: "Own 50 Rock Pickers.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "clicker_era_3",
        name: "Century",
        description: "Reach Era 3.",
        difficulty: "hard",
        value: 50
      }
    ],
    flappy: [
      {
        id: "flappy_first_pipe",
        name: "Take Flight",
        description: "Pass your first pipe.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "flappy_10_score",
        name: "Wingman",
        description: "Reach a score of 10.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "flappy_25_score",
        name: "Aviator",
        description: "Reach a score of 25.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "flappy_50_score",
        name: "Sky Ace",
        description: "Reach a score of 50.",
        difficulty: "hard",
        value: 50
      },
      {
        id: "flappy_100_score",
        name: "Cloud Ruler",
        description: "Reach a score of 100.",
        difficulty: "insane",
        value: 100
      }
    ],
    mining: [
      {
        id: "mining_depth_100",
        name: "Surface Scraper",
        description: "Reach a depth of 100m.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "mining_depth_500",
        name: "Deep Diver",
        description: "Reach a depth of 500m.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "mining_depth_1000",
        name: "Abyssal Miner",
        description: "Reach a depth of 1000m.",
        difficulty: "hard",
        value: 50
      },
      {
        id: "mining_total_100",
        name: "Ore Collector",
        description: "Mine 100 ores in total.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "mining_total_1000",
        name: "Mineral Magnate",
        description: "Mine 1000 ores in total.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "mining_total_5000",
        name: "Core Master",
        description: "Mine 5000 ores in total.",
        difficulty: "hard",
        value: 50
      }
    ],
    brick: [
      {
        id: "brick_first_break",
        name: "Cracked",
        description: "Break your first brick.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "brick_1000_score",
        name: "Score Seeker",
        description: "Reach a score of 1000.",
        difficulty: "easy",
        value: 10
      },
      {
        id: "brick_5000_score",
        name: "High Breaker",
        description: "Reach a score of 5000.",
        difficulty: "medium",
        value: 25
      },
      {
        id: "brick_10000_score",
        name: "Brick Annihilator",
        description: "Reach a score of 10000.",
        difficulty: "hard",
        value: 50
      },
      {
        id: "brick_insane_mode",
        name: "Overclocked",
        description: "Secret: You activated Insane Mode.",
        difficulty: "hard",
        value: 50
      }
    ]
  };

  function getDefinitions(gameId) {
    if (!gameId) return definitions;
    return definitions[gameId] || [];
  }

  function getAchievementValue(gameId, achId) {
    const gameDefs = definitions[gameId] || [];
    const ach = gameDefs.find(a => a.id === achId);
    return ach ? (ach.value || 10) : 10;
  }

  async function showAchievementsModal(gameId) {
    const body = document.body;
    if (!body) return;

    const existing = document.getElementById("gamehub-achievements-modal");
    if (existing) {
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
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.backgroundColor = "rgba(15,23,42,0.85)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    const panel = document.createElement("div");
    panel.style.background =
      "linear-gradient(to bottom right, rgba(15,23,42,0.98), rgba(15,23,42,0.9))";
    panel.style.borderRadius = "16px";
    panel.style.padding = "24px";
    panel.style.color = "#e5e7eb";
    panel.style.minWidth = "280px";
    panel.style.maxWidth = "420px";
    panel.style.maxHeight = "80vh";
    panel.style.overflowY = "auto";
    panel.style.boxShadow =
      "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(148,163,184,0.2)";

    const title = document.createElement("div");
    title.style.display = "flex";
    title.style.justifyContent = "space-between";
    title.style.alignItems = "center";
    title.style.marginBottom = "16px";

    const h = document.createElement("h2");
    h.textContent = "Achievements";
    h.style.fontSize = "1.25rem";
    h.style.fontWeight = "700";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#9ca3af";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "1rem";
    closeBtn.onclick = () => overlay.remove();

    title.appendChild(h);
    title.appendChild(closeBtn);
    panel.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.style.fontSize = "0.85rem";
    subtitle.style.color = "#9ca3af";
    subtitle.style.marginBottom = "12px";
    subtitle.textContent = gameId
      ? `Progress for this game is saved to your profile when you're signed in.`
      : "Progress is saved to your profile when you're signed in.";
    panel.appendChild(subtitle);

    if (!allDefs.length) {
      const empty = document.createElement("p");
      empty.textContent = "No achievements defined yet.";
      empty.style.color = "#6b7280";
      empty.style.fontSize = "0.9rem";
      panel.appendChild(empty);
    } else {
      allDefs.forEach((ach) => {
        const unlocked = unlockedIds.includes(ach.id);
        const isSecret = ach.description.toLowerCase().includes("secret:");

        let displayDesc = ach.description;
        let displayName = ach.name;

        if (isSecret && !unlocked) {
          displayDesc = "??? (Secret Achievement)";
          displayName = "???";
        }

        const card = document.createElement("div");
        card.style.borderRadius = "12px";
        card.style.padding = "10px 12px";
        card.style.marginBottom = "8px";
        card.style.display = "flex";
        card.style.alignItems = "center";
        card.style.gap = "10px";
        card.style.backgroundColor = unlocked
          ? "rgba(22,163,74,0.12)"
          : "rgba(15,23,42,0.9)";
        card.style.border = unlocked
          ? "1px solid rgba(34,197,94,0.6)"
          : "1px solid rgba(148,163,184,0.25)";
        card.style.opacity = unlocked ? "1" : "0.6";

        const icon = document.createElement("div");
        icon.textContent = unlocked ? "★" : "☆";
        icon.style.fontSize = "1.1rem";
        icon.style.color = unlocked ? "#fbbf24" : "#6b7280";

        const textWrap = document.createElement("div");

        const nameEl = document.createElement("div");
        nameEl.textContent = displayName;
        nameEl.style.fontWeight = "600";
        nameEl.style.fontSize = "0.95rem";

        const descEl = document.createElement("div");
        descEl.textContent = displayDesc;
        descEl.style.fontSize = "0.8rem";
        descEl.style.color = "#9ca3af";

        textWrap.appendChild(nameEl);
        textWrap.appendChild(descEl);

        card.appendChild(icon);
        card.appendChild(textWrap);

        panel.appendChild(card);
      });
    }

    overlay.appendChild(panel);
    body.appendChild(overlay);
  }

  window.gameHubAchievements = {
    definitions,
    getDefinitions,
    showAchievementsModal,
    notifyAchievement: (gameId, achId) => {
      const gameDefs = definitions[gameId] || [];
      const ach = gameDefs.find(a => a.id === achId);
      if (!ach) return;

      // Remove existing if any
      const existing = document.getElementById("achievement-banner");
      if (existing) existing.remove();

      const banner = document.createElement("div");
      banner.id = "achievement-banner";
      banner.style.position = "fixed";
      banner.style.top = "24px";
      banner.style.right = "-400px"; // Start off-screen
      banner.style.width = "320px";
      banner.style.backgroundColor = "rgba(15, 23, 42, 0.95)";
      banner.style.backdropFilter = "blur(12px)";
      banner.style.border = "1px solid rgba(139, 92, 246, 0.5)";
      banner.style.borderRadius = "16px";
      banner.style.padding = "16px";
      banner.style.display = "flex";
      banner.style.alignItems = "center";
      banner.style.gap = "14px";
      banner.style.zIndex = "2147483647"; 
      banner.style.transition = "right 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease";
      banner.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)";
      banner.style.cursor = "pointer";
      banner.style.opacity = "0";

      const icon = document.createElement("div");
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34"/><path d="M18 9V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2Z"/></svg>`;
      icon.style.filter = "drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))";

      const textContainer = document.createElement("div");
      textContainer.style.display = "flex";
      textContainer.style.flexDirection = "column";
      textContainer.style.flex = "1";

      const title = document.createElement("div");
      title.textContent = "ACHIEVEMENT UNLOCKED";
      title.style.color = "#a78bfa";
      title.style.fontSize = "10px";
      title.style.fontWeight = "800";
      title.style.letterSpacing = "0.1em";
      title.style.marginBottom = "2px";

      const name = document.createElement("div");
      name.textContent = ach.name;
      name.style.color = "#ffffff";
      name.style.fontSize = "15px";
      name.style.fontWeight = "700";
      name.style.lineHeight = "1.2";

      const desc = document.createElement("div");
      desc.textContent = ach.description;
      desc.style.color = "#94a3b8";
      desc.style.fontSize = "12px";
      desc.style.marginTop = "2px";
      desc.style.lineHeight = "1.3";

      textContainer.appendChild(title);
      textContainer.appendChild(name);
      textContainer.appendChild(desc);
      banner.appendChild(icon);
      banner.appendChild(textContainer);

      document.body.appendChild(banner);

      // Sound
      try {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
          audio.volume = 0.3;
          audio.play().catch(() => {});
      } catch(e) {}

      // Animate in
      requestAnimationFrame(() => {
          banner.style.right = "24px";
          banner.style.opacity = "1";
      });

      const hide = () => {
          banner.style.right = "-400px";
          banner.style.opacity = "0";
          setTimeout(() => { if (banner.parentNode) banner.remove(); }, 700);
      };

      banner.onclick = hide;
      setTimeout(hide, 5000);
    }
  };
})();

