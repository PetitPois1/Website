(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('mining', [
    { id: 'mining_depth_100', name: 'Surface Scraper', description: 'Reach 100m depth.',
      difficulty: 'easy', value: 10, threshold: 100
    },
    { id: 'mining_depth_500', name: 'Deep Diver', description: 'Reach 500m depth.',
      difficulty: 'medium', value: 25, threshold: 500
    },
    { id: 'mining_depth_1000', name: 'Abyssal Miner', description: 'Reach 1000m depth.',
      difficulty: 'hard', value: 50, threshold: 1000
    },
    { id: 'mining_total_100', name: 'Ore Collector', description: 'Mine 100 ores in total.',
      difficulty: 'easy', value: 10
    },
    { id: 'mining_total_1000', name: 'Mineral Magnate', description: 'Mine 1000 ores in total.',
      difficulty: 'medium', value: 25
    },
    { id: 'mining_total_5000', name: 'Core Master', description: 'Mine 5000 ores in total.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
