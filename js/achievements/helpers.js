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

  window.gameHubAchievementHelpers = {
    unlock,
    checkThresholds,
    checkScoreMilestones,
    checkStandardScoreAchievements,
  };
})();
