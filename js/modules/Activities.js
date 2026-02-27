// ============================================
// LevelZero — Activities Module (Unified Quests + Habits)
// ============================================

import { Icons } from '../components/Icons.js';
import { STARTER_PACKS } from '../data/starterPacks.js';

// --- Starter Pack Pickers ---

function renderPackPicker() {
  return `
      <div class="starter-pack-section">
        <div class="starter-pack-header">
          <span class="starter-pack-bolt">${Icons.zap}</span>
          <span>Starter Packs</span>
        </div>
        <div class="starter-pack-grid">
          ${STARTER_PACKS.map(pack => `
            <button class="starter-pack-card" data-action="add-starter-pack" data-pack-id="${pack.id}">
              <span class="starter-pack-emoji">${Icons[pack.icon]}</span>
              <span class="starter-pack-name">${pack.name}</span>
              <span class="starter-pack-desc">${pack.description}</span>
              <span class="starter-pack-count">${pack.quests.length} quests · ${pack.habits.length} habits</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
}

// --- AI Suggestion Renderers ---

function renderAISuggestedQuests(aiQuests) {
  if (!aiQuests || aiQuests.length === 0) return '';
  const rewardMap = { easy: 10, medium: 25, hard: 50, epic: 100 };
  return `
      <div class="ai-suggestions-section">
        <div class="section-header ai-section-header">${Icons.sparkles} AI Suggested Quests</div>
        <div class="stagger-children" style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${aiQuests.map((q, i) => `
            <div class="quest-item ai-suggestion-card animate-slide-up">
              <div class="quest-item-inner">
                <div class="quest-item-left">
                  <div class="ai-badge-icon">${Icons.sparkles}</div>
                  <div>
                    <p class="quest-text">${q.text}</p>
                    <div class="quest-tags">
                      <span class="badge badge-${q.difficulty}">${q.difficulty}</span>
                      <span class="badge badge-${q.category}">${q.category}</span>
                    </div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                  <div class="quest-rewards">
                    <span class="quest-reward-xp">+${rewardMap[q.difficulty] || 25} XP</span>
                  </div>
                  <button class="btn btn-sm btn-primary" data-action="accept-ai-quest" data-index="${i}">Accept</button>
                  <button class="delete-btn" data-action="dismiss-ai-quest" data-index="${i}" title="Dismiss">${Icons.trash}</button>
                </div>
              </div>
            </div>
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

// --- Main Render ---

export function renderActivities(state, engine) {
  const { quests, dailyQuest, habits } = state;

  // === Daily Quest ===
  let dailyQuestHTML = '';
  if (dailyQuest && !dailyQuest.completed) {
    dailyQuestHTML = `
      <div class="quest-item card-glow animate-slide-up" style="border-left: 3px solid var(--color-gold);">
        <div class="quest-item-inner">
          <div class="quest-item-left">
            <button class="quest-complete-btn" id="complete-daily" title="Complete quest">
              ${Icons.check}
            </button>
            <div>
              <p class="quest-text">${dailyQuest.text}</p>
              <div class="quest-tags">
                <span class="badge badge-${dailyQuest.difficulty}">${dailyQuest.difficulty}</span>
                <span class="badge badge-${dailyQuest.category}">${dailyQuest.category}</span>
                <span class="badge" style="background: var(--color-gold-glow); color: var(--color-gold);">${Icons.star} daily</span>
              </div>
            </div>
          </div>
          <div class="quest-rewards">
            <span class="quest-reward-xp">~40+ XP</span>
            <span class="quest-reward-gold">~20+ Gold</span>
          </div>
        </div>
      </div>
    `;
  } else if (dailyQuest && dailyQuest.completed) {
    dailyQuestHTML = `
      <div class="quote-card" style="border-color: var(--color-green-glow);">
        <p style="color: var(--color-green);">${Icons.check} Daily quest completed! Come back tomorrow for a new challenge.</p>
      </div>
    `;
  }

  // === Habits ===
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

  const allHabitsDone = habits.length > 0 && habits.every(h => h.completedToday);

  // === Quests ===
  const rewardMap = { easy: 10, medium: 25, hard: 50, epic: 100 };
  const questListHTML = quests.length === 0
    ? ''
    : quests.map(q => `
      <div class="quest-item ${q.completed ? 'completed' : ''} animate-slide-up" data-quest-id="${q.id}">
        <div class="quest-item-inner">
          <div class="quest-item-left">
            <button class="quest-complete-btn ${q.completed ? 'done' : ''}" data-action="complete-quest" data-id="${q.id}" title="Complete quest">
              ${q.completed ? Icons.check : ''}
            </button>
            <div>
              <p class="quest-text ${q.completed ? 'done' : ''}">${q.text}</p>
              <div class="quest-tags">
                <span class="badge badge-${q.difficulty}">${q.difficulty}</span>
                <span class="badge badge-${q.category}">${q.category}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div class="quest-rewards">
              <span class="quest-reward-xp">+${rewardMap[q.difficulty] || 25} XP</span>
              <span class="quest-reward-gold">+${Math.floor((rewardMap[q.difficulty] || 25) / 2)} Gold</span>
            </div>
            <button class="delete-btn" data-action="delete-quest" data-id="${q.id}" title="Delete quest">
              ${Icons.trash}
            </button>
          </div>
        </div>
      </div>
    `).join('');

  // === Starter Packs (collapsible) ===
  const hasContent = quests.length > 0 || habits.length > 0;
  const packSection = !hasContent
    ? renderPackPicker()
    : `<button class="starter-pack-add-btn" id="toggle-packs" data-action="toggle-packs">${Icons.zap} Add a Starter Pack</button>
       <div class="starter-pack-collapsible" id="packs-collapsible" style="display: none;">${renderPackPicker()}</div>`;

  // === Compose the unified layout ===
  return `
    <div class="tab-content" id="tab-activities">

      <!-- Daily Quest (hero moment at the top) -->
      ${dailyQuestHTML ? `
        <div class="section-header">${Icons.sparkles} Daily Quest</div>
        <div style="margin-bottom: var(--space-6);">${dailyQuestHTML}</div>
      ` : ''}

      <!-- Daily Habits -->
      <div class="section-header">${Icons.flame} Daily Alignment</div>
      <div class="stagger-children" style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-4);" id="habits-list">
        ${habitsHTML || `
          <div class="empty-state" style="padding: var(--space-6) var(--space-4);">
            ${Icons.flame}
            <p>No habits yet. Pick a starter pack below or add your own!</p>
          </div>
        `}
      </div>

      ${allHabitsDone ? `
        <div class="quote-card" style="margin-bottom: var(--space-6); border-color: var(--color-green-glow);">
          <p style="color: var(--color-green); font-style: normal; font-weight: 700;">${Icons.sparkles} Perfect Day! All habits aligned.</p>
        </div>
      ` : ''}

      <!-- Unified Add Activity Bar -->
      <form class="quest-form" id="activity-form" style="margin-bottom: var(--space-6);">
        <div style="display: flex; gap: 2px; background: var(--color-bg-input); padding: 2px; border-radius: var(--radius-lg); margin-bottom: var(--space-3); border: 1px solid var(--color-border);">
          <button type="button" class="btn btn-sm activity-mode-btn active" id="mode-quest" data-mode="quest" style="flex: 1; border-radius: var(--radius-md);">
            ${Icons.sword} Quest
          </button>
          <button type="button" class="btn btn-sm activity-mode-btn" id="mode-habit" data-mode="habit" style="flex: 1; border-radius: var(--radius-md);">
            ${Icons.flame} Habit
          </button>
        </div>
        <div class="quest-form-input-row">
          <input type="text" class="input" id="activity-input" placeholder="Enter a new life quest..." autocomplete="off" />
          <button type="submit" class="btn btn-primary btn-icon" title="Add">
            ${Icons.plus}
          </button>
        </div>
        <div class="quest-form-controls">
          <select class="select" id="activity-difficulty">
            <option value="easy">Easy (10 XP)</option>
            <option value="medium" selected>Medium (25 XP)</option>
            <option value="hard">Hard (50 XP)</option>
            <option value="epic">Epic (100 XP)</option>
          </select>
          <select class="select" id="activity-category">
            <option value="intelligence">${Icons.brain} Intelligence</option>
            <option value="strength">${Icons.muscle} Strength</option>
            <option value="charisma">${Icons.zap} Charisma</option>
            <option value="vitality">${Icons.heart} Vitality</option>
          </select>
        </div>
      </form>

      <!-- AI Suggestions -->
      ${renderAISuggestedHabits(state.aiSuggestedHabits)}
      ${renderAISuggestedQuests(state.aiSuggestedQuests)}

      <!-- Starter Packs -->
      ${packSection}

      <!-- Active Quest List -->
      <div class="section-header" style="margin-top: var(--space-4);">${Icons.target} Active Quests</div>
      <div class="stagger-children" style="display: flex; flex-direction: column; gap: var(--space-3);" id="quest-list">
        ${questListHTML || `
          <div class="empty-state">
            ${Icons.target}
            <p>Your quest log is empty. Pick a starter pack above or add your own!</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// --- Event Binding ---

export function attachActivitiesEvents(engine, rerender) {

  // --- Habit Events ---

  // Toggle / delete habit
  const habitsList = document.getElementById('habits-list');
  if (habitsList) {
    habitsList.addEventListener('click', (e) => {
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

  // --- Unified Activity Form ---

  let activityMode = 'quest'; // default mode

  // Mode toggle buttons
  const modeQuestBtn = document.getElementById('mode-quest');
  const modeHabitBtn = document.getElementById('mode-habit');
  const difficultySelect = document.getElementById('activity-difficulty');
  const activityInput = document.getElementById('activity-input');

  function setMode(mode) {
    activityMode = mode;
    if (modeQuestBtn && modeHabitBtn) {
      modeQuestBtn.classList.toggle('active', mode === 'quest');
      modeHabitBtn.classList.toggle('active', mode === 'habit');
      // Active style
      modeQuestBtn.style.background = mode === 'quest' ? 'linear-gradient(135deg, var(--color-indigo), var(--color-indigo-dark))' : 'transparent';
      modeQuestBtn.style.color = mode === 'quest' ? 'white' : '';
      modeQuestBtn.style.boxShadow = mode === 'quest' ? 'var(--shadow-glow-indigo)' : 'none';
      modeHabitBtn.style.background = mode === 'habit' ? 'linear-gradient(135deg, var(--color-orange), #c2410c)' : 'transparent';
      modeHabitBtn.style.color = mode === 'habit' ? 'white' : '';
      modeHabitBtn.style.boxShadow = mode === 'habit' ? '0 0 20px rgba(249,115,22,0.3)' : 'none';
    }
    if (difficultySelect) {
      difficultySelect.style.display = mode === 'quest' ? '' : 'none';
    }
    if (activityInput) {
      activityInput.placeholder = mode === 'quest' ? 'Enter a new life quest...' : 'Add a new daily habit...';
    }
  }

  if (modeQuestBtn) modeQuestBtn.addEventListener('click', () => setMode('quest'));
  if (modeHabitBtn) modeHabitBtn.addEventListener('click', () => setMode('habit'));

  // Initialize mode styling
  setMode(activityMode);

  // Unified form submit
  const activityForm = document.getElementById('activity-form');
  if (activityForm) {
    activityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('activity-input');
      const text = input.value.trim();
      if (!text) return;
      const category = document.getElementById('activity-category').value;

      if (activityMode === 'quest') {
        const difficulty = document.getElementById('activity-difficulty').value;
        engine.addQuest(text, difficulty, category);
      } else {
        engine.addHabit(text, category);
      }
      input.value = '';
      rerender();
    });
  }

  // Complete daily quest
  const dailyBtn = document.getElementById('complete-daily');
  if (dailyBtn) {
    dailyBtn.addEventListener('click', () => {
      engine.completeDailyQuest();
      rerender();
    });
  }

  // Quest actions (complete + delete)
  const questList = document.getElementById('quest-list');
  if (questList) {
    questList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = parseFloat(btn.dataset.id);

      if (action === 'complete-quest') {
        engine.completeQuest(id);
        rerender();
      } else if (action === 'delete-quest') {
        engine.deleteQuest(id);
        rerender();
      }
    });
  }

  // --- Starter Pack Toggle & AI Events ---

  // Toggle packs
  const togglePacksBtn = document.getElementById('toggle-packs');
  if (togglePacksBtn) {
    togglePacksBtn.addEventListener('click', () => {
      const panel = document.getElementById('packs-collapsible');
      if (panel) {
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        togglePacksBtn.classList.toggle('active', !isVisible);
      }
    });
  }

  // Unified pack cards — adds both quests AND habits from a pack
  document.querySelectorAll('[data-action="add-starter-pack"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const packId = btn.dataset.packId;
      const pack = STARTER_PACKS.find(p => p.id === packId);
      if (!pack) return;

      // Add quests (dedup)
      const existingQuestTexts = new Set(engine.getState().quests.map(q => q.text));
      for (const quest of pack.quests) {
        if (!existingQuestTexts.has(quest.text)) {
          engine.addQuest(quest.text, quest.difficulty, quest.category);
        }
      }
      // Add habits (dedup)
      const existingHabitTexts = new Set(engine.getState().habits.map(h => h.text));
      for (const habit of pack.habits) {
        if (!existingHabitTexts.has(habit.text)) {
          engine.addHabit(habit.text, habit.category);
        }
      }
      rerender();
    });
  });

  // AI habit actions
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

  // AI quest actions
  document.querySelectorAll('[data-action="accept-ai-quest"]').forEach(btn => {
    btn.addEventListener('click', () => {
      engine.acceptAISuggestedQuest(parseInt(btn.dataset.index));
      rerender();
    });
  });
  document.querySelectorAll('[data-action="dismiss-ai-quest"]').forEach(btn => {
    btn.addEventListener('click', () => {
      engine.dismissAISuggestedQuest(parseInt(btn.dataset.index));
      rerender();
    });
  });
}
