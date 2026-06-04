(function () {
    const R = window.gameHubAchievementRegistry;
    if (!R) return;
    R.registerGameAchievements('wordscramble', [
        { id: 'wordscramble-first-word', name: 'Word Detective', description: 'Solve your first word', difficulty: 'easy', value: 10, statKey: 'wordsSolved', threshold: 1 },
        { id: 'wordscramble-10-words', name: 'Word Master', description: 'Solve 10 words', difficulty: 'medium', value: 25, statKey: 'wordsSolved', threshold: 10 },
        { id: 'wordscramble-50-words', name: 'Word Wizard', description: 'Solve 50 words', difficulty: 'hard', value: 50, statKey: 'wordsSolved', threshold: 50 },
        { id: 'wordscramble-5-games', name: 'Word Enthusiast', description: 'Play 5 games', difficulty: 'easy', value: 10, statKey: 'gamesPlayed', threshold: 5 }
    ]);
})();