# Game Hub

A static arcade portal hosted on GitHub Pages with Firebase auth, cloud saves, leaderboards, and achievements.

## Quick start

1. Copy `js/firebase-config.example.js` to `js/firebase-config.js` with your Firebase web app config (or keep the repo file if this is your project).
2. Serve locally: `python3 -m http.server 8765 --bind 127.0.0.1`
3. Open http://127.0.0.1:8765/index.html

## Before publishing

- Deploy `firestore.rules` in the Firebase Console.
- Confirm `.gitignore` excludes local secrets (`*.local.js`, `.env`, `**/Secret`, `backup_original_do_not_edit/`).
- Run `python3 scripts/bundle-achievements.py` after editing achievement definitions.

## Docs

- [Project structure](docs/PROJECT_STRUCTURE.md)
- [Adding achievements](docs/ACHIEVEMENTS.md)
- [Firestore rules](firestore.rules) — deploy in Firebase Console → Firestore → Rules
- [Email verification](docs/FIREBASE_EMAIL_VERIFICATION.md)

## Achievements

Definitions live in `js/achievements/games/`. After editing, run:

```bash
python3 scripts/bundle-achievements.py
```

See [docs/ACHIEVEMENTS.md](docs/ACHIEVEMENTS.md) for the full workflow.
