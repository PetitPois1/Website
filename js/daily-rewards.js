(function() {
    const REWARDS = [10,15,20,30,50,75,100];

    // Get today's date string (UTC)
    function getUtcDateString() {
        const d = new Date();
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
    }

    // Check and show reward if needed
    async function checkAndShowReward() {
        const user = window.gameHubAuth && window.gameHubAuth.getCurrentUser ? window.gameHubAuth.getCurrentUser() : null;
        const db = window.gameHubFirebase && window.gameHubFirebase.db;
        const todayStr = getUtcDateString();
        
        let lastLoginReward = null;
        let loginStreak = 1;
        
        // First check localStorage
        try {
            const stored = JSON.parse(localStorage.getItem('gamehub_daily_reward') || '{}');
            if (stored.lastLoginReward) lastLoginReward = stored.lastLoginReward;
            if (stored.loginStreak) loginStreak = stored.loginStreak;
        } catch(e) {}
        
        // If signed in, check Firestore for latest data
        if (user && db) {
            try {
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    const data = doc.data();
                    if (data.lastLoginReward) lastLoginReward = data.lastLoginReward;
                    if (data.loginStreak) loginStreak = data.loginStreak;
                }
            } catch(e) {
                console.warn('[DailyRewards] Firestore check failed', e);
            }
        }
        
        // Check if already claimed today
        if (lastLoginReward === todayStr) return;
        
        // Check if streak should reset
        let shouldReset = false;
        if (lastLoginReward) {
            const lastDate = new Date(lastLoginReward);
            const today = new Date(todayStr);
            const diffMs = today - lastDate;
            const diffDays = Math.floor(diffMs / (1000*60*60*24));
            if (diffDays > 1) {
                shouldReset = true;
            }
        }
        
        let newStreak = shouldReset ? 1 : (lastLoginReward ? loginStreak + 1 : 1);
        if (newStreak > 7) newStreak = 1;
        const rewardCoins = REWARDS[newStreak - 1];
        
        // Show reward modal
        showRewardModal(newStreak, rewardCoins, async () => {
            // Grant coins via progress.js
            if (window.gameHubProgress && window.gameHubProgress.addCoins) {
                window.gameHubProgress.addCoins(rewardCoins);
            }
            // Add 5 XP via xp-system
            if (window.gameHubXP && window.gameHubXP.addXP) {
                window.gameHubXP.addXP(5, 'daily-login');
            }
            // Save locally
            const saveObj = { lastLoginReward: todayStr, loginStreak: newStreak };
            localStorage.setItem('gamehub_daily_reward', JSON.stringify(saveObj));
            // Save to Firestore
            if (user && db) {
                try {
                    await db.collection('users').doc(user.uid).set(saveObj, { merge: true });
                } catch(e) {
                    console.warn('[DailyRewards] Firestore save failed', e);
                }
            }
        });
        
        // Add streak indicator to nav if possible
        updateNavStreakIndicator(newStreak);
    }

    // Show the reward modal
    function showRewardModal(streak, coins, onClaim) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/80" id="daily-reward-bg"></div>
            <div class="relative z-10 p-8 rounded-3xl max-w-md w-full" style="background: var(--card-bg); border: 1px solid var(--border-color);">
                <h2 class="text-3xl font-extrabold mb-2 text-center" style="color: var(--text-main);">🎁 Daily Reward!</h2>
                <p class="text-center mb-6" style="color: var(--text-muted);">${streak} day streak!</p>
                
                <div class="flex justify-center gap-2 mb-6">
                    ${[1,2,3,4,5,6,7].map(i => {
                        let cls = 'w-10 h-10 rounded-full flex items-center justify-center font-bold';
                        if (i < streak) {
                            cls += ' bg-green-500/20 text-green-500 border border-green-500';
                        } else if (i === streak) {
                            cls += ' bg-violet-500/30 text-violet-400 border border-violet-500 animate-pulse';
                        } else {
                            cls += ' bg-slate-800/50 text-slate-500 border border-slate-700';
                        }
                        return `<div class="${cls}">${i}</div>`;
                    }).join('')}
                </div>
                
                <div class="text-center mb-6">
                    <div class="text-5xl mb-2">🪙</div>
                    <p class="text-2xl font-extrabold" style="color: var(--primary);">+${coins} Coins</p>
                </div>
                
                <button id="claim-reward-btn" class="w-full py-3 rounded-xl font-bold text-white btn-theme-primary shadow-lg transition-all transform hover:scale-105">
                    Claim Reward
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add click handlers
        const bg = document.getElementById('daily-reward-bg');
        const btn = document.getElementById('claim-reward-btn');
        const claim = () => {
            document.body.removeChild(modal);
            onClaim();
        };
        btn.addEventListener('click', claim);
        bg.addEventListener('click', claim);
    }

    function updateNavStreakIndicator(streak) {
        // Check if nav has user section or similar to add indicator
        // For simplicity, just store a badge in localStorage or look for nav later
        const navLinks = document.querySelectorAll('.hub-link');
        navLinks.forEach(link => {
            if (link.textContent.includes('Profile')) {
                let badge = link.querySelector('.streak-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'streak-badge ml-2 px-2 py-1 rounded-full text-xs font-bold';
                    badge.style.background = 'rgba(255,100,0,0.2)';
                    badge.style.color = 'rgb(255,150,0)';
                    badge.style.border = '1px solid rgba(255,100,0,0.3)';
                    link.style.position = 'relative';
                    link.appendChild(badge);
                }
                badge.textContent = `🔥 ${streak}d`;
            }
        });
    }

    // Expose some functions if needed
    window.gameHubDailyRewards = { checkAndShowReward, updateNavStreakIndicator };

    function init() {
        // Listen for auth state changes to check for reward
        if (window.gameHubAuth && window.gameHubAuth.onAuthStateChanged) {
            window.gameHubAuth.onAuthStateChanged(user => {
                if (user) {
                    checkAndShowReward();
                }
            });
        } else {
            // Check on load regardless
            checkAndShowReward();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
