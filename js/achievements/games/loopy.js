(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('loopy', [
    { id: 'loopy_first_solve', name: 'Loop Closed', description: 'Solve your first puzzle.',
      difficulty: 'easy', value: 10
    },
    { id: 'loopy_solve_5', name: 'Pathfinder', description: 'Solve 5 puzzles.',
      difficulty: 'medium', value: 25
    },
    { id: 'loopy_hard', name: 'Brain Bender', description: 'Solve a hard puzzle.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
