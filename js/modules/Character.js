import { Icons } from '../components/Icons.js';
import { esc } from '../utils/escapeHTML.js';
import { showModal } from '../components/Modal.js';

export function renderCharacter(state, engine) {
  const { stats, attributes, heroName, heroImage, completedQuestCount, habits, longestStreak, totalDaysActive, createdAt } = state;
  const title = engine.getCurrentTitle();

  const attrData = [
    { key: 'strength', label: 'Strength', fullLabel: 'Physical Form', icon: Icons.sword, color: 'red' },
    { key: 'intelligence', label: 'Intelligence', fullLabel: 'Mental Discipline', icon: Icons.book, color: 'blue' },
    { key: 'charisma', label: 'Charisma', fullLabel: 'Social Influence', icon: Icons.zap, color: 'gold' },
    { key: 'vitality', label: 'Vitality', fullLabel: 'Life Force', icon: Icons.heart, color: 'green' },
  ];

  const totalHabitCompletions = habits.reduce((sum, h) => sum + (h.totalCompletions || 0), 0);

  return `
    <div class="tab-content" id="tab-character">
      <!-- Hero Profile Card -->
      <div class="card hero-profile-card animate-slide-up" style="margin-bottom: var(--space-6);">
        <div class="hero-avatar-large animate-float" id="hero-avatar-upload" title="Click to change profile picture">
          ${heroImage ? `<img src="${heroImage}" alt="Hero Avatar" />` : Icons.user}
        </div>
        <input type="file" id="hero-image-input" accept="image/*" style="display: none;" />
        <p class="hero-title">${title}</p>
        <h2 class="hero-name" id="hero-name-display">${esc(heroName)}</h2>
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
  const container = document.getElementById('tab-character');
  if (container) {
    container.addEventListener('click', (e) => {
      // 1. Rename Hero Click
      const btn = e.target.closest('#edit-name-btn');
      if (btn) {
        const current = engine.getState().heroName;
        showModal({
          title: 'Rename Hero',
          body: `<input type="text" id="rename-input-char" class="input" value="${esc(current)}" style="width: 100%; margin-top: 10px;" autocomplete="off" />`,
          confirmText: 'Save',
          onConfirm: () => {
            const input = document.getElementById('rename-input-char');
            if (input) {
              const newName = input.value.trim();
              if (newName) {
                engine.setHeroName(newName);
                rerender();
              }
            }
          }
        });
        // Auto-focus the input
        setTimeout(() => {
          const input = document.getElementById('rename-input-char');
          if (input) {
            input.focus();
            input.select();
          }
        }, 10);
        return;
      }

      // 2. Avatar Click
      const avatarBtn = e.target.closest('#hero-avatar-upload');
      if (avatarBtn) {
        const fileInput = document.getElementById('hero-image-input');
        if (fileInput) fileInput.click();
      }
    });

    // 3. File Input Change (Image Upload)
    const fileInput = document.getElementById('hero-image-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            engine.setHeroImage(compressedBase64);
            rerender();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
  }
}
