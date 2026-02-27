// ============================================
// LevelZero — Starter Packs
// Unified quest + habit bundles for AI/ML college students
// ============================================

export const STARTER_PACKS = [
    {
        id: 'ml-engineer',
        name: 'ML Engineer Arc',
        icon: 'terminal',
        description: 'Build, ship & iterate on models',
        quests: [
            { text: 'Read and summarize an arXiv paper on your focus area', difficulty: 'hard', category: 'intelligence' },
            { text: 'Implement a model from scratch (no copy-paste)', difficulty: 'epic', category: 'intelligence' },
            { text: 'Write a Jupyter notebook walkthrough for a concept', difficulty: 'medium', category: 'intelligence' },
            { text: 'Set up a proper ML experiment with W&B or MLflow', difficulty: 'hard', category: 'intelligence' },
            { text: 'Contribute to an open-source ML repo (issue or PR)', difficulty: 'hard', category: 'charisma' },
            { text: 'Build a data pipeline for a real dataset', difficulty: 'medium', category: 'intelligence' },
        ],
        habits: [
            { text: 'Code for at least 2 hours (deep work)', category: 'intelligence' },
            { text: 'Read 1 ML blog post or paper abstract', category: 'intelligence' },
            { text: 'Push at least one commit to GitHub', category: 'intelligence' },
        ],
    },
    {
        id: 'campus-grind',
        name: 'Campus Grind',
        icon: 'graduationCap',
        description: 'Ace classes & build your resume',
        quests: [
            { text: 'Finish a pending assignment before the deadline', difficulty: 'medium', category: 'intelligence' },
            { text: 'Attend office hours and ask a real question', difficulty: 'hard', category: 'charisma' },
            { text: 'Update your resume with a new project or skill', difficulty: 'medium', category: 'charisma' },
            { text: 'Apply to a research lab or internship position', difficulty: 'epic', category: 'charisma' },
            { text: 'Present a paper or topic in a study group', difficulty: 'hard', category: 'charisma' },
            { text: 'Organize your notes from this week\'s lectures', difficulty: 'easy', category: 'intelligence' },
        ],
        habits: [
            { text: 'Attend all classes (no skipping)', category: 'intelligence' },
            { text: 'Review today\'s lecture notes before bed', category: 'intelligence' },
            { text: 'Solve 1 coding problem (LeetCode, Kaggle, etc.)', category: 'intelligence' },
        ],
    },
    {
        id: 'body-maintenance',
        name: 'Body Maintenance',
        icon: 'muscle',
        description: 'Your brain runs on a body — maintain it',
        quests: [
            { text: 'Do a full 45-minute gym or home workout', difficulty: 'hard', category: 'strength' },
            { text: 'Try a new sport or physical activity', difficulty: 'medium', category: 'strength' },
            { text: 'Meal prep healthy food for 3+ days', difficulty: 'hard', category: 'vitality' },
            { text: 'Get a health checkup or blood test', difficulty: 'epic', category: 'vitality' },
            { text: 'Fix your sleep schedule for 3 consecutive days', difficulty: 'hard', category: 'vitality' },
        ],
        habits: [
            { text: '30 minutes of exercise (walk, gym, sports)', category: 'strength' },
            { text: 'Drink at least 2L of water', category: 'vitality' },
            { text: 'Sleep 7+ hours (in bed before midnight)', category: 'vitality' },
            { text: 'Eat at least one proper home-cooked meal', category: 'vitality' },
        ],
    },
    {
        id: 'portfolio-builder',
        name: 'Portfolio Builder',
        icon: 'globe',
        description: 'Make yourself findable & impressive',
        quests: [
            { text: 'Write and publish a technical blog post', difficulty: 'epic', category: 'charisma' },
            { text: 'Add a new project to your portfolio site', difficulty: 'hard', category: 'charisma' },
            { text: 'Record a demo video of your latest project', difficulty: 'hard', category: 'charisma' },
            { text: 'Make a Kaggle submission and share your notebook', difficulty: 'medium', category: 'intelligence' },
            { text: 'Give a talk or workshop at a college club', difficulty: 'epic', category: 'charisma' },
            { text: 'Redesign your GitHub README with stats & highlights', difficulty: 'medium', category: 'charisma' },
        ],
        habits: [
            { text: 'Post or engage on LinkedIn/Twitter (tech content)', category: 'charisma' },
            { text: 'Document what you learned today (TIL log)', category: 'intelligence' },
        ],
    },
    {
        id: 'mental-recharge',
        name: 'Mental Recharge',
        icon: 'moon',
        description: 'Prevent burnout — you\'re not a GPU',
        quests: [
            { text: 'Binge a show or anime guilt-free (max 4 eps)', difficulty: 'easy', category: 'vitality' },
            { text: 'Go out with friends — no laptops allowed', difficulty: 'medium', category: 'charisma' },
            { text: 'Take a full day off from screens', difficulty: 'epic', category: 'vitality' },
            { text: 'Try a creative hobby (drawing, music, cooking)', difficulty: 'medium', category: 'charisma' },
            { text: 'Organize & clean your workspace or room', difficulty: 'medium', category: 'vitality' },
        ],
        habits: [
            { text: '1-hour digital detox before bed', category: 'vitality' },
            { text: 'Do something fun that isn\'t work (10+ min)', category: 'vitality' },
            { text: 'Write 3 things you\'re grateful for', category: 'charisma' },
        ],
    },
    {
        id: 'networking-arc',
        name: 'Networking Arc',
        icon: 'users',
        description: 'Your network is your net worth',
        quests: [
            { text: 'Cold-message a researcher or engineer you admire', difficulty: 'epic', category: 'charisma' },
            { text: 'Attend a tech meetup, webinar, or hackathon', difficulty: 'hard', category: 'charisma' },
            { text: 'Help someone debug their code or project', difficulty: 'medium', category: 'charisma' },
            { text: 'Start or join a study/project group', difficulty: 'hard', category: 'charisma' },
            { text: 'Get a LinkedIn recommendation from a mentor/peer', difficulty: 'hard', category: 'charisma' },
        ],
        habits: [
            { text: 'Reply to all pending messages & emails', category: 'charisma' },
            { text: 'Talk to at least one new person today', category: 'charisma' },
        ],
    },
];
