(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('stack', [
    { id: 'stack_score_10', name: 'Solid Base', description: 'Reach a score of 10.',
      difficulty: 'easy', value: 10, threshold: 10
    },
    { id: 'stack_score_25', name: 'Getting High', description: 'Reach a score of 25.',
      difficulty: 'medium', value: 25, threshold: 25
    },
    { id: 'stack_score_50', name: 'Skyscraper', description: 'Reach a score of 50.',
      difficulty: 'hard', value: 50, threshold: 50
    },
    { id: 'stack_score_100', name: 'Cloud Brusher', description: 'Reach a score of 100.',
      difficulty: 'insane', value: 100, threshold: 100
    },
  ]);
})();
