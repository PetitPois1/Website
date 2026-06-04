(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('chess', [
    { id: 'chess-win', name: 'Checkmate!', description: 'Win your first chess game.', difficulty: 'easy', value: 10 },
    { id: 'chess-5-wins', name: 'Chess Master', description: 'Win 5 chess games.', difficulty: 'medium', value: 25 },
    { id: 'chess-960', name: 'Fischer Fan', description: 'Play a game of Chess960.', difficulty: 'easy', value: 10 },
    { id: 'chess-king-hill', name: 'King of the Hill', description: 'Win a game of King of the Hill.', difficulty: 'medium', value: 25 },
    { id: 'chess-three-check', name: 'Three Check Champion', description: 'Win a game of Three Check.', difficulty: 'medium', value: 25 },
    { id: 'chess-ai-hard', name: 'Beat the Grandmaster', description: 'Win a game against the hard AI.', difficulty: 'hard', value: 50 },
    { id: 'chess-online-win', name: 'Online Victor', description: 'Win an online chess match.', difficulty: 'hard', value: 50 }
  ]);
})();