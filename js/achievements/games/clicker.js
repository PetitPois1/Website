(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('clicker', [
    { id: 'clicker_1_click', name: 'Novice', description: 'Click 1 time.',
      difficulty: 'easy', value: 10
    },
    { id: 'clicker_100_clicks', name: 'Grinder', description: 'Click 100 times.',
      difficulty: 'easy', value: 10
    },
    { id: 'clicker_1000_clicks', name: 'Click King', description: 'Click 1,000 times.',
      difficulty: 'medium', value: 25
    },
    { id: 'clicker_1m_credits', name: 'Wealthy', description: 'Earn 1 Million Credits.',
      difficulty: 'medium', value: 25
    },
    { id: 'clicker_1b_credits', name: 'Tycoon', description: 'Earn 1 Billion Credits.',
      difficulty: 'hard', value: 50
    },
    { id: 'clicker_1q_credits', name: 'Godhood', description: 'Earn 1 Quadrillion Credits.',
      difficulty: 'insane', value: 100
    },
    { id: 'clicker_50_pickers', name: 'Automation', description: 'Own 50 Rock Pickers.',
      difficulty: 'medium', value: 25
    },
    { id: 'clicker_era_3', name: 'Century', description: 'Reach Era 3.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
