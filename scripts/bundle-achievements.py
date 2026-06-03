#!/usr/bin/env python3
"""Concatenate js/achievements/games/*.js into js/achievements/definitions-bundle.js"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAMES_DIR = ROOT / "js" / "achievements" / "games"
OUT = ROOT / "js" / "achievements" / "definitions-bundle.js"

def main():
    parts = [
        "/* AUTO-GENERATED — run: python3 scripts/bundle-achievements.py */\n",
        "(function () {\n",
    ]
    files = sorted(GAMES_DIR.glob("*.js"))
    if not files:
        raise SystemExit(f"No game files in {GAMES_DIR}")
    for f in files:
        parts.append(f"  // --- {f.name} ---\n")
        parts.append(f.read_text(encoding="utf-8"))
        if not parts[-1].endswith("\n"):
            parts.append("\n")
    parts.append("})();\n")
    OUT.write_text("".join(parts), encoding="utf-8")
    print(f"Wrote {OUT} ({len(files)} game files)")

if __name__ == "__main__":
    main()
