(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('Astroids', [
    { id: 'astroids_first_1000', name: 'Rock Breaker', description: 'Score 1000.',
      difficulty: 'easy', value: 10, threshold: 1000
    },
    { id: 'astroids_score_5000', name: 'Void Ace', description: 'Score 5000.',
      difficulty: 'medium', value: 25, threshold: 5000
    },
    { id: 'astroids_wave_3', name: 'Wave Rider', description: 'Reach wave 3.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
