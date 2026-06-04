(function () {
    const R = window.gameHubAchievementRegistry;
    if (!R) return;
    R.registerGameAchievements('connect4', [
        { id: 'connect4-first-win', name: 'First Victory', description: 'Win your first game of Connect 4', difficulty: 'easy', value: 10, statKey: 'wins', threshold: 1 },
        { id: 'connect4-5-wins', name: 'Connect 4 Champion', description: 'Win 5 games of Connect 4', difficulty: 'medium', value: 25, statKey: 'wins', threshold: 5 },
        { id: 'connect4-10-games', name: 'Connect 4 Enthusiast', description: 'Play 10 games of Connect 4', difficulty: 'easy', value: 10, statKey: 'gamesPlayed', threshold: 10 }
    ]);
})();