// ============================================
// LevelZero — Habits Module
// ============================================

import { Icons } from '../components/Icons.js';
import { HABIT_PACKS } from '../data/starterPacks.js';

function renderHabitPackPicker() {
  return `
      <div class="starter-pack-section">
        <div class="starter-pack-header">
          <span class="starter-pack-bolt">${Icons.zap}</span>
          <span>Quick Start — Pick a Habit Pack</span>
        </div>
        <div class="starter-pack-grid">
          ${HABIT_PACKS.map(pack => `
            <button class="starter-pack-card" data-action="add-habit-pack" data-pack-id="${pack.id}">
              <span class="starter-pack-emoji">${Icons[pack.icon]}</span>
              <span class="starter-pack-name">${pack.name}</span>
              <span class="starter-pack-desc">${pack.description}</span>
              <span class="starter-pack-count">${pack.habits.length} habits</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
}

function renderAISuggestedHabits(aiHabits) {
  if (!aiHabits || aiHabits.length === 0) return '';
  return `
      <div class="ai-suggestions-section">
        <div class="section-header ai-section-header">${Icons.sparkles} AI Suggested Habits</div>
        <div class="stagger-children" style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${aiHabits.map((h, i) => `
            <div class="habit-item ai-suggestion-card animate-slide-up">
              <div class="habit-item-left">
                <div class="ai-badge-icon">${Icons.sparkles}</div>
                <div>
                  <p class="habit-name">${h.text}</p>
                  <p class="habit-streak" style="color: var(--color-purple);">AI suggested · ${h.category}</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: var(--space-2);">
                <button class="btn btn-sm btn-primary" data-action="accept-ai-habit" data-index="${i}">Accept</button>
                <button class="delete-btn" data-action="dismiss-ai-habit" data-index="${i}" title="Dismiss">${Icons.trash}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
}

export function renderHabits(state) {
  const { habits } = state;

  const habitsHTML = habits.length === 0
    ? ''
    : habits.map(h => `
      <div class="habit-item ${h.completedToday ? 'active' : ''} animate-slide-up" data-habit-id="${h.id}">
        <div class="habit-item-left">
          <div class="habit-icon-wrap ${h.completedToday ? 'active' : ''}">
            ${Icons.flame}
          </div>
          <div>
            <p class="habit-name">${h.text}</p>
            <p class="habit-streak">${Icons.flame} Streak: ${h.streak} days${h.longestStreak > 0 ? ` · Best: ${h.longestStreak}` : ''}</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <button 
            class="btn btn-sm ${h.completedToday ? 'btn-success' : 'btn-primary'}" 
            data-action="toggle-habit" 
            data-id="${h.id}"
          >
            ${h.completedToday ? 'Aligned' : 'Align Now'}
          </button>
          <button class="delete-btn" data-action="delete-habit" data-id="${h.id}" title="Delete habit">
            ${Icons.trash}
          </button>
        </div>
      </div>
    `).join('');

  const allDone = habits.length > 0 && habits.every(h => h.completedToday);

  // Show pack picker when empty, or a collapsible button when not
  const packSection = habits.length === 0
    ? renderHabitPackPicker()
    : `<button class="starter-pack-add-btn" id="toggle-habit-packs" data-action="toggle-habit-packs">${Icons.zap} Add a Habit Pack</button>
           <div class="starter-pack-collapsible" id="habit-packs-collapsible" style="display: none;">${renderHabitPackPicker()}</div>`;

  return `
    <div class="tab-content" id="tab-habits">
      <div class="section-header">${Icons.flame} Daily Alignment</div>
      
      <div class="stagger-children" style="display: flex; flex-direction: column; gap: var(--space-3);" id="habits-list">
        ${habitsHTML || `
          <div class="empty-state">
            ${Icons.flame}
            <p>No habits yet. Pick a starter pack below or add your own!</p>
          </div>
        `}
      </div>

      <!-- AI Suggestions -->
      ${renderAISuggestedHabits(state.aiSuggestedHabits)}

      <!-- Starter Packs -->
      ${packSection}

      <!-- Add Habit -->
      <form class="add-habit-form" id="add-habit-form" style="margin-top: var(--space-4);">
        <input type="text" class="input" id="habit-input" placeholder="Add a new daily habit..." autocomplete="off" />
        <select class="select" id="habit-category">
          <option value="vitality">${Icons.heart} Vitality</option>
          <option value="intelligence">${Icons.brain} Intelligence</option>
          <option value="strength">${Icons.muscle} Strength</option>
          <option value="charisma">${Icons.zap} Charisma</option>
        </select>
        <button type="submit" class="btn btn-primary btn-icon" title="Add habit">
          ${Icons.plus}
        </button>
      </form>

      ${allDone ? `
        <div class="quote-card" style="margin-top: var(--space-6); border-color: var(--color-green-glow);">
          <p style="color: var(--color-green); font-style: normal; font-weight: 700;">${Icons.sparkles} Perfect Day! All habits aligned.</p>
        </div>
      ` : `
        <div class="quote-card" style="margin-top: var(--space-6);">
          <p>"Consistency is the currency of greatness."</p>
        </div>
      `}
    </div>
  `;
}

export function attachHabitsEvents(engine, rerender) {
  // Toggle habit
  const list = document.getElementById('habits-list');
  if (list) {
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = parseFloat(btn.dataset.id);

      if (action === 'toggle-habit') {
        engine.toggleHabit(id);
        rerender();
      } else if (action === 'delete-habit') {
        engine.deleteHabit(id);
        rerender();
      }
    });
  }

  // Add habit form
  const form = document.getElementById('add-habit-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('habit-input');
      const text = input.value.trim();
      if (!text) return;

      const category = document.getElementById('habit-category').value;
      engine.addHabit(text, category);
      input.value = '';
      rerender();
    });
  }

  // Toggle habit packs collapsible
  const toggleBtn = document.getElementById('toggle-habit-packs');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const panel = document.getElementById('habit-packs-collapsible');
      if (panel) {
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        toggleBtn.classList.toggle('active', !isVisible);
      }
    });
  }

  // Starter pack click — add all habits from pack
  document.querySelectorAll('[data-action="add-habit-pack"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const packId = btn.dataset.packId;
      const pack = HABIT_PACKS.find(p => p.id === packId);
      if (!pack) return;

      const existingTexts = new Set(engine.getState().habits.map(h => h.text));
      let added = 0;
      for (const habit of pack.habits) {
        if (!existingTexts.has(habit.text)) {
          engine.addHabit(habit.text, habit.category);
          added++;
        }
      }

      rerender();
    });
  });

  // AI suggested habit actions
  document.querySelectorAll('[data-action="accept-ai-habit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      engine.acceptAISuggestedHabit(parseInt(btn.dataset.index));
      rerender();
    });
  });

  document.querySelectorAll('[data-action="dismiss-ai-habit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      engine.dismissAISuggestedHabit(parseInt(btn.dataset.index));
      rerender();
    });
  });
}
