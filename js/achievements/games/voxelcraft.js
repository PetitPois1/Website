(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('voxelcraft', [
    { id: 'voxelcraft_first_block', name: 'Builder', description: 'Place or break your first block.',
      difficulty: 'easy', value: 10
    },
    { id: 'voxelcraft_craft', name: 'Crafter', description: 'Craft an item.',
      difficulty: 'easy', value: 10
    },
    { id: 'voxelcraft_survive_night', name: 'Night Watch', description: 'Survive until morning.',
      difficulty: 'medium', value: 25
    },
    { id: 'voxelcraft_iron', name: 'Smelter', description: 'Obtain iron ingots.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
