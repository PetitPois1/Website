(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('pong', [
    { id: 'pong_first_point', name: 'On The Board', description: 'Score your first point.',
      difficulty: 'easy', value: 10
    },
    { id: 'pong_score_3', name: 'Rally Starter', description: 'Reach 3 points in a match.',
      difficulty: 'easy', value: 10, threshold: 3
    },
    { id: 'pong_score_5', name: 'Table Terror', description: 'Reach 5 points in a match.',
      difficulty: 'medium', value: 25, threshold: 5
    },
    { id: 'pong_score_10', name: 'Pong Legend', description: 'Reach 10 points in a match.',
      difficulty: 'hard', value: 50, threshold: 10
    },
  ]);
})();
