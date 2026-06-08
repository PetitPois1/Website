/**
 * Game Hub Update Log
 * To add a new update, simply add a new object to the UPDATES array!
 */
const UPDATES = [
  {
    id: "2026-06-08-bug-fixes",
    date: "June 8, 2026",
    title: "Bug Fixes & Improvements",
    icon: "🔧",
    categories: [
      {
        title: "Bug Fixes",
        items: [
          "Fixed Chess game online sync race condition",
          "Fixed XSS vulnerabilities in Chess lobby and active players display",
          "Fixed footer link from updates.html to upcoming.html",
          "Corrected 'Astroids' spelling to 'Asteroids'",
          "Fixed Mining game beta flag inconsistency",
        ],
      },
      {
        title: "Improvements",
        items: [
          "Made 'PLAY NOW' buttons visible on mobile",
          "Added favicon to all pages",
          "Added meta description for better SEO",
          "Pinned Tailwind CSS to version 3.4.1 for stability",
          "Created file naming convention documentation",
          "Added Update Log page and navigation",
        ],
      },
    ],
  },
  {
    id: "2026-06-04-add-games",
    date: "June 4, 2026",
    title: "New Games Added",
    icon: "🎮",
    categories: [
      {
        title: "New Games & Features",
        items: [
          "Added Chess game with online multiplayer support",
          "Added Connect4 and Word Scramble games",
          "Improved achievement system and profile catalog",
          "Updated firestore rules",
        ],
      },
    ],
  },
  {
    id: "2026-06-03-fixes-improvements",
    date: "June 3, 2026",
    title: "Major Site Overhaul",
    icon: "✨",
    categories: [
      {
        title: "Site Improvements",
        items: [
          "Added unified theme system (js/theme.js)",
          "Added hub navigation bar (js/hub-nav.js)",
          "Updated CSS with hub-site.css for consistency",
          "Added profile page improvements",
          "Organized assets into proper folders (images, voxelcraft-textures)",
          "Created documentation in docs/ folder",
        ],
      },
      {
        title: "Achievement System",
        items: [
          "Rewrote achievements system",
          "Created bundle script for achievements (scripts/bundle-achievements.py)",
          "Added achievements helpers and registry",
        ],
      },
    ],
  },
  {
    id: "2026-03-27-asteroids",
    date: "March 27, 2026",
    title: "Asteroids Added",
    icon: "☄️",
    categories: [
      {
        title: "New Games",
        items: ["Added Asteroids game"],
      },
    ],
  },
  {
    id: "2026-03-20-rps-update",
    date: "March 20, 2026",
    title: "RPS Improvements",
    icon: "✂️",
    categories: [
      {
        title: "Updates",
        items: ["Updated Ultimate Rock Paper Scissors game"],
      },
    ],
  },
  {
    id: "initial",
    date: "Earlier",
    title: "Initial Launch",
    icon: "🚀",
    categories: [
      {
        title: "First Release",
        items: ["Launched Game Hub with initial games"],
      },
    ],
  },
];

function formatDateForInput(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderUpdates() {
  const container = document.getElementById("updates-container");
  if (!container) return;

  if (UPDATES.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 text-theme-muted">
        <p class="text-4xl mb-4">📜</p>
        <p class="text-lg">No updates yet — check back soon!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = UPDATES.map((update) => {
    const categoriesHtml = update.categories
      .map((cat) => {
        const itemsHtml = cat.items
          .map((item) => `<li class="flex items-start gap-3 py-1">
              <span class="text-theme-primary mt-1">•</span>
              <span class="text-theme-muted">${item}</span>
            </li>`)
          .join("");
        return `
          <div class="mb-6 last:mb-0">
            <h3 class="text-lg font-bold mb-3 text-theme-main">${cat.title}</h3>
            <ul class="space-y-1">
              ${itemsHtml}
            </ul>
          </div>
        `;
      })
      .join("");

    return `
      <div class="hub-card hub-card-lg mb-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="text-3xl">${update.icon}</div>
          <div class="flex-1">
            <p class="text-sm text-theme-primary font-bold mb-1">${update.date}</p>
            <h2 class="text-2xl font-extrabold">${update.title}</h2>
          </div>
        </div>
        <div class="border-t border-theme-border pt-4">
          ${categoriesHtml}
        </div>
      </div>
    `;
  }).join("");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderUpdates);
} else {
  renderUpdates();
}
