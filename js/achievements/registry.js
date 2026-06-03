/**
 * Achievement registry — each game file calls registerGameAchievements().
 * @see docs/ACHIEVEMENTS.md
 */
(function () {
  const definitions = { global: [] };

  /** Base coin rewards by difficulty (custom `value` on a def overrides this). */
  const DIFFICULTY_REWARDS = {
    easy: 10,
    medium: 25,
    hard: 50,
    insane: 100,
  };

  function getCoinReward(achievementDef) {
    if (!achievementDef) return DIFFICULTY_REWARDS.easy;
    if (typeof achievementDef.value === "number" && achievementDef.value > 0) {
      return achievementDef.value;
    }
    return DIFFICULTY_REWARDS[achievementDef.difficulty] || DIFFICULTY_REWARDS.easy;
  }

  function registerGameAchievements(gameId, list) {
    if (!gameId || !Array.isArray(list)) return;
    definitions[gameId] = list;
  }

  function getAllDefinitions() {
    return definitions;
  }

  function getGameDefinitions(gameId) {
    if (!gameId) return definitions;
    return definitions[gameId] || [];
  }

  window.gameHubAchievementRegistry = {
    registerGameAchievements,
    getAllDefinitions,
    getGameDefinitions,
    getCoinReward,
    DIFFICULTY_REWARDS,
    _definitions: definitions,
  };
})();
