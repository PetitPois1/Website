# Project structure

```
Website/
├── index.html              # Game Hub home (catalog, auth, likes)
├── profile.html            # Account, stats, achievements per game
├── settings.html           # User settings
├── about.html, feedback.html, bugs.html, upcoming.html
├── *.html                  # Individual games (one file per game)
├── firestore.rules         # Deploy to Firebase Console
│
├── assets/
│   ├── images/             # Shared images (e.g. FPS textures)
│   ├── voxelcraft-textures/
│   └── NeonDashLevels.txt
│
├── css/
│   └── hub-site.css        # Shared hub page layout + nav styles
├── js/
│   ├── firebase-config.js  # Your Firebase web config
│   ├── firebase-init.js
│   ├── theme.js
│   ├── hub-avatar.js       # Avatar SVG renderer + profile shop catalog            # Global themes (all pages)
│   ├── hub-nav.js          # Unified nav on hub pages
│   ├── auth.js             # Sign-in modal, session
│   ├── progress.js         # Saves, leaderboards, unlockAchievement
│   ├── game-hub-common.js  # Compact bar in games
│   └── achievements/       # See docs/ACHIEVEMENTS.md
│
├── docs/
│   ├── ACHIEVEMENTS.md
│   ├── PROJECT_STRUCTURE.md
│   ├── FIREBASE_EMAIL_VERIFICATION.md
│   └── FIRESTORE_RULES_REVIEW.md
│
└── scripts/
    └── bundle-achievements.py
```

## Conventions

- **Game id**: Same string in `index.html` catalog, `<meta name="game-hub-id">`, achievement registry, and `saveGameProgress(gameId, ...)`.
- **Scripts order** on game pages: Firebase → config → init → progress → achievements (registry, helpers, bundle, main) → auth → game-hub-common.
- **Immersive layout** (full-screen games): add `<meta name="game-hub-layout" content="immersive">` so the top bar does not push the canvas; offsets are in `game-hub-common.js` per game id.

## Local preview

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/index.html
