(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('neondash', [
    { id: 'neondash_first_run', name: 'Neon Start', description: 'Finish your first run.',
      difficulty: 'easy', value: 10
    },
    { id: 'neondash_score_1000', name: 'Dash Rookie', description: 'Score 1000.',
      difficulty: 'easy', value: 10, threshold: 1000
    },
    { id: 'neondash_score_5000', name: 'Laser Focus', description: 'Score 5000.',
      difficulty: 'medium', value: 25, threshold: 5000
    },
    { id: 'neondash_level_clear', name: 'Level Cleared', description: 'Beat a custom level.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
