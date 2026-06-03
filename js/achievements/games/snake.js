(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('snake', [
    { id: 'snake_first_apple', name: 'First Bite', description: 'Eat your first food.',
      difficulty: 'easy', value: 10
    },
    { id: 'snake_score_10', name: 'Getting Warmed Up', description: 'Reach a score of 10.',
      difficulty: 'easy', value: 10, threshold: 10
    },
    { id: 'snake_score_25', name: 'Serious Snake', description: 'Reach a score of 25.',
      difficulty: 'medium', value: 25, threshold: 25
    },
    { id: 'snake_score_50', name: 'Snake Master', description: 'Reach a score of 50.',
      difficulty: 'hard', value: 50, threshold: 50
    },
    { id: 'snake_score_100', name: 'Snake God', description: 'Reach a score of 100.',
      difficulty: 'insane', value: 100, threshold: 100
    },
    { id: 'snake_total_100', name: 'Fruit Salad', description: 'Eat 100 fruit in total.',
      difficulty: 'medium', value: 25
    },
    { id: 'snake_total_500', name: 'Hungry Hungry Snake', description: 'Eat 500 fruit in total.',
      difficulty: 'hard', value: 50
    },
    { id: 'snake_total_1000', name: 'Fruit Extinction', description: 'Eat 1000 fruit in total.',
      difficulty: 'insane', value: 100
    },
    { id: 'snake_complete', name: 'Board Master', description: 'Fill the entire board with the snake.',
      difficulty: 'insane', value: 150
    },
  ]);
})();
