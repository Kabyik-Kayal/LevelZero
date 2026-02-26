// ============================================
// LevelZero — Achievement Definitions
// ============================================

export const ACHIEVEMENTS = [
    // --- Questing ---
    {
        id: 'first_quest',
        name: 'First Steps',
        description: 'Complete your first quest',
        icon: 'sword',
        category: 'questing',
        condition: (state) => state.completedQuestCount >= 1,
        progress: (state) => ({ current: Math.min(state.completedQuestCount, 1), target: 1 }),
    },
    {
        id: 'quest_10',
        name: 'Adventurer',
        description: 'Complete 10 quests',
        icon: 'swordCombat',
        category: 'questing',
        condition: (state) => state.completedQuestCount >= 10,
        progress: (state) => ({ current: Math.min(state.completedQuestCount, 10), target: 10 }),
    },
    {
        id: 'quest_50',
        name: 'Quest Slayer',
        description: 'Complete 50 quests',
        icon: 'target',
        category: 'questing',
        condition: (state) => state.completedQuestCount >= 50,
        progress: (state) => ({ current: Math.min(state.completedQuestCount, 50), target: 50 }),
    },
    {
        id: 'quest_100',
        name: 'Legendary Quester',
        description: 'Complete 100 quests',
        icon: 'crown',
        category: 'questing',
        condition: (state) => state.completedQuestCount >= 100,
        progress: (state) => ({ current: Math.min(state.completedQuestCount, 100), target: 100 }),
    },

    // --- Habits ---
    {
        id: 'habit_first',
        name: 'Building Blocks',
        description: 'Complete a habit for the first time',
        icon: 'plus',
        category: 'habits',
        condition: (state) => state.habits.some(h => h.totalCompletions >= 1),
        progress: null,
    },
    {
        id: 'streak_7',
        name: 'One Week Strong',
        description: 'Reach a 7-day streak on any habit',
        icon: 'flame',
        category: 'habits',
        condition: (state) => state.habits.some(h => h.streak >= 7),
        progress: (state) => {
            const best = Math.max(...state.habits.map(h => h.streak), 0);
            return { current: Math.min(best, 7), target: 7 };
        },
    },
    {
        id: 'streak_30',
        name: 'Monthly Master',
        description: 'Reach a 30-day streak on any habit',
        icon: 'diamond',
        category: 'habits',
        condition: (state) => state.habits.some(h => h.streak >= 30),
        progress: (state) => {
            const best = Math.max(...state.habits.map(h => h.streak), 0);
            return { current: Math.min(best, 30), target: 30 };
        },
    },
    {
        id: 'streak_100',
        name: 'Century Club',
        description: 'Reach a 100-day streak on any habit',
        icon: 'trophy',
        category: 'habits',
        condition: (state) => state.habits.some(h => h.streak >= 100),
        progress: (state) => {
            const best = Math.max(...state.habits.map(h => h.streak), 0);
            return { current: Math.min(best, 100), target: 100 };
        },
    },
    {
        id: 'habit_all_done',
        name: 'Perfect Day',
        description: 'Complete all habits in a single day',
        icon: 'sparkles',
        category: 'habits',
        condition: (state) => state.habits.length > 0 && state.habits.every(h => h.completedToday),
        progress: null,
    },

    // --- Character ---
    {
        id: 'level_5',
        name: 'Apprentice Rising',
        description: 'Reach Level 5',
        icon: 'activity',
        category: 'character',
        condition: (state) => state.stats.level >= 5,
        progress: (state) => ({ current: Math.min(state.stats.level, 5), target: 5 }),
    },
    {
        id: 'level_10',
        name: 'Double Digits',
        description: 'Reach Level 10',
        icon: 'target',
        category: 'character',
        condition: (state) => state.stats.level >= 10,
        progress: (state) => ({ current: Math.min(state.stats.level, 10), target: 10 }),
    },
    {
        id: 'level_25',
        name: 'Quarter Century',
        description: 'Reach Level 25',
        icon: 'star',
        category: 'character',
        condition: (state) => state.stats.level >= 25,
        progress: (state) => ({ current: Math.min(state.stats.level, 25), target: 25 }),
    },
    {
        id: 'level_50',
        name: 'Half Way There',
        description: 'Reach Level 50',
        icon: 'sparkles',
        category: 'character',
        condition: (state) => state.stats.level >= 50,
        progress: (state) => ({ current: Math.min(state.stats.level, 50), target: 50 }),
    },
    {
        id: 'balanced',
        name: 'Well Rounded',
        description: 'Get all attributes above 3.0',
        icon: 'target',
        category: 'character',
        condition: (state) => Object.values(state.attributes).every(v => v >= 3),
        progress: null,
    },
    {
        id: 'str_10',
        name: 'Iron Body',
        description: 'Reach 10 Strength',
        icon: 'muscle',
        category: 'character',
        condition: (state) => state.attributes.strength >= 10,
        progress: (state) => ({ current: Math.min(Math.floor(state.attributes.strength), 10), target: 10 }),
    },
    {
        id: 'int_10',
        name: 'Scholar',
        description: 'Reach 10 Intelligence',
        icon: 'brain',
        category: 'character',
        condition: (state) => state.attributes.intelligence >= 10,
        progress: (state) => ({ current: Math.min(Math.floor(state.attributes.intelligence), 10), target: 10 }),
    },

    // --- Economy ---
    {
        id: 'gold_100',
        name: 'Coin Collector',
        description: 'Accumulate 100 gold',
        icon: 'coins',
        category: 'economy',
        condition: (state) => state.stats.gold >= 100,
        progress: (state) => ({ current: Math.min(state.stats.gold, 100), target: 100 }),
    },
    {
        id: 'gold_500',
        name: 'Treasure Hunter',
        description: 'Accumulate 500 gold',
        icon: 'crown',
        category: 'economy',
        condition: (state) => state.stats.gold >= 500,
        progress: (state) => ({ current: Math.min(state.stats.gold, 500), target: 500 }),
    },
    {
        id: 'gold_1000',
        name: 'Dragon Hoarder',
        description: 'Accumulate 1000 gold',
        icon: 'dragon',
        category: 'economy',
        condition: (state) => state.stats.gold >= 1000,
        progress: (state) => ({ current: Math.min(state.stats.gold, 1000), target: 1000 }),
    },
    {
        id: 'first_purchase',
        name: 'Retail Therapy',
        description: 'Make your first purchase',
        icon: 'shoppingBag',
        category: 'economy',
        condition: (state) => state.purchaseHistory.length >= 1,
        progress: null,
    },
    {
        id: 'big_spender',
        name: 'Big Spender',
        description: 'Make 10 purchases',
        icon: 'money',
        category: 'economy',
        condition: (state) => state.purchaseHistory.length >= 10,
        progress: (state) => ({ current: Math.min(state.purchaseHistory.length, 10), target: 10 }),
    },

    // --- Secret ---
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete a quest past midnight',
        icon: 'moon',
        category: 'secret',
        condition: (state) => {
            const hour = new Date().getHours();
            return hour >= 0 && hour < 5 && state.completedQuestCount > 0;
        },
        progress: null,
    },
    {
        id: 'survivor',
        name: 'Survivor',
        description: 'Recover from 0 HP',
        icon: 'skull',
        category: 'secret',
        condition: (state) => state.stats.hp > 0 && state.stats.hp <= state.stats.maxHp * 0.5 && state.totalDaysActive > 1,
        progress: null,
    },
    {
        id: 'login_7',
        name: 'Dedicated',
        description: 'Log in 7 days in a row',
        icon: 'calendar',
        category: 'secret',
        condition: (state) => state.loginStreak >= 7,
        progress: (state) => ({ current: Math.min(state.loginStreak, 7), target: 7 }),
    },
    {
        id: 'login_30',
        name: 'Unstoppable',
        description: 'Log in 30 days in a row',
        icon: 'crown',
        category: 'secret',
        condition: (state) => state.loginStreak >= 30,
        progress: (state) => ({ current: Math.min(state.loginStreak, 30), target: 30 }),
    },
];
