/**
 * Shared helpers for unlocking achievements from game code.
 */
(function () {
  function unlock(gameId, achievementId) {
    if (!gameId || !achievementId) return;
    if (window.gameHubProgress && window.gameHubProgress.unlockAchievement) {
      window.gameHubProgress.unlockAchievement(gameId, achievementId);
    }
  }

  /** Unlock any achievements whose id is in the map and whose threshold <= value. */
  function checkThresholds(gameId, value, thresholdMap) {
    if (!gameId || value == null || !thresholdMap) return;
    Object.keys(thresholdMap).forEach((achId) => {
      if (value >= thresholdMap[achId]) {
        unlock(gameId, achId);
      }
    });
  }

  function checkScoreMilestones(gameId, score, achievementIdsInOrder) {
    if (!gameId || !window.gameHubAchievementRegistry) return;
    const defs = window.gameHubAchievementRegistry.getGameDefinitions(gameId);
    achievementIdsInOrder.forEach((achId) => {
      const def = defs.find((d) => d.id === achId);
      if (!def || def.threshold == null) return;
      if (score >= def.threshold) unlock(gameId, achId);
    });
  }

  /** Standard score achievements: _score_10, _score_25, etc. */
  function checkStandardScoreAchievements(gameId, score) {
    const milestones = [10, 25, 50, 100];
    milestones.forEach((n) => {
      if (score >= n) unlock(gameId, `${gameId}_score_${n}`);
    });
  }

  /**
   * Update a game stat and check for achievement thresholds.
   * @param {string} gameId - The game ID.
   * @param {string} statKey - The stat key (e.g., 'gamesPlayed', 'totalScore').
   * @param {number|any} value - The value to set or use for increment.
   * @param {object} [options] - Options.
   * @param {boolean} [options.increment=false] - If true, increment the stat by value.
   */
  async function updateStat(gameId, statKey, value, options = {}) {
    if (!gameId || !statKey) return;
    const increment = options.increment === true;
    let progress = {};
    if (window.gameHubProgress && window.gameHubProgress.loadGameProgress) {
      progress = (await window.gameHubProgress.loadGameProgress(gameId)) || {};
    }
    const currentStat = progress[statKey] || 0;
    const newValue = increment ? currentStat + value : value;
    progress[statKey] = newValue;
    
    if (window.gameHubProgress && window.gameHubProgress.saveGameProgress) {
      await window.gameHubProgress.saveGameProgress(gameId, progress);
    }
    
    // Check thresholds for this stat
    if (window.gameHubAchievements && window.gameHubAchievements.checkStatThresholdAchievements) {
      window.gameHubAchievements.checkStatThresholdAchievements(gameId, statKey, newValue);
    }
    
    return newValue;
  }

  window.gameHubAchievementHelpers = {
    unlock,
    checkThresholds,
    checkScoreMilestones,
    checkStandardScoreAchievements,
    updateStat,
  };
})();
