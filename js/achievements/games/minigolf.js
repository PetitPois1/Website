(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('minigolf', [
    { id: 'minigolf_first_hole', name: 'Tee Time', description: 'Complete your first hole!',
      difficulty: 'easy', value: 10 },
    { id: 'minigolf_hole_in_one', name: 'Ace!', description: 'Get a hole-in-one!',
      difficulty: 'medium', value:25 },
    { id: 'minigolf_complete_green', name: 'Green Champion', description: 'Complete Green Meadows course!',
      difficulty: 'medium', value:30 },
    { id: 'minigolf_complete_western', name: 'Wild West Winner', description: 'Complete Wild West course!',
      difficulty: 'hard', value:50 },
    { id: 'minigolf_complete_space', name: 'Space Golf Master', description: 'Complete Galactic Greens course!',
      difficulty: 'insane', value:100 }
  ]);
})();
