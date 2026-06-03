(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('global', [
    { id: 'perfectionist', name: 'The Perfectionist', description: 'Unlock every other achievement in the Game Hub.',
      difficulty: 'insane', value: 500
    },
  ]);
})();
