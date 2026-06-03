(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('tic-tac-toe', [
    { id: 'ttt_first_win', name: 'Three in a Row', description: 'Win your first match.',
      difficulty: 'easy', value: 10
    },
    { id: 'ttt_win_5', name: 'Grid Master', description: 'Win 5 matches in total.',
      difficulty: 'medium', value: 25
    },
    { id: 'ttt_online_win', name: 'Net Victor', description: 'Win an online match.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
