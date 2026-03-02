// ============================================
// LevelZero — Settings Module
// ============================================

import { Icons } from '../components/Icons.js';
import { showModal } from '../components/Modal.js';
import { showToast } from '../components/Toast.js';
import { aiAgent } from '../engine/AIAgent.js';
import { esc } from '../utils/escapeHTML.js';

export function renderSettings(state, engine) {
  const { heroName, createdAt, totalDaysActive, loginStreak } = state;
  const created = new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const aiKey = engine.getAIApiKey();
  const aiEnabled = state.aiEnabled !== false;
  const maskedKey = aiKey ? '••••••••' + aiKey.slice(-4) : '';
  const lastGen = state.lastAIGenerationDate || 'Never';
  const portfolioUrls = (engine.getPortfolioUrls() || []).join(', ');

  return `
    <div class="tab-content" id="tab-settings">
      <div class="card animate-slide-up" style="margin-bottom: var(--space-6);">
        <h3 style="font-size: var(--text-lg); font-weight: 900; margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
          ${Icons.settings} Settings
        </h3>

        <!-- Profile Section -->
        <div class="settings-section">
          <div class="settings-section-title">Profile</div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Hero Name</p>
              <p class="settings-row-desc">Your character's display name</p>
            </div>
            <button class="btn btn-ghost btn-sm" id="settings-rename">
              ${Icons.edit} ${esc(heroName)}
            </button>
          </div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Journey Started</p>
              <p class="settings-row-desc">${created}</p>
            </div>
            <span style="font-size: var(--text-sm); color: var(--color-text-muted);">${totalDaysActive} days</span>
          </div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Login Streak</p>
              <p class="settings-row-desc">Consecutive days of activity</p>
            </div>
            <span style="font-size: var(--text-sm); color: var(--color-orange); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">${Icons.flame} ${loginStreak} days</span>
          </div>
        </div>

        <!-- AI Agent Section -->
        <div class="settings-section">
          <div class="settings-section-title" style="display: flex; align-items: center; gap: var(--space-2);">${Icons.sparkles} AI Agent</div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Gemini API Key</p>
              <p class="settings-row-desc">Free key from <a href="https://aistudio.google.com/apikey" target="_blank" style="color: var(--color-indigo-light);">aistudio.google.com</a></p>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="font-size: var(--text-xs); color: var(--color-text-muted); font-family: var(--font-mono);">${maskedKey || 'Not set'}</span>
              <button class="btn btn-ghost btn-sm" id="settings-ai-key">
                ${Icons.edit} ${aiKey ? 'Change' : 'Set Key'}
              </button>
            </div>
          </div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">AI Suggestions</p>
              <p class="settings-row-desc">Generate personalized quests & habits daily</p>
            </div>
            <button class="btn btn-sm ${aiEnabled ? 'btn-success' : 'btn-ghost'}" id="settings-ai-toggle">
              ${aiEnabled ? '✓ Enabled' : 'Disabled'}
            </button>
          </div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Test Connection</p>
              <p class="settings-row-desc">Verify your API key works</p>
            </div>
            <button class="btn btn-ghost btn-sm" id="settings-ai-test" ${!aiKey ? 'disabled' : ''}>
              ${Icons.zap} Test
            </button>
          </div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Refresh Suggestions</p>
              <p class="settings-row-desc">Last: ${lastGen}</p>
            </div>
            <button class="btn btn-ghost btn-sm" id="settings-ai-refresh" ${!aiKey ? 'disabled' : ''}>
              ${Icons.sparkles} Regenerate
            </button>
          </div>
          <div class="settings-row" style="flex-direction: column; align-items: stretch; gap: var(--space-2);">
            <div>
              <p class="settings-row-label">Portfolio URLs</p>
              <p class="settings-row-desc">Comma-separated URLs for the AI to scrape your online presence</p>
            </div>
            <div style="display: flex; gap: var(--space-2);">
              <input type="text" class="input" id="settings-portfolio-urls" placeholder="https://github.com/you, https://yoursite.com" value="${esc(portfolioUrls)}" style="flex: 1; font-size: var(--text-xs);" />
              <button class="btn btn-ghost btn-sm" id="settings-save-urls">Save</button>
            </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="settings-section">
          <div class="settings-section-title">Data Management</div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Export Save</p>
              <p class="settings-row-desc">Download your progress as a JSON file</p>
            </div>
            <button class="btn btn-ghost btn-sm" id="settings-export">
              ${Icons.download} Export
            </button>
          </div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Import Save</p>
              <p class="settings-row-desc">Restore from a backup file</p>
            </div>
            <button class="btn btn-ghost btn-sm" id="settings-import">
              ${Icons.upload} Import
            </button>
            <input type="file" accept=".json" id="settings-import-file" style="display: none;" />
          </div>
          <div class="settings-row">
            <div>
              <p class="settings-row-label">Factory Reset</p>
              <p class="settings-row-desc">Erase ALL data and start fresh. This cannot be undone!</p>
            </div>
            <button class="btn btn-danger btn-sm" id="settings-reset">
              ${Icons.alertTriangle} Reset
            </button>
          </div>
        </div>

        <!-- About -->
        <div class="settings-section">
          <div class="settings-section-title">About</div>
          <div class="settings-row" style="border-bottom: none;">
            <div>
              <p class="settings-row-label">LevelZero v1.0</p>
              <p class="settings-row-desc">Gamify your life. Become the hero of your own story.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachSettingsEvents(engine, rerender) {
  // Rename
  const container = document.getElementById('tab-settings');
  if (container) {
    container.addEventListener('click', (e) => {
      const renameBtn = e.target.closest('#settings-rename');
      if (renameBtn) {
        const current = engine.getState().heroName;
        showModal({
          title: 'Rename Hero',
          body: `<input type="text" id="rename-input" class="input" value="${esc(current)}" style="width: 100%; margin-top: 10px;" autocomplete="off" />`,
          confirmText: 'Save',
          onConfirm: () => {
            const input = document.getElementById('rename-input');
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
          const input = document.getElementById('rename-input');
          if (input) {
            input.focus();
            input.select();
          }
        }, 10);
      }
    });
  }

  // AI API Key
  const aiKeyBtn = document.getElementById('settings-ai-key');
  if (aiKeyBtn) {
    aiKeyBtn.addEventListener('click', () => {
      const current = engine.getAIApiKey();
      const newKey = prompt('Enter your Gemini API key:', current);
      if (newKey !== null) {
        engine.setAIApiKey(newKey.trim());
        showToast({ title: newKey.trim() ? 'API key saved!' : 'API key cleared', message: '', type: 'success', icon: '🔑' });
        rerender();
      }
    });
  }

  // AI Toggle
  const aiToggleBtn = document.getElementById('settings-ai-toggle');
  if (aiToggleBtn) {
    aiToggleBtn.addEventListener('click', () => {
      const current = engine.getState().aiEnabled !== false;
      engine.setAIEnabled(!current);
      showToast({ title: !current ? 'AI Agent enabled' : 'AI Agent disabled', message: '', type: 'success', icon: '🤖' });
      rerender();
    });
  }

  // AI Test Connection
  const aiTestBtn = document.getElementById('settings-ai-test');
  if (aiTestBtn) {
    aiTestBtn.addEventListener('click', async () => {
      aiTestBtn.disabled = true;
      aiTestBtn.textContent = 'Testing...';
      const apiKey = engine.getAIApiKey();
      const ok = await aiAgent.testConnection(apiKey);
      if (ok) {
        showToast({ title: 'Connection successful!', message: 'Gemini API is ready.', type: 'success', icon: '✅' });
      } else {
        showToast({ title: 'Connection failed', message: 'Check your API key.', type: 'warning', icon: '❌' });
      }
      rerender();
    });
  }

  // AI Refresh
  const aiRefreshBtn = document.getElementById('settings-ai-refresh');
  if (aiRefreshBtn) {
    aiRefreshBtn.addEventListener('click', async () => {
      aiRefreshBtn.disabled = true;
      aiRefreshBtn.textContent = 'Generating...';
      showToast({ title: 'AI Agent working...', message: 'Scraping profile & generating suggestions', type: 'success', icon: '🤖', duration: 3000 });
      await engine.refreshAIContent();
      showToast({ title: 'AI suggestions ready!', message: 'Check Quests & Habits tabs', type: 'success', icon: '✨' });
      rerender();
    });
  }

  // Portfolio URLs Save
  const saveUrlsBtn = document.getElementById('settings-save-urls');
  if (saveUrlsBtn) {
    saveUrlsBtn.addEventListener('click', () => {
      const input = document.getElementById('settings-portfolio-urls');
      if (!input) return;
      const urls = input.value.split(',').map(u => u.trim()).filter(u => u);
      engine.setPortfolioUrls(urls);
      showToast({ title: 'URLs Saved', message: 'Portfolio sources updated.', type: 'success', icon: '🔗' });
    });
  }

  // Export
  const exportBtn = document.getElementById('settings-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const success = engine.exportData();
      if (success) {
        showToast({ title: 'Save exported!', message: 'Your progress has been saved to a file.', type: 'success' });
      }
    });
  }

  // Import
  const importBtn = document.getElementById('settings-import');
  const importFile = document.getElementById('settings-import-file');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const success = await engine.importData(file);
      if (success) {
        showToast({ title: 'Save imported!', message: 'Your progress has been restored.', type: 'success' });
        rerender();
      } else {
        showToast({ title: 'Import failed', message: 'Invalid save file.', type: 'warning' });
      }
      importFile.value = '';
    });
  }

  // Factory Reset
  const resetBtn = document.getElementById('settings-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      showModal({
        title: 'Factory Reset',
        body: '<p>This will <strong>permanently erase</strong> all your progress, quests, habits, achievements, and gold.</p><p style="margin-top: 0.5rem; color: var(--color-red);">This action cannot be undone.</p>',
        confirmText: 'Erase Everything',
        confirmClass: 'btn-danger',
        onConfirm: () => {
          engine.factoryReset();
          showToast({ title: 'Game reset', message: 'All data has been erased.', type: 'warning', icon: Icons.trash });
          rerender();
        },
      });
    });
  }
}
