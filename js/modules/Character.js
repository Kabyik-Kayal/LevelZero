// ============================================
// LevelZero — Character/Hero Module
// ============================================

import { Icons } from '../components/Icons.js';

export function renderCharacter(state, engine) {
    const { stats, attributes, heroName, completedQuestCount, habits, longestStreak, totalDaysActive, createdAt } = state;
    const title = engine.getCurrentTitle();

    const attrData = [
        { key: 'strength', label: 'STR', fullLabel: 'Physical Form', icon: Icons.sword, color: 'red' },
        { key: 'intelligence', label: 'INT', fullLabel: 'Mental Discipline', icon: Icons.book, color: 'blue' },
        { key: 'charisma', label: 'CHA', fullLabel: 'Social Influence', icon: Icons.zap, color: 'gold' },
        { key: 'vitality', label: 'VIT', fullLabel: 'Life Force', icon: Icons.heart, color: 'green' },
    ];

    const totalHabitCompletions = habits.reduce((sum, h) => sum + (h.totalCompletions || 0), 0);

    return `
    <div class="tab-content" id="tab-character">
      <!-- Hero Profile Card -->
      <div class="card hero-profile-card animate-slide-up" style="margin-bottom: var(--space-6);">
        <div class="hero-avatar-large animate-float">
          ${Icons.user}
        </div>
        <p class="hero-title">${title}</p>
        <h2 class="hero-name" id="hero-name-display">${heroName}</h2>
        <p class="hero-level-text">Level ${stats.level} · ${stats.xp}/${stats.xpToNextLevel} XP to next level</p>
        <button class="btn btn-ghost btn-sm" id="edit-name-btn" style="margin-top: var(--space-3);">
          ${Icons.edit} Rename
        </button>

        <!-- Stats Summary -->
        <div class="stats-summary-grid">
          <div class="stats-summary-item">
            <div class="stats-summary-value">${completedQuestCount}</div>
            <div class="stats-summary-label">Quests Done</div>
          </div>
          <div class="stats-summary-item">
            <div class="stats-summary-value">${totalHabitCompletions}</div>
            <div class="stats-summary-label">Habits Hit</div>
          </div>
          <div class="stats-summary-item">
            <div class="stats-summary-value">${longestStreak}</div>
            <div class="stats-summary-label">Best Streak</div>
          </div>
          <div class="stats-summary-item">
            <div class="stats-summary-value">${totalDaysActive}</div>
            <div class="stats-summary-label">Days Active</div>
          </div>
        </div>
      </div>

      <!-- Attribute Cards -->
      <div class="section-header">${Icons.star} Attributes</div>
      <div class="stat-cards-grid stagger-children" style="margin-bottom: var(--space-6);">
        ${attrData.map(a => `
          <div class="stat-card">
            <div class="stat-card-icon ${a.color}">${a.icon}</div>
            <div>
              <p class="stat-card-label">${a.label}</p>
              <p class="stat-card-value">${attributes[a.key].toFixed(1)}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Attribute Progress -->
      <div class="card animate-slide-up">
        <h3 style="font-size: var(--text-lg); font-weight: 900; color: var(--color-text-primary); margin-bottom: var(--space-6); display: flex; align-items: center; gap: var(--space-2);">
          ${Icons.user} Hero's Progress
        </h3>
        <div style="display: flex; flex-direction: column; gap: var(--space-6);">
          ${attrData.map(a => {
        const val = attributes[a.key];
        const progress = (val % 1) * 100;
        return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; margin-bottom: 6px; color: var(--color-text-secondary);">
                  <span>${a.fullLabel}</span>
                  <span>${Math.floor(val * 10)}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill progress-fill-${a.color} shimmer" style="width: ${progress}%"></div>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    </div>
  `;
}

export function attachCharacterEvents(engine, rerender) {
    const editBtn = document.getElementById('edit-name-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const current = engine.getState().heroName;
            const newName = prompt('Enter your hero name:', current);
            if (newName !== null && newName.trim()) {
                engine.setHeroName(newName.trim());
                rerender();
            }
        });
    }
}
