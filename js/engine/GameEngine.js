// ============================================
// LevelZero — GameEngine
// Core game state, XP/leveling, HP, rewards
// ============================================

import { eventBus } from './EventBus.js';
import { saveManager } from './SaveManager.js';
import { aiAgent } from './AIAgent.js';
import { TITLES } from '../data/titles.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { DAILY_QUEST_TEMPLATES } from '../data/dailyQuests.js';
import { DEFAULT_SHOP_ITEMS } from '../data/shopItems.js';

function getDefaultState() {
    return {
        // Identity
        heroName: 'Hero',
        heroImage: null,
        createdAt: Date.now(),

        // Core stats
        stats: {
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            gold: 0,
            hp: 100,
            maxHp: 100,
        },

        // Attributes
        attributes: {
            strength: 1,
            intelligence: 1,
            charisma: 1,
            vitality: 1,
        },

        // Quests
        quests: [],
        completedQuestCount: 0,

        // Habits
        habits: [],
        lastHabitResetDate: new Date().toDateString(),

        // Inventory / Shop
        shopItems: JSON.parse(JSON.stringify(DEFAULT_SHOP_ITEMS)),
        customRewards: [],
        purchaseHistory: [],
        // { itemId: { daily: count, weekly: count, lastDailyReset: dateStr, lastWeeklyReset: weekStr } }
        purchaseCounts: {},

        // Achievements
        unlockedAchievements: [],

        // Streaks & tracking
        loginStreak: 0,
        lastLoginDate: null,
        totalDaysActive: 0,
        longestStreak: 0,

        // Daily quest
        dailyQuest: null,
        lastDailyQuestDate: null,

        // Onboarding
        introGuideSeenAt: null,

        // AI Agent
        aiApiKey: '',
        aiEnabled: true,
        aiSuggestedQuests: [],
        aiSuggestedHabits: [],
        lastAIGenerationDate: null,
        portfolioUrls: [],
    };
}

export class GameEngine {
    constructor() {
        this.state = getDefaultState();
        this._dirty = false;
    }

    // --- Initialization ---

    init() {
        const saved = saveManager.load();
        if (saved) {
            this.state = this._hydrateState(saved);
        }

        this._checkDailyReset();
        this._checkLoginStreak();
        this._checkDailyQuest();
        this._save();

        return this.state;
    }

    _hydrateState(saved) {
        const merged = this._mergeWithDefaults(saved, getDefaultState());

        // Existing profiles created before the guide shipped should not suddenly
        // be forced through onboarding. New profiles keep the default null.
        if (saved && saved.introGuideSeenAt === undefined) {
            merged.introGuideSeenAt = Date.now();
        }

        return merged;
    }

    _mergeWithDefaults(saved, defaults) {
        const result = { ...defaults };
        for (const key of Object.keys(defaults)) {
            if (saved[key] !== undefined) {
                if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key]) && defaults[key] !== null) {
                    result[key] = { ...defaults[key], ...saved[key] };
                } else {
                    result[key] = saved[key];
                }
            }
        }
        return result;
    }

    // --- XP & Leveling ---

    /**
     * Calculate XP needed for a given level
     * Formula: floor(100 * 1.15^level)
     */
    xpForLevel(level) {
        return Math.floor(100 * Math.pow(1.15, level - 1));
    }

    /**
     * Add XP, handle level-ups, boost attributes
     */
    addXP(amount, category = null) {
        const { stats } = this.state;
        let xpGained = amount;

        // Apply streak bonus (2% per total streak day, max 50% bonus)
        const totalStreak = this.state.habits.reduce((sum, h) => sum + (h.streak || 0), 0);
        const streakBonus = Math.min(totalStreak * 0.02, 0.5);
        xpGained = Math.floor(xpGained * (1 + streakBonus));

        stats.xp += xpGained;

        // Level-up loop (handle multiple level-ups from large XP gains)
        let levelsGained = 0;
        while (stats.xp >= stats.xpToNextLevel) {
            stats.xp -= stats.xpToNextLevel;
            stats.level += 1;
            stats.xpToNextLevel = this.xpForLevel(stats.level);
            stats.hp = stats.maxHp; // Full heal on level up
            levelsGained++;
        }

        // Attribute growth
        if (category && this.state.attributes[category] !== undefined) {
            this.state.attributes[category] += 0.1;
            // Round to avoid floating point drift
            this.state.attributes[category] = Math.round(this.state.attributes[category] * 100) / 100;
        }

        if (levelsGained > 0) {
            const title = this.getCurrentTitle();
            eventBus.emit('level:up', {
                level: stats.level,
                title: title,
                levelsGained
            });
        }

        eventBus.emit('xp:gain', { amount: xpGained, category });
        this._checkAchievements();
        this._save();

        return xpGained;
    }

    // --- Quests ---

    addQuest(text, difficulty = 'medium', category = 'intelligence') {
        const quest = {
            id: Date.now() + Math.random(),
            text,
            difficulty,
            category,
            completed: false,
            createdAt: Date.now(),
        };
        this.state.quests.push(quest);
        this._save();
        eventBus.emit('quest:add', quest);
        return quest;
    }

    completeQuest(id) {
        const quest = this.state.quests.find(q => q.id === id);
        if (!quest || quest.completed) return null;

        quest.completed = true;
        this.state.completedQuestCount++;

        // Base XP rewards
        const rewardTable = { easy: 10, medium: 25, hard: 50, epic: 100 };
        const baseXP = rewardTable[quest.difficulty] || 25;

        // Variable reward (game theory: slot machine effect, 0-50% bonus)
        const bonusMultiplier = 1 + (Math.random() * 0.5);
        const xpReward = Math.floor(baseXP * bonusMultiplier);
        const goldReward = Math.floor(xpReward / 2);

        // Award XP and gold
        const actualXP = this.addXP(xpReward, quest.category);
        this.state.stats.gold += goldReward;

        // Remove quest after a delay (for animation)
        setTimeout(() => {
            this.state.quests = this.state.quests.filter(q => q.id !== id);
            this._save();
            eventBus.emit('state:change', this.state);
        }, 1200);

        eventBus.emit('quest:complete', { quest, xp: actualXP, gold: goldReward });
        eventBus.emit('gold:change', { gold: this.state.stats.gold, change: goldReward });
        this._checkAchievements();
        this._save();

        return { xp: actualXP, gold: goldReward };
    }

    deleteQuest(id) {
        this.state.quests = this.state.quests.filter(q => q.id !== id);
        this._save();
        eventBus.emit('quest:delete', { id });
    }

    // --- Habits ---

    addHabit(text, category = 'vitality') {
        const habit = {
            id: Date.now() + Math.random(),
            text,
            category,
            completedToday: false,
            streak: 0,
            longestStreak: 0,
            totalCompletions: 0,
            createdAt: Date.now(),
        };
        this.state.habits.push(habit);
        this._save();
        eventBus.emit('habit:add', habit);
        return habit;
    }

    toggleHabit(id) {
        const habit = this.state.habits.find(h => h.id === id);
        if (!habit) return null;

        const wasCompleted = habit.completedToday;
        habit.completedToday = !habit.completedToday;

        let result = { habit, xp: 0, gold: 0 };

        if (habit.completedToday) {
            // Completing
            habit.streak++;
            habit.totalCompletions++;
            if (habit.streak > habit.longestStreak) {
                habit.longestStreak = habit.streak;
            }

            // Streak milestone bonuses
            const streakBonuses = { 7: 50, 14: 100, 30: 250, 60: 500, 100: 1000 };
            let xpReward = 15;
            let goldReward = 5;

            if (streakBonuses[habit.streak]) {
                xpReward += streakBonuses[habit.streak];
                goldReward += Math.floor(streakBonuses[habit.streak] / 2);
                eventBus.emit('habit:milestone', { habit, milestone: habit.streak });
            }

            const actualXP = this.addXP(xpReward, habit.category);
            this.state.stats.gold += goldReward;
            result = { habit, xp: actualXP, gold: goldReward };

            eventBus.emit('gold:change', { gold: this.state.stats.gold, change: goldReward });
        } else {
            // Un-completing
            habit.streak = Math.max(0, habit.streak - 1);
            habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
        }

        // Track longest streak globally
        const maxStreak = Math.max(...this.state.habits.map(h => h.streak), 0);
        if (maxStreak > this.state.longestStreak) {
            this.state.longestStreak = maxStreak;
        }

        eventBus.emit('habit:toggle', result);
        this._checkAchievements();
        this._save();

        return result;
    }

    deleteHabit(id) {
        this.state.habits = this.state.habits.filter(h => h.id !== id);
        this._save();
        eventBus.emit('habit:delete', { id });
    }

    // --- Shop ---

    buyItem(itemId, isCustom = false) {
        const items = isCustom ? this.state.customRewards : this.state.shopItems;
        const item = items.find(i => i.id === itemId);
        if (!item) return { success: false, reason: 'Item not found' };

        // Level gate check
        if (item.levelRequired && this.state.stats.level < item.levelRequired) {
            return { success: false, reason: `Requires Level ${item.levelRequired}` };
        }

        // Purchase limit checks
        if (!isCustom) {
            const counts = this._getItemCounts(itemId);
            if (item.dailyLimit != null && counts.daily >= item.dailyLimit) {
                return { success: false, reason: 'Daily limit reached' };
            }
            if (item.weeklyLimit != null && counts.weekly >= item.weeklyLimit) {
                return { success: false, reason: 'Weekly limit reached' };
            }
        }

        if (this.state.stats.gold < item.price) {
            eventBus.emit('shop:insufficient', { item, gold: this.state.stats.gold });
            return { success: false, reason: 'Not enough gold' };
        }

        this.state.stats.gold -= item.price;
        this.state.purchaseHistory.push({
            itemName: item.name,
            price: item.price,
            date: Date.now(),
        });

        // Track purchase counts
        if (!isCustom) {
            const counts = this._getItemCounts(itemId);
            counts.daily++;
            counts.weekly++;
        }

        eventBus.emit('shop:purchase', { item });
        eventBus.emit('gold:change', { gold: this.state.stats.gold, change: -item.price });
        this._checkAchievements();
        this._save();

        return { success: true, item };
    }

    _getItemCounts(itemId) {
        const today = new Date().toDateString();
        const weekNum = this._getWeekNumber();

        if (!this.state.purchaseCounts[itemId]) {
            this.state.purchaseCounts[itemId] = { daily: 0, weekly: 0, lastDailyReset: today, lastWeeklyReset: weekNum };
        }

        const c = this.state.purchaseCounts[itemId];

        // Auto-reset if day/week changed
        if (c.lastDailyReset !== today) {
            c.daily = 0;
            c.lastDailyReset = today;
        }
        if (c.lastWeeklyReset !== weekNum) {
            c.weekly = 0;
            c.lastWeeklyReset = weekNum;
        }

        return c;
    }

    _getWeekNumber() {
        const d = new Date();
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil(((d - yearStart) / 86400000 + yearStart.getDay() + 1) / 7);
        return `${d.getFullYear()}-W${weekNo}`;
    }

    getPurchaseCounts(itemId) {
        return this._getItemCounts(itemId);
    }

    addCustomReward(name, price, icon = 'gift') {
        const reward = {
            id: Date.now() + Math.random(),
            name,
            price,
            icon,
            isCustom: true,
        };
        this.state.customRewards.push(reward);
        this._save();
        return reward;
    }

    deleteCustomReward(id) {
        this.state.customRewards = this.state.customRewards.filter(r => r.id !== id);
        this._save();
    }

    // --- Daily Mechanics ---

    _checkDailyReset() {
        const today = new Date().toDateString();
        if (this.state.lastHabitResetDate !== today) {
            // HP decay for each incomplete habit
            const incomplete = this.state.habits.filter(h => !h.completedToday);
            const hpLoss = incomplete.length * 5;

            if (hpLoss > 0 && this.state.stats.hp > 0) {
                this.state.stats.hp = Math.max(0, this.state.stats.hp - hpLoss);
                eventBus.emit('hp:decay', { loss: hpLoss, incomplete: incomplete.length });

                // HP = 0 penalty: reset all streaks
                if (this.state.stats.hp <= 0) {
                    this.state.habits.forEach(h => { h.streak = 0; });
                    this.state.stats.hp = Math.floor(this.state.stats.maxHp * 0.5); // Revive at 50%
                    eventBus.emit('hp:death', {});
                }
            }

            // Reset daily completions
            this.state.habits.forEach(h => {
                if (!h.completedToday) {
                    h.streak = 0; // Broken streak
                }
                h.completedToday = false;
            });

            this.state.lastHabitResetDate = today;
        }
    }

    _checkLoginStreak() {
        const today = new Date().toDateString();
        const lastLogin = this.state.lastLoginDate;

        if (lastLogin !== today) {
            this.state.totalDaysActive++;

            if (lastLogin) {
                const lastDate = new Date(lastLogin);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    this.state.loginStreak++;
                } else if (diffDays > 1) {
                    this.state.loginStreak = 1;
                }
            } else {
                this.state.loginStreak = 1;
            }

            if (this.state.loginStreak > this.state.longestStreak) {
                this.state.longestStreak = this.state.loginStreak;
            }

            this.state.lastLoginDate = today;

            // Daily login gold bonus (5 gold × login streak, max 50)
            const dailyGold = Math.min(5 * this.state.loginStreak, 50);
            this.state.stats.gold += dailyGold;
            eventBus.emit('daily:login', { streak: this.state.loginStreak, gold: dailyGold });
        }
    }

    _checkDailyQuest() {
        const today = new Date().toDateString();
        if (this.state.lastDailyQuestDate !== today) {
            // Pick a random daily quest template
            const templates = DAILY_QUEST_TEMPLATES;
            const template = templates[Math.floor(Math.random() * templates.length)];

            this.state.dailyQuest = {
                id: 'daily_' + Date.now(),
                text: template.text,
                difficulty: template.difficulty,
                category: template.category,
                completed: false,
                isDaily: true,
                createdAt: Date.now(),
            };
            this.state.lastDailyQuestDate = today;

            // Trigger AI generation in the background
            if (this.state.aiApiKey && this.state.aiEnabled) {
                this._generateAIContent();
            }
        }
    }

    // --- AI Agent ---

    async _generateAIContent() {
        const today = new Date().toDateString();
        if (this.state.lastAIGenerationDate === today) return;

        try {
            const content = await aiAgent.generateDailyContent(this.state.aiApiKey, this.state, this.state.portfolioUrls);
            if (content) {
                this.state.aiSuggestedQuests = content.quests || [];
                this.state.aiSuggestedHabits = content.habits || [];
                this.state.lastAIGenerationDate = today;
                this._save();
                eventBus.emit('ai:generated', content);
                eventBus.emit('state:change', this.state);
            }
        } catch (err) {
            console.error('[GameEngine] AI generation failed:', err);
        }
    }

    async refreshAIContent() {
        this.state.lastAIGenerationDate = null;
        await this._generateAIContent();
    }

    setAIApiKey(key) {
        this.state.aiApiKey = key.trim();
        this._save();
    }

    getAIApiKey() {
        return this.state.aiApiKey || '';
    }

    setAIEnabled(enabled) {
        this.state.aiEnabled = enabled;
        this._save();
    }

    setPortfolioUrls(urls) {
        this.state.portfolioUrls = urls;
        this._save();
    }

    getPortfolioUrls() {
        return this.state.portfolioUrls || [];
    }

    acceptAISuggestedQuest(index) {
        const quest = this.state.aiSuggestedQuests[index];
        if (!quest) return;
        this.addQuest(quest.text, quest.difficulty, quest.category);
        this.state.aiSuggestedQuests.splice(index, 1);
        this._save();
    }

    dismissAISuggestedQuest(index) {
        this.state.aiSuggestedQuests.splice(index, 1);
        this._save();
    }

    acceptAISuggestedHabit(index) {
        const habit = this.state.aiSuggestedHabits[index];
        if (!habit) return;
        this.addHabit(habit.text, habit.category);
        this.state.aiSuggestedHabits.splice(index, 1);
        this._save();
    }

    dismissAISuggestedHabit(index) {
        this.state.aiSuggestedHabits.splice(index, 1);
        this._save();
    }

    completeDailyQuest() {
        if (!this.state.dailyQuest || this.state.dailyQuest.completed) return null;

        this.state.dailyQuest.completed = true;
        this.state.completedQuestCount++;

        const baseXP = 40;
        const bonusMultiplier = 1 + (Math.random() * 0.5);
        const xpReward = Math.floor(baseXP * bonusMultiplier);
        const goldReward = Math.floor(xpReward / 2);

        const actualXP = this.addXP(xpReward, this.state.dailyQuest.category);
        this.state.stats.gold += goldReward;

        eventBus.emit('quest:complete', { quest: this.state.dailyQuest, xp: actualXP, gold: goldReward });
        eventBus.emit('gold:change', { gold: this.state.stats.gold, change: goldReward });
        this._checkAchievements();
        this._save();

        return { xp: actualXP, gold: goldReward };
    }

    // --- Titles ---

    getCurrentTitle() {
        const level = this.state.stats.level;
        let title = 'Novice';
        for (const t of TITLES) {
            if (level >= t.level) {
                title = t.title;
            }
        }
        return title;
    }

    // --- Achievements ---

    _checkAchievements() {
        const unlocked = this.state.unlockedAchievements;

        for (const achievement of ACHIEVEMENTS) {
            if (unlocked.includes(achievement.id)) continue;

            try {
                if (achievement.condition(this.state)) {
                    unlocked.push(achievement.id);
                    eventBus.emit('achievement:unlock', achievement);
                }
            } catch (err) {
                // Silently skip broken achievement conditions
            }
        }
    }

    getAchievementProgress(achievement) {
        if (!achievement.progress) return null;
        try {
            return achievement.progress(this.state);
        } catch {
            return null;
        }
    }

    // --- Character ---

    setHeroName(name) {
        this.state.heroName = name.trim() || 'Hero';
        this._save();
        eventBus.emit('hero:rename', { name: this.state.heroName });
    }

    setHeroImage(base64Image) {
        this.state.heroImage = base64Image;
        this._save();
        eventBus.emit('hero:image', { image: this.state.heroImage });
    }

    // --- State Access ---

    getState() {
        return this.state;
    }

    hasSeenIntroGuide() {
        return Boolean(this.state.introGuideSeenAt);
    }

    markIntroGuideSeen() {
        if (!this.state.introGuideSeenAt) {
            this.state.introGuideSeenAt = Date.now();
            this._save();
        }
    }

    getTotalStreaks() {
        return this.state.habits.reduce((sum, h) => sum + (h.streak || 0), 0);
    }

    getProfiles() {
        return saveManager.getProfiles();
    }

    getActiveProfile() {
        return saveManager.getActiveProfile();
    }

    createProfile(name) {
        const profile = saveManager.createProfile(name);
        this.state = getDefaultState();
        this._save();
        eventBus.emit('profile:change', { profile, created: true });
        return profile;
    }

    switchProfile(profileId) {
        const profile = saveManager.switchProfile(profileId);
        if (!profile) return null;

        const saved = saveManager.load(profileId);
        this.state = saved
            ? this._hydrateState(saved)
            : getDefaultState();

        if (!saved) {
            this._save();
        }

        eventBus.emit('profile:change', { profile, created: false });
        eventBus.emit('state:change', this.state);
        return profile;
    }

    renameActiveProfile(name) {
        const activeProfile = saveManager.getActiveProfile();
        if (!activeProfile) return null;
        return saveManager.renameProfile(activeProfile.id, name);
    }

    deleteProfile(profileId) {
        const result = saveManager.deleteProfile(profileId);
        if (!result.success) return result;

        const activeProfile = saveManager.getActiveProfile();
        const saved = activeProfile ? saveManager.load(activeProfile.id) : null;
        this.state = saved
            ? this._hydrateState(saved)
            : getDefaultState();
        this._save();
        eventBus.emit('profile:change', { profile: activeProfile, deletedProfileId: profileId });
        eventBus.emit('state:change', this.state);
        return result;
    }

    // --- Reset ---

    factoryReset() {
        saveManager.resetAll();
        this.state = getDefaultState();
        this._save();
        eventBus.emit('game:reset', {});
        return this.state;
    }

    // --- Persistence ---

    _save() {
        saveManager.save(this.state);
    }

    exportData() {
        return saveManager.exportData(this.state);
    }

    async importData(file) {
        const imported = await saveManager.importData(file);
        if (imported) {
            this.state = this._hydrateState(imported);
            this._save();
            eventBus.emit('game:import', {});
            return true;
        }
        return false;
    }
}

export const gameEngine = new GameEngine();
