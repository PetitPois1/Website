# Adding a New Game to Game Hub

Follow these steps to add a new game to the Game Hub website.

## Step 1: Create Your Game HTML File
Create your game's HTML file in the root directory (e.g., `mygame.html`).

### Requirements for Your Game HTML
Make sure your game includes:
1. The theme system:
   ```html
   <script src="js/theme.js"></script>
   ```
2. Use CSS variables from the theme system instead of hardcoding colors:
   - `--bg-dark`: Main background color
   - `--primary`: Primary accent color
   - `--primary-dark`: Darker version of primary color
   - `--card-bg`: Background color for cards/elements
   - `--text-main`: Main text color
   - `--text-muted`: Muted text color
   - `--border-color`: Border color for elements

   Example:
   ```css
   body {
     background-color: var(--bg-dark);
     background-image:
       radial-gradient(circle at 0% 0%, var(--theme-glow) 0%, transparent 50%),
       radial-gradient(circle at 100% 100%, var(--theme-glow-secondary) 0%, transparent 50%);
     color: var(--text-main);
     padding-top: 80px; /* For nav bar */
   }
   ```
3. Include achievement helpers and related scripts:
   ```html
   <script src="js/firebase-config.js"></script>
   <script src="js/firebase-init.js"></script>
   <script src="js/progress.js"></script>
   <script src="js/achievements/registry.js"></script>
   <script src="js/achievements/helpers.js"></script>
   <script src="js/achievements/definitions-bundle.js"></script>
   <script src="js/achievements.js"></script>
   <script src="js/auth.js"></script>
   <script src="js/game-hub-common.js"></script>
   ```
4. A unique `game-hub-id` meta tag:
   ```html
   <meta name="game-hub-id" content="mygame">
   ```

## Step 2: Add Your Game to Index.html
Add your game to the games list in `index.html`.

## Step 3: Add Game Metadata to Profile Catalog
Update `js/profile-catalog.js` and add your game to the `GAME_META` object:
```javascript
const GAME_META = {
  // ... existing games ...
  mygame: {
    name: "My Awesome Game",
    icon: "🎮",
    tagline: "Fun game description",
    statLabel: "High Score",
    progressKey: "highScore"
  }
};
```

## Step 4: Add Achievements
Create an achievements file for your game in `js/achievements/games/mygame.js`, then rebuild the definitions bundle.

## Step 5: Update Firestore Rules (If Needed)
If your game uses online features (like multiplayer), update `firestore.rules`.

## Step 6: Test
Test your game locally to make sure it works with the theme system and achievements!
