(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('poker', [
    { id: 'poker_first_win', name: 'Showdown', description: 'Win your first hand.',
      difficulty: 'easy', value: 10
    },
    { id: 'poker_win_5', name: 'Card Shark', description: 'Win 5 hands.',
      difficulty: 'medium', value: 25
    },
    { id: 'poker_big_pot', name: 'All In', description: 'Win a pot worth 500+.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
