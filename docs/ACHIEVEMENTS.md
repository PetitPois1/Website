# Adding achievements to a game

Game Hub achievements are modular: one file per game, bundled for the browser, unlocked from game code via shared helpers.

## File layout

```
js/achievements/
  registry.js              # registerGameAchievements(gameId, list)
  helpers.js               # unlock(), checkThresholds(), etc.
  games/                   # one source file per game (edit these)
    snake.js
    pong.js
    ...
  definitions-bundle.js    # AUTO-GENERATED — do not edit by hand
js/achievements.js         # modal UI, banners, leaderboard modal
```

## 1. Define achievements

Create or edit `js/achievements/games/<game-id>.js`:

```javascript
(function () {
  const R = window.gameHubAchievementRegistry;
  if (!R) return;
  R.registerGameAchievements("pong", [
    {
      id: "pong_score_10",
      name: "Pong Legend",
      description: "Reach 10 points in a match.",
      difficulty: "hard",  // easy | medium | hard | insane
      value: 50,             // coins awarded when unlocked (signed-in users)
      threshold: 10,         // optional — used with checkThresholdAchievements()
    },
  ]);
})();
```

Rules:

- `id` must be unique across the entire hub (prefix with game id, e.g. `pong_score_10`).
- `game-id` must match `<meta name="game-hub-id" content="...">` on the game page and the hub catalog `id` in `index.html`.
- Secret achievements: put `Secret:` in the description; locked state shows `???` in the modal.

### Coin rewards

When a user is **signed in**, `progress.js` awards hub coins on first unlock and stores the achievement under `users/{uid}/achievements/{achievementId}`.

Default rewards by `difficulty` (override with `value` on the definition):

| Difficulty | Coins |
|------------|-------|
| easy       | 10    |
| medium     | 25    |
| hard       | 50    |
| insane     | 100   |

`registry.getCoinReward(def)` resolves the payout. The achievements modal and profile page show `+N 🪙` per achievement. Guest unlocks are saved locally; signing in runs `syncAchievementsToAccount()` to upload and grant coins once.

## 2. Rebuild the bundle

After adding or changing any file in `js/achievements/games/`:

```bash
python3 scripts/bundle-achievements.py
```

Commit both the game file and `js/achievements/definitions-bundle.js`.

## 3. Load scripts on the game page

In the game HTML `<head>` (after `progress.js`, before `auth.js`):

```html
<script src="js/achievements/registry.js"></script>
<script src="js/achievements/helpers.js"></script>
<script src="js/achievements/definitions-bundle.js"></script>
<script src="js/achievements.js"></script>
```

Most games already include this block.

## 4. Unlock from game code

**Score milestones** (uses `threshold` on definitions):

```javascript
if (window.gameHubAchievements) {
  window.gameHubAchievements.checkThresholdAchievements("pong", playerScore);
}
```

Or when saving a high score via Game Hub common helpers (automatic):

```javascript
await window.gameHubCommon.saveHighScore("pong", score, "pongHighScore");
```

**One-off events:**

```javascript
if (window.gameHubAchievementHelpers) {
  window.gameHubAchievementHelpers.unlock("pong", "pong_first_point");
}
```

**Custom thresholds map:**

```javascript
window.gameHubAchievementHelpers.checkThresholds("clicker", totalClicks, {
  clicker_100_clicks: 100,
  clicker_1000_clicks: 1000,
});
```

Progress is stored locally always; signed-in users also sync to Firestore (`users/{uid}/achievements/{achievementId}`) and earn coins.

## 5. UI labels

Use **Achievements** everywhere (top bar, in-game buttons, profile). The modal title is always “Achievements”.

The hub chrome adds an **Achievements** button when the game has at least one definition.

## Global achievement

`perfectionist` in `js/achievements/games/global.js` unlocks when every non-global achievement is earned. It is checked automatically after each unlock.

## Checklist for a new game

1. Add `meta name="game-hub-id"` on the game page.
2. Add `js/achievements/games/<game-id>.js`.
3. Run `python3 scripts/bundle-achievements.py`.
4. Call `unlock()` / `checkThresholdAchievements()` at the right moments in game logic.
5. Test signed out (local) and signed in (Firestore + coin toast).
