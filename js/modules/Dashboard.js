// ============================================
// LevelZero — Dashboard (Quests) Module
// ============================================

import { Icons } from '../components/Icons.js';
import { QUEST_PACKS } from '../data/starterPacks.js';

function renderPackPicker() {
  return `
      <div class="starter-pack-section">
        <div class="starter-pack-header">
          <span class="starter-pack-bolt">${Icons.zap}</span>
          <span>Quick Start — Pick a Quest Pack</span>
        </div>
        <div class="starter-pack-grid">
          ${QUEST_PACKS.map(pack => `
            <button class="starter-pack-card" data-action="add-quest-pack" data-pack-id="${pack.id}">
              <span class="starter-pack-emoji">${Icons[pack.icon]}</span>
              <span class="starter-pack-name">${pack.name}</span>
              <span class="starter-pack-desc">${pack.description}</span>
              <span class="starter-pack-count">${pack.quests.length} quests</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
}

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

export function renderDashboard(state, engine) {
  const { quests, dailyQuest } = state;

  let dailyQuestHTML = '';
  if (dailyQuest && !dailyQuest.completed) {
    dailyQuestHTML = `
      <div class="section-header">${Icons.sparkles} Daily Quest</div>
      <div class="quest-item card-glow animate-slide-up" style="margin-bottom: var(--space-6); border-left: 3px solid var(--color-gold);">
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
                <span class="badge" style="background: var(--color-gold-glow); color: var(--color-gold);" display: inline-flex; align-items: center; gap: 4px;">${Icons.star} daily</span>
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
      <div class="quote-card" style="margin-bottom: var(--space-6); border-color: var(--color-green-glow);">
        <p style="color: var(--color-green);">${Icons.check} Daily quest completed! Come back tomorrow for a new challenge.</p>
      </div>
    `;
  }

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

  // Show pack picker when empty, or a collapsible "Add Pack" button when not
  const packSection = quests.length === 0
    ? renderPackPicker()
    : `<button class="starter-pack-add-btn" id="toggle-quest-packs" data-action="toggle-quest-packs">${Icons.zap} Add a Quest Pack</button>
           <div class="starter-pack-collapsible" id="quest-packs-collapsible" style="display: none;">${renderPackPicker()}</div>`;

  return `
    <div class="tab-content" id="tab-dashboard">
      <!-- Add Quest Form -->
      <form class="quest-form" id="quest-form">
        <div class="quest-form-input-row">
          <input type="text" class="input" id="quest-input" placeholder="Enter a new life quest..." autocomplete="off" />
          <button type="submit" class="btn btn-primary btn-icon" title="Add quest">
            ${Icons.plus}
          </button>
        </div>
        <div class="quest-form-controls">
          <select class="select" id="quest-difficulty">
            <option value="easy">Easy (10 XP)</option>
            <option value="medium" selected>Medium (25 XP)</option>
            <option value="hard">Hard (50 XP)</option>
            <option value="epic">Epic (100 XP)</option>
          </select>
          <select class="select" id="quest-category">
            <option value="intelligence">${Icons.brain} Intelligence</option>
            <option value="strength">${Icons.muscle} Strength</option>
            <option value="charisma">${Icons.zap} Charisma</option>
            <option value="vitality">${Icons.heart} Vitality</option>
          </select>
        </div>
      </form>

      ${dailyQuestHTML}

      <!-- AI Suggestions -->
      ${renderAISuggestedQuests(state.aiSuggestedQuests)}

      <!-- Starter Packs -->
      ${packSection}

      <!-- Quest List -->
      <div class="section-header">${Icons.shield} Active Quests</div>
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

export function attachDashboardEvents(engine, rerender) {
  // Add quest form
  const form = document.getElementById('quest-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('quest-input');
      const text = input.value.trim();
      if (!text) return;

      const difficulty = document.getElementById('quest-difficulty').value;
      const category = document.getElementById('quest-category').value;
      engine.addQuest(text, difficulty, category);
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

  // Toggle quest packs collapsible
  const toggleBtn = document.getElementById('toggle-quest-packs');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const panel = document.getElementById('quest-packs-collapsible');
      if (panel) {
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        toggleBtn.classList.toggle('active', !isVisible);
      }
    });
  }

  // Starter pack click — add all quests from pack
  document.querySelectorAll('[data-action="add-quest-pack"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const packId = btn.dataset.packId;
      const pack = QUEST_PACKS.find(p => p.id === packId);
      if (!pack) return;

      const existingTexts = new Set(engine.getState().quests.map(q => q.text));
      let added = 0;
      for (const quest of pack.quests) {
        if (!existingTexts.has(quest.text)) {
          engine.addQuest(quest.text, quest.difficulty, quest.category);
          added++;
        }
      }

      rerender();
    });
  });

  // AI suggested quest actions
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
