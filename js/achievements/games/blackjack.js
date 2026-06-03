(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('blackjack', [
    { id: 'blackjack_first_win', name: 'First Win', description: 'Win your first hand.',
      difficulty: 'easy', value: 10
    },
    { id: 'blackjack_5_wins', name: 'On a Roll', description: 'Win 5 hands in total.',
      difficulty: 'medium', value: 25
    },
    { id: 'blackjack_2000_money', name: 'High Roller', description: 'Reach $2000 or more.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
