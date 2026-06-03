/**
 * Display metadata for profile game tiles (achievement counts come from the registry).
 */
(function () {
  const GAME_META = {
    snake: { name: "Snake Game", icon: "🐍", tagline: "Classic arcade snake", statLabel: "High score", progressKey: "highScore" },
    blockblast: { name: "Block Blast", icon: "🧱", tagline: "Chill puzzle board", statLabel: "Best score", progressKey: "highScore" },
    clicker: { name: "Industrial Clicker", icon: "⚙️", tagline: "Empire builder", statLabel: "Total earned", progressKey: "totalEarned" },
    flappy: { name: "Flappy Bird", icon: "🐦", tagline: "Don't hit the pipes", statLabel: "High score", progressKey: "highScore" },
    mining: { name: "Mining", icon: "⛏️", tagline: "Deep core explorer", statLabel: "Max depth", progressKey: "player.stats.maxDepth", suffix: "m" },
    brick: { name: "Brick Breaker", icon: "🎾", tagline: "Neon core rogue", statLabel: "High score", progressKey: "highScore" },
    blackjack: { name: "Blackjack", icon: "🃏", tagline: "Casino-lite cards", statLabel: "Best bankroll", progressKey: "bestMoney", prefix: "$" },
    stack: { name: "3D Stack", icon: "🧈", tagline: "Tower building", statLabel: "High score", progressKey: "highScore" },
    pong: { name: "Pong", icon: "🏓", tagline: "Retro paddle duel", statLabel: "High score", progressKey: "highScore" },
    pacman: { name: "Pac-Man", icon: "🟡", tagline: "Maze chomper", statLabel: "High score", progressKey: "highScore" },
    "tic_tac_toe": { name: "Tic-Tac-Toe", icon: "❌", tagline: "Classic grid duel", statLabel: "Wins", progressKey: "wins" },
    tower_defence: { name: "Tower Defence", icon: "🏹", tagline: "Wave survival", statLabel: "Best wave", progressKey: "highWave" },
    poker: { name: "Poker", icon: "💎", tagline: "Texas hold'em", statLabel: "High score", progressKey: "highScore" },
    loopy: { name: "Loopy Puzzle", icon: "➰", tagline: "Path logic", statLabel: "Puzzles solved", progressKey: "solved" },
    neondash: { name: "Neon Dash", icon: "🟦", tagline: "Rhythm runner", statLabel: "High score", progressKey: "highScore" },
    island: { name: "The Island", icon: "🔫", tagline: "FPS survival", statLabel: "High score", progressKey: "highScore" },
    swordbattle: { name: "Sword Battle IO", icon: "⚔️", tagline: "Arena slashes", statLabel: "Kills", progressKey: "kills" },
    voxelcraft: { name: "Voxelcraft", icon: "🧊", tagline: "Block world", statLabel: "Blocks placed", progressKey: "blocksPlaced" },
    pool: { name: "Pool", icon: "🎱", tagline: "Table physics", statLabel: "Wins", progressKey: "wins" },
    forpiece: { name: "For Piece", icon: "🏴‍☠️", tagline: "Naval tactics", statLabel: "High score", progressKey: "highScore" },
    Hades: { name: "Hades", icon: "🏺", tagline: "Underworld run", statLabel: "High score", progressKey: "highScore" },
    "3DFlappyBird": { name: "3D Flappy Bird", icon: "🐦‍🔥", tagline: "Sky dodge", statLabel: "High score", progressKey: "highScore" },
    Astroids: { name: "Asteroids", icon: "☄️", tagline: "Space shooter", statLabel: "High score", progressKey: "highScore" },
    UltimateRPS: { name: "Ultimate RPS", icon: "✂️", tagline: "Rock paper scissors", statLabel: "Wins", progressKey: "wins" },
  };

  function titleCaseId(id) {
    return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function getGamesForProfile() {
    const reg = window.gameHubAchievementRegistry;
    if (!reg) return [];
    const all = reg.getAllDefinitions();
    return Object.keys(all)
      .filter((id) => id !== "global" && (all[id] || []).length > 0)
      .map((id) => {
        const meta = GAME_META[id] || {
          name: titleCaseId(id),
          icon: "🎮",
          tagline: "",
          statLabel: "Best score",
          progressKey: "highScore",
        };
        return {
          id,
          achievementTotal: all[id].length,
          ...meta,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function getGameDisplayName(gameId) {
    if (GAME_META[gameId]) return GAME_META[gameId].name;
    return titleCaseId(gameId);
  }

  window.gameHubProfileCatalog = {
    getGamesForProfile,
    getGameDisplayName,
    GAME_META,
  };
})();
