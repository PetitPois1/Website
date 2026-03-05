(function () {
  const definitions = {
    snake: [
      {
        id: "snake_first_apple",
        name: "First Bite",
        description: "Eat your first food."
      },
      {
        id: "snake_score_10",
        name: "Getting Warmed Up",
        description: "Reach a score of 10."
      },
      {
        id: "snake_score_25",
        name: "Serious Snake",
        description: "Reach a score of 25."
      },
      {
        id: "snake_score_50",
        name: "Snake Master",
        description: "Reach a score of 50."
      }
    ],
    blockblast: [
      {
        id: "blockblast_first_clear",
        name: "First Clear",
        description: "Clear your first line or column."
      },
      {
        id: "blockblast_500_score",
        name: "Solid Start",
        description: "Score 500 points in a single run."
      },
      {
        id: "blockblast_1000_score",
        name: "Combo Artist",
        description: "Score 1000 points in a single run."
      }
    ],
    blackjack: [
      {
        id: "blackjack_first_win",
        name: "First Win",
        description: "Win your first hand."
      },
      {
        id: "blackjack_5_wins",
        name: "On a Roll",
        description: "Win 5 hands in total."
      },
      {
        id: "blackjack_2000_money",
        name: "High Roller",
        description: "Reach $2000 or more."
      }
    ]
  };

  function getDefinitions(gameId) {
    if (!gameId) return definitions;
    return definitions[gameId] || [];
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
        nameEl.textContent = ach.name;
        nameEl.style.fontWeight = "600";
        nameEl.style.fontSize = "0.95rem";

        const descEl = document.createElement("div");
        descEl.textContent = ach.description;
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
    showAchievementsModal
  };
})();

