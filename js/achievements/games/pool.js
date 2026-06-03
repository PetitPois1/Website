(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('pool', [
    { id: 'pool_first_pocket', name: 'Corner Pocket', description: 'Pot your first ball.',
      difficulty: 'easy', value: 10
    },
    { id: 'pool_win', name: 'Rack Em', description: 'Win a match.',
      difficulty: 'easy', value: 10
    },
    { id: 'pool_8ball', name: 'Eight Ball', description: 'Win by sinking the 8.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
