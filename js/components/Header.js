// ============================================
// LevelZero — Header Component
// ============================================

import { Icons } from './Icons.js';
import { esc } from '../utils/escapeHTML.js';

/**
 * Render the sticky header with avatar, XP, HP, gold, streak
 */
export function renderHeader(state, engine) {
  const { stats, heroName, heroImage } = state;
  const title = engine.getCurrentTitle();
  const totalStreaks = engine.getTotalStreaks();
  const xpPercent = Math.min((stats.xp / stats.xpToNextLevel) * 100, 100);
  const hpPercent = Math.min((stats.hp / stats.maxHp) * 100, 100);

  return `
    <header class="app-header" id="app-header">
      <div class="app-header-inner">
        <div class="header-identity">
          <div class="header-avatar">
            <div class="header-avatar-circle">
              ${heroImage ? `<img src="${heroImage}" alt="Hero Avatar" />` : Icons.user}
            </div>
            <div class="header-level-badge">Lv${stats.level}</div>
          </div>
          <div class="header-progress-area">
            <div class="header-hero-name">${esc(heroName)} · ${title}</div>
            <div class="header-progress-label xp">
              <span>Experience</span>
              <span>${Math.floor(stats.xp)} / ${stats.xpToNextLevel} XP</span>
            </div>
            <div class="progress-bar progress-bar-sm">
              <div class="progress-bar-fill progress-fill-indigo shimmer" style="width: ${xpPercent}%"></div>
            </div>
            <div class="header-progress-label hp" style="margin-top: 6px;">
              <span>Vitality</span>
              <span>${stats.hp} / ${stats.maxHp} HP</span>
            </div>
            <div class="progress-bar progress-bar-sm">
              <div class="progress-bar-fill progress-fill-red" style="width: ${hpPercent}%"></div>
            </div>
          </div>
        </div>
        <div class="header-stats-bar">
          <div class="header-stat-item gold">
            ${Icons.coins}
            <span>${stats.gold}</span>
          </div>
          <div class="header-stat-item streak">
            ${Icons.flame}
            <span>${totalStreaks}</span>
          </div>
        </div>
      </div>
    </header>
  `;
}
