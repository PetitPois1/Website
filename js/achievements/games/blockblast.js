(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('blockblast', [
    { id: 'blockblast_first_clear', name: 'First Clear', description: 'Clear your first line or column.',
      difficulty: 'easy', value: 10
    },
    { id: 'blockblast_500_score', name: 'Solid Start', description: 'Score 500 in one run.',
      difficulty: 'easy', value: 10, threshold: 500
    },
    { id: 'blockblast_1000_score', name: 'Combo Artist', description: 'Score 1000 in one run.',
      difficulty: 'medium', value: 25, threshold: 1000
    },
    { id: 'blockblast_2500_score', name: 'Block Expert', description: 'Score 2500 in one run.',
      difficulty: 'hard', value: 50, threshold: 2500
    },
    { id: 'blockblast_5000_score', name: 'Blast Master', description: 'Score 5000 in one run.',
      difficulty: 'insane', value: 100, threshold: 5000
    },
    { id: 'blockblast_insane_mode', name: 'Reality Warp', description: 'Secret: You activated Insane Mode.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
