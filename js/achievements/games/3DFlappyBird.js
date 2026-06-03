(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('3DFlappyBird', [
    { id: 'flappy3d_first_pipe', name: 'Lift Off', description: 'Pass your first obstacle.',
      difficulty: 'easy', value: 10
    },
    { id: 'flappy3d_score_10', name: 'Altitude 10', description: 'Score 10.',
      difficulty: 'easy', value: 10, threshold: 10
    },
    { id: 'flappy3d_score_25', name: 'Sky Walker', description: 'Score 25.',
      difficulty: 'medium', value: 25, threshold: 25
    },
  ]);
})();
