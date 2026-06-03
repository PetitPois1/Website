(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('island', [
    { id: 'island_first_minute', name: 'Survivor', description: 'Stay alive for 60 seconds.',
      difficulty: 'easy', value: 10
    },
    { id: 'island_explore', name: 'Explorer', description: 'Discover a new area on the island.',
      difficulty: 'easy', value: 10
    },
    { id: 'island_escape', name: 'Castaway No More', description: 'Complete an escape objective.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
