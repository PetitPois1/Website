
(function() {
    // Get required services
    const getDb = () => window.gameHubFirebase && window.gameHubFirebase.db;
    const getUser = () => window.gameHubAuth && window.gameHubAuth.getCurrentUser ? window.gameHubAuth.getCurrentUser() : null;

    // Level thresholds (L1: 0, L2:100, L3:250, etc.)
    const levelThresholds = [0,100,250,500,1000]; // L1-L5

    function getThresholdForLevel(lvl) {
        if (lvl <= 5) return levelThresholds[lvl-1];
        // For levels >5: previous threshold + 750
        return getThresholdForLevel(lvl - 1) + 750;
    }

    // Rank titles
    const ranks = {
        1: 'Rookie', 2: 'Rookie', 3: 'Rookie', 4: 'Rookie',
        5: 'Player', 6: 'Player',7:'Player',8:'Player',9:'Player',
        10: 'Gamer', 11:'Gamer',12:'Gamer',13:'Gamer',14:'Gamer',15:'Gamer',16:'Gamer',17:'Gamer',18:'Gamer',19:'Gamer',
        20: 'Pro', 21:'Pro',22:'Pro',23:'Pro',24:'Pro',25:'Pro',26:'Pro',27:'Pro',28:'Pro',29:'Pro',
        30: 'Elite', 31:'Elite',32:'Elite',33:'Elite',34:'Elite',35:'Elite',36:'Elite',37:'Elite',38:'Elite',39:'Elite',
        40: 'Legend',41:'Legend',42:'Legend',43:'Legend',44:'Legend',45:'Legend',46:'Legend',47:'Legend',48:'Legend',49:'Legend',
        50: 'Champion'
    };

    // Helper to calculate current level from total XP
    function calculateLevelFromXP(totalXP) {
        let lvl = 1;
        while (true) {
            const nextThresh = getThresholdForLevel(lvl+1);
            if (nextThresh > totalXP || lvl >=50) break;
            lvl++;
        }
        return lvl;
    }

    // Helper to get rank from level
    function getRankFromLevel(lvl) {
        const cappedLvl = Math.min(lvl,50);
        return ranks[cappedLvl] || 'Rookie';
    }

    // Load current XP, level, rank from local or cloud
    let currentData = loadFromLocal();

    function loadFromLocal() {
        try {
            const raw = localStorage.getItem('gamehub_xp');
            if (raw) {
                return JSON.parse(raw);
            }
        } catch(e) {}
        return { xp: 0, level: 1, rank: 'Rookie' };
    }

    function saveToLocal(data) {
        localStorage.setItem('gamehub_xp', JSON.stringify(data));
        currentData = { ...data };
    }

    async function loadFromCloud() {
        const user = getUser();
        const db = getDb();
        if (!user || !db) return null;
        try {
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
                const data = {
                    xp: doc.data().xp || 0,
                    level: calculateLevelFromXP(doc.data().xp || 0),
                    rank: getRankFromLevel(calculateLevelFromXP(doc.data().xp || 0))
                };
                saveToLocal(data);
                return data;
            }
        } catch(e) {
            console.warn('[XPSystem] Load from cloud failed', e);
        }
        return null;
    }

    async function saveToCloud(data) {
        const user = getUser();
        const db = getDb();
        if (!user || !db) return Promise.resolve();
        try {
            await db.collection('users').doc(user.uid).set({
                xp: data.xp,
                level: data.level,
                rank: data.rank
            }, { merge: true });
        } catch(e) {
            console.warn('[XPSystem] Save to cloud failed', e);
        }
    }

    // Show level up modal
    function showLevelUpModal(oldLevel, newLevel, newRank) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/80" id="level-up-bg"></div>
            <div class="relative z-10 p-8 rounded-3xl max-w-md w-full text-center" style="background: var(--card-bg); border: 1px solid var(--border-color);">
                <div class="text-6xl mb-4 animate-bounce">⬆️</div>
                <h2 class="text-3xl font-extrabold mb-2" style="color: var(--text-main);">Level Up!</h2>
                <p class="mb-4" style="color: var(--text-muted);">You reached level ${newLevel}!</p>
                <div class="text-2xl font-bold mb-6" style="color: var(--primary);">${newRank}</div>
                <button id="close-level-up" class="px-6 py-2 rounded-xl font-bold text-white btn-theme-primary">
                    Nice!
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        const bg = document.getElementById('level-up-bg');
        const btn = document.getElementById('close-level-up');
        const close = () => document.body.removeChild(modal);
        bg.addEventListener('click', close);
        btn.addEventListener('click', close);
    }

    // Add XP
    async function addXP(amount, source) {
        const oldLevel = currentData.level;
        let newXP = currentData.xp + amount;
        let newLevel = calculateLevelFromXP(newXP);
        let newRank = getRankFromLevel(newLevel);
        const newData = { xp: newXP, level: newLevel, rank: newRank };
        saveToLocal(newData);
        await saveToCloud(newData);
        
        // Show level up if needed
        if (newLevel > oldLevel) {
            showLevelUpModal(oldLevel, newLevel, newRank);
            // TODO: Add to activity feed if friend system exists
        }
        
        // Dispatch event
        try {
            window.dispatchEvent(new CustomEvent('gamehub:xp-added', { detail: { amount, source, newData }}));
        } catch(e) {}
        return newData;
    }

    // Get XP progress for progress bar
    function getXPProgress() {
        const currentLevel = currentData.level;
        const currentThresh = getThresholdForLevel(currentLevel);
        const nextThresh = getThresholdForLevel(currentLevel + 1);
        const xpInLevel = currentData.xp - currentThresh;
        const xpNeeded = nextThresh - currentThresh;
        const percentage = Math.min(100, Math.floor((xpInLevel / xpNeeded) * 100));
        return { currentXP: xpInLevel, neededXP: xpNeeded, percentage, totalXP: currentData.xp, level: currentLevel, rank: currentData.rank };
    }

    // Expose on window
    window.gameHubXP = {
        getXPProgress,
        getLevel: () => currentData.level,
        getRank: () => currentData.rank,
        getTotalXP: () => currentData.xp,
        addXP,
        loadFromCloud,
        saveToCloud,
        getThresholdForLevel
    };

    // Load from cloud on auth change
    if (window.gameHubAuth && window.gameHubAuth.onAuthStateChanged) {
        window.gameHubAuth.onAuthStateChanged(user => {
            if (user) {
                loadFromCloud();
            }
        });
    } else {
        loadFromCloud();
    }

})();
