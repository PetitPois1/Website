(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('pacman', [
    { id: 'pacman_first_pellet', name: 'Munch', description: 'Eat your first pellet.',
      difficulty: 'easy', value: 10
    },
    { id: 'pacman_score_100', name: 'Ghost Dodger', description: 'Score 100 points.',
      difficulty: 'easy', value: 10, threshold: 100
    },
    { id: 'pacman_score_500', name: 'Maze Runner', description: 'Score 500 points.',
      difficulty: 'medium', value: 25, threshold: 500
    },
    { id: 'pacman_clear', name: 'Pellet King', description: 'Clear every pellet in the maze.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
