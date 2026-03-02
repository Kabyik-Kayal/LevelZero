// ============================================
// LevelZero — Achievements Module
// ============================================

import { ACHIEVEMENTS } from '../data/achievements.js';
import { Icons } from '../components/Icons.js';

export function renderAchievements(state, engine) {
  const { unlockedAchievements } = state;
  const total = ACHIEVEMENTS.length;
  const unlocked = unlockedAchievements.length;

  const categories = ['questing', 'habits', 'character', 'economy', 'secret'];
  const categoryLabels = {
    questing: { label: 'Questing', icon: 'sword' },
    habits: { label: 'Habits', icon: 'flame' },
    character: { label: 'Character', icon: 'user' },
    economy: { label: 'Economy', icon: 'coins' },
    secret: { label: 'Secret', icon: 'star' },
  };

  let achievementsHTML = '';

  for (const cat of categories) {
    const catAchievements = ACHIEVEMENTS.filter(a => a.category === cat);
    if (catAchievements.length === 0) continue;

    achievementsHTML += `
      <div class="section-header" style="margin-top: var(--space-6);">${Icons[categoryLabels[cat].icon]} ${categoryLabels[cat].label}</div>
      <div class="achievement-grid stagger-children">
        ${catAchievements.map(a => {
      const isUnlocked = unlockedAchievements.includes(a.id);
      const progress = engine.getAchievementProgress(a);
      const progressHTML = progress
        ? `<div class="achievement-progress">${progress.current}/${progress.target}</div>`
        : '';

      return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
              <span class="achievement-icon">${isUnlocked ? Icons[a.icon] : Icons.lock}</span>
              <p class="achievement-name">${(isUnlocked || a.category !== 'secret') ? a.name : '???'}</p>
              <p class="achievement-desc">${isUnlocked ? a.description : 'Keep playing to unlock'}</p>
              ${!isUnlocked ? progressHTML : '<div class="achievement-progress" style="color: var(--color-gold); display: flex; align-items: center; gap: 4px;">' + Icons.check + ' Unlocked</div>'}
            </div>
          `;
    }).join('')}
      </div>
    `;
  }

  return `
    <div class="tab-content" id="tab-achievements">
      <div class="info-banner indigo animate-slide-up">
        <div class="info-banner-icon">${Icons.award}</div>
        <div>
          <p class="info-banner-title">Achievements: ${unlocked} / ${total}</p>
          <p class="info-banner-desc">Complete challenges across all areas of your life to unlock them all.</p>
        </div>
      </div>

      <div class="progress-bar" style="margin-bottom: var(--space-2);">
        <div class="progress-bar-fill progress-fill-gold shimmer" style="width: ${(unlocked / total) * 100}%"></div>
      </div>
      <p style="font-size: var(--text-xs); color: var(--color-text-muted); text-align: right; margin-bottom: var(--space-4);">
        ${Math.round((unlocked / total) * 100)}% complete
      </p>

      ${achievementsHTML}
    </div>
  `;
}

// No events needed — achievements are view-only
export function attachAchievementsEvents() { }
