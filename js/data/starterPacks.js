// ============================================
// LevelZero — Starter Pack Templates
// One-click quest & habit bundles personalized for Kabyik
// ============================================

export const QUEST_PACKS = [
    {
        id: 'mlops-grind',
        name: 'MLOps Grind',
        icon: 'terminal',
        description: 'Shipping AI to prod',
        quests: [
            { text: 'Fix a deployment pipeline issue', difficulty: 'hard', category: 'intelligence' },
            { text: 'Read a new AI research paper (arXiv)', difficulty: 'medium', category: 'intelligence' },
            { text: 'Containerize a model with Docker', difficulty: 'medium', category: 'intelligence' },
            { text: 'Write a section of a technical blog post', difficulty: 'medium', category: 'intelligence' },
            { text: 'Review a PR on GitHub', difficulty: 'easy', category: 'intelligence' },
        ],
    },
    {
        id: 'desk-jockey-fitness',
        name: 'Desk Jockey Fitness',
        icon: 'muscle',
        description: 'HP maintenance',
        quests: [
            { text: 'Do a 15-min home workout', difficulty: 'medium', category: 'strength' },
            { text: 'Do 50 pushups between epochs', difficulty: 'medium', category: 'strength' },
            { text: 'Stretch back and neck for 5 mins', difficulty: 'easy', category: 'strength' },
            { text: 'Take a 20-min evening walk', difficulty: 'easy', category: 'strength' },
            { text: 'Hold a plank for 2 minutes', difficulty: 'hard', category: 'strength' },
        ],
    },
    {
        id: 'tech-community',
        name: 'Tech Community',
        icon: 'users',
        description: 'Networking & sharing',
        quests: [
            { text: 'Reach out to an AI researcher or dev', difficulty: 'hard', category: 'charisma' },
            { text: 'Post project progress on Twitter/LinkedIn', difficulty: 'medium', category: 'charisma' },
            { text: 'Help a classmate or friend with code', difficulty: 'medium', category: 'charisma' },
            { text: 'Share a cool AI/ML find with a friend', difficulty: 'easy', category: 'charisma' },
            { text: 'Engage with 3 tech posts online', difficulty: 'easy', category: 'charisma' },
        ],
    },
    {
        id: 'otaku-recovery',
        name: 'Otaku Recovery',
        icon: 'gamepad',
        description: 'Restore your sanity',
        quests: [
            { text: 'Watch 2 episodes of a new anime', difficulty: 'easy', category: 'vitality' },
            { text: 'Play a game for 1 hour without guilt', difficulty: 'medium', category: 'vitality' },
            { text: 'Drink 2L of water during a coding session', difficulty: 'easy', category: 'vitality' },
            { text: 'Get a full night\'s sleep (7+ hours)', difficulty: 'hard', category: 'vitality' },
            { text: 'Step away from all screens for 30 mins', difficulty: 'medium', category: 'vitality' },
        ],
    },
];

export const HABIT_PACKS = [
    {
        id: 'model-training-morning',
        name: 'Model Training Morning',
        icon: 'sun',
        description: 'Start the day right',
        habits: [
            { text: 'Wake up before 8 AM', category: 'vitality' },
            { text: 'Check overnight model training logs', category: 'intelligence' },
            { text: 'Drink a glass of water', category: 'vitality' },
            { text: 'Review daily tasks & schedule', category: 'intelligence' },
        ],
    },
    {
        id: 'deep-work-mode',
        name: 'Deep Work Mode',
        icon: 'moon',
        description: 'Total focus',
        habits: [
            { text: '2 hours of uninterrupted coding', category: 'intelligence' },
            { text: 'Write down 3 things you\'re grateful for', category: 'charisma' },
            { text: '1-hour digital detox before bed', category: 'vitality' },
            { text: 'Read 10 pages of a non-fiction book', category: 'intelligence' },
        ],
    },
    {
        id: 'data-science-scholar',
        name: 'Data Science Scholar',
        icon: 'graduationCap',
        description: 'Always learning',
        habits: [
            { text: 'Study/Read for 1 hour', category: 'intelligence' },
            { text: 'Learn/Practice a new framework (e.g., ZenML)', category: 'intelligence' },
            { text: 'Work on a personal side project', category: 'intelligence' },
            { text: 'Update notes or documentation', category: 'intelligence' },
        ],
    },
    {
        id: 'physical-stat-maintenance',
        name: 'Stat Maintenance',
        icon: 'activity',
        description: 'Keep the vessel healthy',
        habits: [
            { text: '30 mins of exercise', category: 'strength' },
            { text: 'Eye breaks every hour (20-20-20 rule)', category: 'vitality' },
            { text: 'Drink enough water throughout the day', category: 'vitality' },
            { text: 'Eat at least one healthy home-cooked meal', category: 'vitality' },
        ],
    },
];
