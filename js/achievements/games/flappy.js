(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('flappy', [
    { id: 'flappy_first_pipe', name: 'Take Flight', description: 'Pass your first pipe.',
      difficulty: 'easy', value: 10
    },
    { id: 'flappy_10_score', name: 'Wingman', description: 'Reach a score of 10.',
      difficulty: 'easy', value: 10, threshold: 10
    },
    { id: 'flappy_25_score', name: 'Aviator', description: 'Reach a score of 25.',
      difficulty: 'medium', value: 25, threshold: 25
    },
    { id: 'flappy_50_score', name: 'Sky Ace', description: 'Reach a score of 50.',
      difficulty: 'hard', value: 50, threshold: 50
    },
    { id: 'flappy_100_score', name: 'Cloud Ruler', description: 'Reach a score of 100.',
      difficulty: 'insane', value: 100, threshold: 100
    },
  ]);
})();
