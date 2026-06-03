(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('brick', [
    { id: 'brick_first_break', name: 'Cracked', description: 'Break your first brick.',
      difficulty: 'easy', value: 10
    },
    { id: 'brick_1000_score', name: 'Score Seeker', description: 'Reach 1000 credits.',
      difficulty: 'easy', value: 10, threshold: 1000
    },
    { id: 'brick_5000_score', name: 'High Breaker', description: 'Reach 5000 credits.',
      difficulty: 'medium', value: 25, threshold: 5000
    },
    { id: 'brick_10000_score', name: 'Brick Annihilator', description: 'Reach 10000 credits.',
      difficulty: 'hard', value: 50, threshold: 10000
    },
    { id: 'brick_insane_mode', name: 'Overclocked', description: 'Secret: You activated Insane Mode.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
