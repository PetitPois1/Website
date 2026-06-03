(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('UltimateRPS', [
    { id: 'rps_first_win', name: 'Hand Winner', description: 'Win your first round.',
      difficulty: 'easy', value: 10
    },
    { id: 'rps_streak_5', name: 'Mind Reader', description: 'Win 5 rounds in a row.',
      difficulty: 'medium', value: 25
    },
    { id: 'rps_champion', name: 'RPS Champion', description: 'Win a full match.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
