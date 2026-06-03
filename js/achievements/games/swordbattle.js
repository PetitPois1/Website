(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('swordbattle', [
    { id: 'swordbattle_first_kill', name: 'First Blood', description: 'Defeat another player.',
      difficulty: 'easy', value: 10
    },
    { id: 'swordbattle_kills_10', name: 'Duelist', description: 'Get 10 defeats.',
      difficulty: 'medium', value: 25
    },
    { id: 'swordbattle_kills_50', name: 'Arena Lord', description: 'Get 50 defeats.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
