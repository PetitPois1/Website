(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('tower-defence', [
    { id: 'td_first_wave', name: 'Defender', description: 'Complete your first wave.',
      difficulty: 'easy', value: 10
    },
    { id: 'td_wave_5', name: 'Bloon Buster', description: 'Reach wave 5.',
      difficulty: 'easy', value: 10, threshold: 5
    },
    { id: 'td_wave_10', name: 'Fortified', description: 'Reach wave 10.',
      difficulty: 'medium', value: 25, threshold: 10
    },
    { id: 'td_wave_20', name: 'Monkey Champion', description: 'Reach wave 20.',
      difficulty: 'hard', value: 50, threshold: 20
    },
  ]);
})();
