/* AUTO-GENERATED — run: python3 scripts/bundle-achievements.py */
(function () {
  // --- 3DFlappyBird.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('3DFlappyBird', [
    { id: 'flappy3d_first_pipe', name: 'Lift Off', description: 'Pass your first obstacle.',
      difficulty: 'easy', value: 10
    },
    { id: 'flappy3d_score_10', name: 'Altitude 10', description: 'Score 10.',
      difficulty: 'easy', value: 10, threshold: 10
    },
    { id: 'flappy3d_score_25', name: 'Sky Walker', description: 'Score 25.',
      difficulty: 'medium', value: 25, threshold: 25
    },
  ]);
})();
  // --- Astroids.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('Astroids', [
    { id: 'astroids_first_1000', name: 'Rock Breaker', description: 'Score 1000.',
      difficulty: 'easy', value: 10, threshold: 1000
    },
    { id: 'astroids_score_5000', name: 'Void Ace', description: 'Score 5000.',
      difficulty: 'medium', value: 25, threshold: 5000
    },
    { id: 'astroids_wave_3', name: 'Wave Rider', description: 'Reach wave 3.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- Hades.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('Hades', [
    { id: 'hades_first_room', name: 'Descent', description: 'Clear your first chamber.',
      difficulty: 'easy', value: 10
    },
    { id: 'hades_boss', name: 'Underworld Hero', description: 'Defeat a boss.',
      difficulty: 'hard', value: 50
    },
    { id: 'hades_depth_5', name: 'Deep Delver', description: 'Reach depth 5.',
      difficulty: 'medium', value: 25
    },
  ]);
})();
  // --- UltimateRPS.js ---
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
  // --- blackjack.js ---
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
  // --- blockblast.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('blockblast', [
    { id: 'blockblast_first_clear', name: 'First Clear', description: 'Clear your first line or column.',
      difficulty: 'easy', value: 10
    },
    { id: 'blockblast_500_score', name: 'Solid Start', description: 'Score 500 in one run.',
      difficulty: 'easy', value: 10, threshold: 500
    },
    { id: 'blockblast_1000_score', name: 'Combo Artist', description: 'Score 1000 in one run.',
      difficulty: 'medium', value: 25, threshold: 1000
    },
    { id: 'blockblast_2500_score', name: 'Block Expert', description: 'Score 2500 in one run.',
      difficulty: 'hard', value: 50, threshold: 2500
    },
    { id: 'blockblast_5000_score', name: 'Blast Master', description: 'Score 5000 in one run.',
      difficulty: 'insane', value: 100, threshold: 5000
    },
    { id: 'blockblast_insane_mode', name: 'Reality Warp', description: 'Secret: You activated Insane Mode.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- brick.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('brick', [
    { id: 'brick_first_break', name: 'Cracked', description: 'Break your first brick.',
      difficulty: 'easy', value: 10
    },
    { id: 'brick_1000_score', name: 'Score Seeker', description: 'Reach 1000 credits.',
      difficulty: 'easy', value: 10, threshold: 1000
    },
    { id: 'brick_5000_score', name: 'High Breaker', description: 'Reach 5000 credits.',
      difficulty: 'medium', value: 25, threshold: 5000
    },
    { id: 'brick_10000_score', name: 'Brick Annihilator', description: 'Reach 10000 credits.',
      difficulty: 'hard', value: 50, threshold: 10000
    },
    { id: 'brick_insane_mode', name: 'Overclocked', description: 'Secret: You activated Insane Mode.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- chess.js ---
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
  // --- clicker.js ---
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
  // --- connect4.js ---
(function () {
    const R = window.gameHubAchievementRegistry;
    if (!R) return;
    R.registerGameAchievements('connect4', [
        { id: 'connect4-first-win', name: 'First Victory', description: 'Win your first game of Connect 4', difficulty: 'easy', value: 10, statKey: 'wins', threshold: 1 },
        { id: 'connect4-5-wins', name: 'Connect 4 Champion', description: 'Win 5 games of Connect 4', difficulty: 'medium', value: 25, statKey: 'wins', threshold: 5 },
        { id: 'connect4-10-games', name: 'Connect 4 Enthusiast', description: 'Play 10 games of Connect 4', difficulty: 'easy', value: 10, statKey: 'gamesPlayed', threshold: 10 }
    ]);
})();
  // --- flappy.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('flappy', [
    { id: 'flappy_first_pipe', name: 'Take Flight', description: 'Pass your first pipe.',
      difficulty: 'easy', value: 10
    },
    { id: 'flappy_10_score', name: 'Wingman', description: 'Reach a score of 10.',
      difficulty: 'easy', value: 10, threshold: 10
    },
    { id: 'flappy_25_score', name: 'Aviator', description: 'Reach a score of 25.',
      difficulty: 'medium', value: 25, threshold: 25
    },
    { id: 'flappy_50_score', name: 'Sky Ace', description: 'Reach a score of 50.',
      difficulty: 'hard', value: 50, threshold: 50
    },
    { id: 'flappy_100_score', name: 'Cloud Ruler', description: 'Reach a score of 100.',
      difficulty: 'insane', value: 100, threshold: 100
    },
  ]);
})();
  // --- forpiece.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('forpiece', [
    { id: 'forpiece_set_sail', name: 'Set Sail', description: 'Leave the starting island.',
      difficulty: 'easy', value: 10
    },
    { id: 'forpiece_treasure', name: 'Treasure Hunter', description: 'Find buried treasure.',
      difficulty: 'medium', value: 25
    },
    { id: 'forpiece_fleet', name: 'Admiral', description: 'Command 3 ships.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- global.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('global', [
    { id: 'perfectionist', name: 'The Perfectionist', description: 'Unlock every other achievement in the Game Hub.',
      difficulty: 'insane', value: 500
    },
  ]);
})();
  // --- island.js ---
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
  // --- loopy.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('loopy', [
    { id: 'loopy_first_solve', name: 'Loop Closed', description: 'Solve your first puzzle.',
      difficulty: 'easy', value: 10
    },
    { id: 'loopy_solve_5', name: 'Pathfinder', description: 'Solve 5 puzzles.',
      difficulty: 'medium', value: 25
    },
    { id: 'loopy_hard', name: 'Brain Bender', description: 'Solve a hard puzzle.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- mining.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('mining', [
    { id: 'mining_depth_100', name: 'Surface Scraper', description: 'Reach 100m depth.',
      difficulty: 'easy', value: 10, threshold: 100
    },
    { id: 'mining_depth_500', name: 'Deep Diver', description: 'Reach 500m depth.',
      difficulty: 'medium', value: 25, threshold: 500
    },
    { id: 'mining_depth_1000', name: 'Abyssal Miner', description: 'Reach 1000m depth.',
      difficulty: 'hard', value: 50, threshold: 1000
    },
    { id: 'mining_total_100', name: 'Ore Collector', description: 'Mine 100 ores in total.',
      difficulty: 'easy', value: 10
    },
    { id: 'mining_total_1000', name: 'Mineral Magnate', description: 'Mine 1000 ores in total.',
      difficulty: 'medium', value: 25
    },
    { id: 'mining_total_5000', name: 'Core Master', description: 'Mine 5000 ores in total.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- neondash.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('neondash', [
    { id: 'neondash_first_run', name: 'Neon Start', description: 'Finish your first run.',
      difficulty: 'easy', value: 10
    },
    { id: 'neondash_score_1000', name: 'Dash Rookie', description: 'Score 1000.',
      difficulty: 'easy', value: 10, threshold: 1000
    },
    { id: 'neondash_score_5000', name: 'Laser Focus', description: 'Score 5000.',
      difficulty: 'medium', value: 25, threshold: 5000
    },
    { id: 'neondash_level_clear', name: 'Level Cleared', description: 'Beat a custom level.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- pacman.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('pacman', [
    { id: 'pacman_first_pellet', name: 'Munch', description: 'Eat your first pellet.',
      difficulty: 'easy', value: 10
    },
    { id: 'pacman_score_100', name: 'Ghost Dodger', description: 'Score 100 points.',
      difficulty: 'easy', value: 10, threshold: 100
    },
    { id: 'pacman_score_500', name: 'Maze Runner', description: 'Score 500 points.',
      difficulty: 'medium', value: 25, threshold: 500
    },
    { id: 'pacman_clear', name: 'Pellet King', description: 'Clear every pellet in the maze.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- poker.js ---
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
  // --- pong.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('pong', [
    { id: 'pong_first_point', name: 'On The Board', description: 'Score your first point.',
      difficulty: 'easy', value: 10
    },
    { id: 'pong_score_3', name: 'Rally Starter', description: 'Reach 3 points in a match.',
      difficulty: 'easy', value: 10, threshold: 3
    },
    { id: 'pong_score_5', name: 'Table Terror', description: 'Reach 5 points in a match.',
      difficulty: 'medium', value: 25, threshold: 5
    },
    { id: 'pong_score_10', name: 'Pong Legend', description: 'Reach 10 points in a match.',
      difficulty: 'hard', value: 50, threshold: 10
    },
  ]);
})();
  // --- pool.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('pool', [
    { id: 'pool_first_pocket', name: 'Corner Pocket', description: 'Pot your first ball.',
      difficulty: 'easy', value: 10
    },
    { id: 'pool_win', name: 'Rack Em', description: 'Win a match.',
      difficulty: 'easy', value: 10
    },
    { id: 'pool_8ball', name: 'Eight Ball', description: 'Win by sinking the 8.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- snake.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('snake', [
    { id: 'snake_first_apple', name: 'First Bite', description: 'Eat your first food.',
      difficulty: 'easy', value: 10
    },
    { id: 'snake_score_10', name: 'Getting Warmed Up', description: 'Reach a score of 10.',
      difficulty: 'easy', value: 10, threshold: 10
    },
    { id: 'snake_score_25', name: 'Serious Snake', description: 'Reach a score of 25.',
      difficulty: 'medium', value: 25, threshold: 25
    },
    { id: 'snake_score_50', name: 'Snake Master', description: 'Reach a score of 50.',
      difficulty: 'hard', value: 50, threshold: 50
    },
    { id: 'snake_score_100', name: 'Snake God', description: 'Reach a score of 100.',
      difficulty: 'insane', value: 100, threshold: 100
    },
    { id: 'snake_total_100', name: 'Fruit Salad', description: 'Eat 100 fruit in total.',
      difficulty: 'medium', value: 25
    },
    { id: 'snake_total_500', name: 'Hungry Hungry Snake', description: 'Eat 500 fruit in total.',
      difficulty: 'hard', value: 50
    },
    { id: 'snake_total_1000', name: 'Fruit Extinction', description: 'Eat 1000 fruit in total.',
      difficulty: 'insane', value: 100
    },
    { id: 'snake_complete', name: 'Board Master', description: 'Fill the entire board with the snake.',
      difficulty: 'insane', value: 150
    },
  ]);
})();
  // --- stack.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('stack', [
    { id: 'stack_score_10', name: 'Solid Base', description: 'Reach a score of 10.',
      difficulty: 'easy', value: 10, threshold: 10
    },
    { id: 'stack_score_25', name: 'Getting High', description: 'Reach a score of 25.',
      difficulty: 'medium', value: 25, threshold: 25
    },
    { id: 'stack_score_50', name: 'Skyscraper', description: 'Reach a score of 50.',
      difficulty: 'hard', value: 50, threshold: 50
    },
    { id: 'stack_score_100', name: 'Cloud Brusher', description: 'Reach a score of 100.',
      difficulty: 'insane', value: 100, threshold: 100
    },
  ]);
})();
  // --- swordbattle.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('swordbattle', [
    { id: 'swordbattle_first_kill', name: 'First Blood', description: 'Defeat another player.',
      difficulty: 'easy', value: 10
    },
    { id: 'swordbattle_kills_10', name: 'Duelist', description: 'Get 10 defeats.',
      difficulty: 'medium', value: 25
    },
    { id: 'swordbattle_kills_50', name: 'Arena Lord', description: 'Get 50 defeats.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- tic_tac_toe.js ---
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
  // --- tower_defence.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('tower-defence', [
    { id: 'td_first_wave', name: 'Defender', description: 'Complete your first wave.',
      difficulty: 'easy', value: 10
    },
    { id: 'td_wave_5', name: 'Bloon Buster', description: 'Reach wave 5.',
      difficulty: 'easy', value: 10, threshold: 5
    },
    { id: 'td_wave_10', name: 'Fortified', description: 'Reach wave 10.',
      difficulty: 'medium', value: 25, threshold: 10
    },
    { id: 'td_wave_20', name: 'Monkey Champion', description: 'Reach wave 20.',
      difficulty: 'hard', value: 50, threshold: 20
    },
  ]);
})();
  // --- voxelcraft.js ---
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements('voxelcraft', [
    { id: 'voxelcraft_first_block', name: 'Builder', description: 'Place or break your first block.',
      difficulty: 'easy', value: 10
    },
    { id: 'voxelcraft_craft', name: 'Crafter', description: 'Craft an item.',
      difficulty: 'easy', value: 10
    },
    { id: 'voxelcraft_survive_night', name: 'Night Watch', description: 'Survive until morning.',
      difficulty: 'medium', value: 25
    },
    { id: 'voxelcraft_iron', name: 'Smelter', description: 'Obtain iron ingots.',
      difficulty: 'hard', value: 50
    },
  ]);
})();
  // --- wordscramble.js ---
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
})();
