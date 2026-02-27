// ============================================
// LevelZero — Main App Controller
// ============================================

import { gameEngine } from './engine/GameEngine.js';
import { eventBus } from './engine/EventBus.js';
import { renderHeader } from './components/Header.js';
import { showToast } from './components/Toast.js';
import { Icons } from './components/Icons.js';

import { renderActivities, attachActivitiesEvents } from './modules/Activities.js';
import { renderCharacter, attachCharacterEvents } from './modules/Character.js';
import { renderShop, attachShopEvents } from './modules/Shop.js';
import { renderAchievements, attachAchievementsEvents } from './modules/Achievements.js';
import { renderSettings, attachSettingsEvents } from './modules/Settings.js';

// --- App State ---
let activeTab = 'activities';

const TABS = [
    { id: 'activities', icon: Icons.sword, label: 'Activities' },
    { id: 'character', icon: Icons.user, label: 'Hero' },
    { id: 'shop', icon: Icons.shoppingBag, label: 'Bazaar' },
    { id: 'achievements', icon: Icons.award, label: 'Awards' },
    { id: 'settings', icon: Icons.settings, label: 'Config' },
];

// --- Initialize ---
function init() {
    gameEngine.init();
    setupEventListeners();
    render();
}

// --- Event Listeners (Global) ---
function setupEventListeners() {
    // Level up
    eventBus.on('level:up', (data) => {
        showToast({
            title: `Level Up! → Level ${data.level}`,
            message: `New title: ${data.title}`,
            type: 'level-up',
            icon: Icons.star,
            duration: 4000,
        });
        showLevelUpFlash(data.level);
    });

    // Achievement unlock
    eventBus.on('achievement:unlock', (achievement) => {
        showToast({
            title: `Achievement Unlocked!`,
            message: achievement.name,
            type: 'achievement',
            icon: Icons[achievement.icon] || Icons.award,
            duration: 4000,
        });
    });

    // Quest complete
    eventBus.on('quest:complete', (data) => {
        showToast({
            title: 'Quest Complete!',
            message: `+${data.xp} XP · +${data.gold} Gold`,
            type: 'success',
            icon: Icons.check,
        });
    });

    // Habit milestone
    eventBus.on('habit:milestone', (data) => {
        showToast({
            title: `${data.milestone}-Day Streak!`,
            message: `${data.habit.text} — Bonus XP awarded!`,
            type: 'achievement',
            icon: Icons.flame,
            duration: 5000,
        });
    });

    // Daily login
    eventBus.on('daily:login', (data) => {
        if (data.streak > 1) {
            showToast({
                title: `Welcome back! Day ${data.streak}`,
                message: `+${data.gold} gold daily bonus`,
                type: 'success',
                icon: Icons.wave,
            });
        }
    });

    // HP decay warning
    eventBus.on('hp:decay', (data) => {
        showToast({
            title: `HP Lost: -${data.loss}`,
            message: `${data.incomplete} habits were skipped yesterday`,
            type: 'warning',
            icon: Icons.brokenHeart,
            duration: 5000,
        });
    });

    // HP death
    eventBus.on('hp:death', () => {
        showToast({
            title: 'You fell in battle!',
            message: 'All streaks have been reset. Revived at 50% HP.',
            type: 'warning',
            icon: Icons.skull,
            duration: 6000,
        });
    });

    // AI Agent generated content
    eventBus.on('ai:generated', (data) => {
        showToast({
            title: 'AI Agent delivered!',
            message: `${data.quests?.length || 0} quests & ${data.habits?.length || 0} habits suggested`,
            type: 'achievement',
            icon: '✨',
            duration: 4000,
        });
        render();
    });
}

// --- Level Up Flash ---
function showLevelUpFlash(level) {
    const overlay = document.createElement('div');
    overlay.className = 'level-up-overlay';
    overlay.innerHTML = `
    <div class="level-up-inner">
      <div class="level-label">Level Up!</div>
      <div class="level-number">${level}</div>
    </div>
  `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1800);
}

// --- Render ---
function render() {
    const state = gameEngine.getState();
    const app = document.getElementById('app');

    // Build tab navigation
    const tabNavHTML = TABS.map(tab => `
    <button 
      class="tab-nav-btn ${activeTab === tab.id ? 'active' : ''}" 
      data-tab="${tab.id}"
    >
      ${tab.icon}
      <span class="tab-nav-label">${tab.label}</span>
    </button>
  `).join('');

    // Build tab content
    let tabContent = '';
    switch (activeTab) {
        case 'activities':
            tabContent = renderActivities(state, gameEngine);
            break;
        case 'character':
            tabContent = renderCharacter(state, gameEngine);
            break;
        case 'shop':
            tabContent = renderShop(state, gameEngine);
            break;
        case 'achievements':
            tabContent = renderAchievements(state, gameEngine);
            break;
        case 'settings':
            tabContent = renderSettings(state, gameEngine);
            break;
    }

    // Quotes for footer
    const quotes = [
        "Success is not owned, it's leased. And rent is due every day.",
        "The only way to do great work is to love what you do.",
        "Discipline equals freedom.",
        "You don't rise to the level of your goals. You fall to the level of your systems.",
        "Hard choices, easy life. Easy choices, hard life.",
        "The best time to plant a tree was 20 years ago. The second best time is now.",
        "Level up or stay behind. The choice is yours.",
        "Every expert was once a beginner.",
        "Small daily improvements lead to staggering long-term results.",
        "Your future is created by what you do today, not tomorrow.",
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    app.innerHTML = `
    ${renderHeader(state, gameEngine)}

    <main class="app-main">
      <nav class="tab-nav" id="tab-nav">
        ${tabNavHTML}
      </nav>
      ${tabContent}
    </main>

    <footer class="app-footer">
      <p>${quote}</p>
    </footer>
  `;

    // Attach events
    attachTabNavEvents();
    attachTabEvents();
}

function attachTabNavEvents() {
    const tabNav = document.getElementById('tab-nav');
    if (tabNav) {
        tabNav.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-tab]');
            if (!btn) return;
            const newTab = btn.dataset.tab;
            if (newTab !== activeTab) {
                activeTab = newTab;
                render();
            }
        });
    }
}

function attachTabEvents() {
    const rerender = () => render();

    switch (activeTab) {
        case 'activities':
            attachActivitiesEvents(gameEngine, rerender);
            break;
        case 'character':
            attachCharacterEvents(gameEngine, rerender);
            break;
        case 'shop':
            attachShopEvents(gameEngine, rerender);
            break;
        case 'achievements':
            attachAchievementsEvents(gameEngine, rerender);
            break;
        case 'settings':
            attachSettingsEvents(gameEngine, rerender);
            break;
    }
}

// --- Start ---
document.addEventListener('DOMContentLoaded', init);
