(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('Hades', [
    { id: 'hades_first_room', name: 'Descent', description: 'Clear your first chamber.',
      difficulty: 'easy', value: 10
    },
    { id: 'hades_boss', name: 'Underworld Hero', description: 'Defeat a boss.',
      difficulty: 'hard', value: 50
    },
    { id: 'hades_depth_5', name: 'Deep Delver', description: 'Reach depth 5.',
      difficulty: 'medium', value: 25
    },
  ]);
})();
