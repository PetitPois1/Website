(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('forpiece', [
    { id: 'forpiece_set_sail', name: 'Set Sail', description: 'Leave the starting island.',
      difficulty: 'easy', value: 10
    },
    { id: 'forpiece_treasure', name: 'Treasure Hunter', description: 'Find buried treasure.',
      difficulty: 'medium', value: 25
    },
    { id: 'forpiece_fleet', name: 'Admiral', description: 'Command 3 ships.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
