// ============================================
// LevelZero — Settings Module
// ============================================

import { Icons } from '../components/Icons.js';
import { showModal } from '../components/Modal.js';
import { showToast } from '../components/Toast.js';
import { aiAgent } from '../engine/AIAgent.js';
import { esc } from '../utils/escapeHTML.js';

function renderSettingsRow({
  label,
  desc,
  right = '',
  extraClass = '',
  noBorder = false,
}) {
  return `
    <div class="settings-item ${extraClass} ${noBorder ? 'settings-item-last' : ''}">
      <div class="settings-copy">
        <p class="settings-item-label">${label}</p>
        ${desc ? `<p class="settings-item-desc">${desc}</p>` : ''}
      </div>
      ${right ? `<div class="settings-item-side">${right}</div>` : ''}
    </div>
  `;
}

function renderSettingsSection(title, rows, icon = '') {
  return `
    <section class="settings-panel">
      <div class="settings-panel-title">${icon}${title}</div>
      <div class="settings-panel-body">
        ${rows.join('')}
      </div>
    </section>
  `;
}

export function renderSettings(state, engine) {
  const { heroName, createdAt, totalDaysActive, loginStreak } = state;
  const created = new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const activeProfile = engine.getActiveProfile();
  const profiles = engine.getProfiles();

  const aiKey = engine.getAIApiKey();
  const aiEnabled = state.aiEnabled !== false;
  const maskedKey = aiKey ? '••••••••' + aiKey.slice(-4) : 'Not set';
  const lastGen = state.lastAIGenerationDate || 'Never';
  const portfolioUrls = (engine.getPortfolioUrls() || []).join(', ');
  const otherProfiles = profiles.filter(profile => profile.id !== activeProfile?.id);

  const browserRows = [
    renderSettingsRow({
      label: 'Active Profile',
      desc: 'This browser saves data separately for each profile.',
      right: `
        <div class="settings-inline-group settings-inline-wrap settings-inline-end">
          <span class="settings-inline-value">${esc(activeProfile?.name || 'Player 1')}</span>
          <button class="btn btn-ghost btn-sm" id="settings-profile-rename">${Icons.edit} Rename</button>
          <button class="btn btn-ghost btn-sm" id="settings-profile-create">${Icons.plus || '+'} New Profile</button>
        </div>
      `,
    }),
  ];

  if (otherProfiles.length > 0) {
    otherProfiles.forEach((profile, index) => {
      browserRows.push(renderSettingsRow({
        label: esc(profile.name),
        desc: `Last used ${new Date(profile.lastUsedAt).toLocaleString('en-US')}`,
        right: `
          <div class="settings-inline-group">
            <button class="btn btn-ghost btn-sm" data-profile-switch="${profile.id}">Switch</button>
            <button class="btn btn-danger btn-sm" data-profile-delete="${profile.id}">Delete</button>
          </div>
        `,
        noBorder: index === otherProfiles.length - 1,
      }));
    });
  } else {
    browserRows.push(renderSettingsRow({
      label: 'No extra profiles yet',
      desc: 'Create another profile before someone else uses this browser.',
      noBorder: true,
    }));
  }

  const profileRows = [
    renderSettingsRow({
      label: 'Hero Name',
      desc: 'Your character\'s display name',
      right: `<button class="btn btn-ghost btn-sm" id="settings-rename">${Icons.edit} ${esc(heroName)}</button>`,
    }),
    renderSettingsRow({
      label: 'Journey Started',
      desc: created,
      right: `<span class="settings-inline-value">${totalDaysActive} days</span>`,
    }),
    renderSettingsRow({
      label: 'Login Streak',
      desc: 'Consecutive days of activity',
      right: `<span class="settings-inline-value settings-inline-value-accent">${Icons.flame} ${loginStreak} days</span>`,
      noBorder: true,
    }),
  ];

  const aiRows = [
    renderSettingsRow({
      label: 'Gemini API Key',
      desc: `Free key from <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com</a>`,
      right: `
        <div class="settings-inline-group settings-inline-wrap settings-inline-end">
          <span class="settings-inline-value settings-inline-value-mono">${maskedKey}</span>
          <button class="btn btn-ghost btn-sm" id="settings-ai-key">${Icons.edit} ${aiKey ? 'Change' : 'Set Key'}</button>
        </div>
      `,
    }),
    renderSettingsRow({
      label: 'AI Suggestions',
      desc: 'Generate personalized quests & habits daily',
      right: `<button class="btn btn-sm ${aiEnabled ? 'btn-success' : 'btn-ghost'}" id="settings-ai-toggle">${aiEnabled ? 'Enabled' : 'Disabled'}</button>`,
    }),
    renderSettingsRow({
      label: 'Test Connection',
      desc: 'Verify your API key works',
      right: `<button class="btn btn-ghost btn-sm" id="settings-ai-test" ${!aiKey ? 'disabled' : ''}>${Icons.zap} Test</button>`,
    }),
    renderSettingsRow({
      label: 'Refresh Suggestions',
      desc: `Last: ${lastGen}`,
      right: `<button class="btn btn-ghost btn-sm" id="settings-ai-refresh" ${!aiKey ? 'disabled' : ''}>${Icons.sparkles} Regenerate</button>`,
    }),
    renderSettingsRow({
      label: 'Portfolio URLs',
      desc: 'Comma-separated URLs for the AI to scrape your online presence',
      right: `
        <div class="settings-field-row">
          <input type="text" class="input settings-field-input" id="settings-portfolio-urls" placeholder="https://github.com/you, https://yoursite.com" value="${esc(portfolioUrls)}" />
          <button class="btn btn-ghost btn-sm" id="settings-save-urls">Save</button>
        </div>
      `,
      extraClass: 'settings-item-stack',
      noBorder: true,
    }),
  ];

  const dataRows = [
    renderSettingsRow({
      label: 'Export Save',
      desc: 'Download your progress as a JSON file',
      right: `<button class="btn btn-ghost btn-sm" id="settings-export">${Icons.download} Export</button>`,
    }),
    renderSettingsRow({
      label: 'Import Save',
      desc: 'Restore from a backup file',
      right: `<button class="btn btn-ghost btn-sm" id="settings-import">${Icons.upload} Import</button><input type="file" accept=".json" id="settings-import-file" style="display: none;" />`,
    }),
    renderSettingsRow({
      label: 'Factory Reset',
      desc: 'Erase all progress and start fresh. This cannot be undone.',
      right: `<button class="btn btn-danger btn-sm" id="settings-reset">${Icons.alertTriangle} Reset</button>`,
      noBorder: true,
    }),
  ];

  const aboutRows = [
    renderSettingsRow({
      label: 'Replay Guide',
      desc: 'Show the first-time helper again for this browser profile',
      right: `<button class="btn btn-ghost btn-sm" id="settings-replay-guide">${Icons.sparkles} Replay</button>`,
    }),
    renderSettingsRow({
      label: 'LevelZero v1.0',
      desc: 'Gamify your life. Become the hero of your own story.',
      noBorder: true,
    }),
  ];

  return `
    <div class="tab-content settings-page" id="tab-settings">
      <div class="settings-page-header animate-slide-up">
        <div class="settings-page-icon">${Icons.settings}</div>
        <div>
          <h2 class="settings-page-title">Settings</h2>
          <p class="settings-page-subtitle">Tune your profile, AI assistant, and local save controls.</p>
        </div>
      </div>

      <div class="settings-panel-grid">
        ${renderSettingsSection('Browser Profile', browserRows)}
        ${renderSettingsSection('Profile', profileRows)}
        ${renderSettingsSection('AI Agent', aiRows, Icons.sparkles)}
        ${renderSettingsSection('Data Management', dataRows)}
        ${renderSettingsSection('About', aboutRows)}
      </div>
    </div>
  `;
}

export function attachSettingsEvents(engine, rerender) {
  const container = document.getElementById('tab-settings');
  if (container) {
    container.addEventListener('click', (e) => {
      const profileRenameBtn = e.target.closest('#settings-profile-rename');
      if (profileRenameBtn) {
        const activeProfile = engine.getActiveProfile();
        const current = activeProfile?.name || 'Player 1';
        showModal({
          title: 'Rename Browser Profile',
          body: `<input type="text" id="profile-rename-input" class="input" value="${esc(current)}" style="width: 100%; margin-top: 10px;" autocomplete="off" />`,
          confirmText: 'Save',
          onConfirm: () => {
            const input = document.getElementById('profile-rename-input');
            if (input) {
              engine.renameActiveProfile(input.value.trim());
              rerender();
            }
          }
        });
        setTimeout(() => {
          const input = document.getElementById('profile-rename-input');
          if (input) {
            input.focus();
            input.select();
          }
        }, 10);
        return;
      }

      const createProfileBtn = e.target.closest('#settings-profile-create');
      if (createProfileBtn) {
        showModal({
          title: 'Create Browser Profile',
          body: `<input type="text" id="profile-create-input" class="input" placeholder="Player 2" style="width: 100%; margin-top: 10px;" autocomplete="off" />`,
          confirmText: 'Create',
          onConfirm: () => {
            const input = document.getElementById('profile-create-input');
            const profile = engine.createProfile(input?.value || '');
            showToast({ title: 'Profile created', message: `${profile.name} is now active on this browser.`, type: 'success' });
            rerender();
          }
        });
        setTimeout(() => {
          const input = document.getElementById('profile-create-input');
          if (input) input.focus();
        }, 10);
        return;
      }

      const switchBtn = e.target.closest('[data-profile-switch]');
      if (switchBtn) {
        const profileId = switchBtn.dataset.profileSwitch;
        const profile = engine.switchProfile(profileId);
        if (profile) {
          showToast({ title: 'Profile switched', message: `Now using ${profile.name}.`, type: 'success' });
          rerender();
        }
        return;
      }

      const deleteBtn = e.target.closest('[data-profile-delete]');
      if (deleteBtn) {
        const profileId = deleteBtn.dataset.profileDelete;
        const profile = engine.getProfiles().find(entry => entry.id === profileId);
        showModal({
          title: 'Delete Browser Profile',
          body: `<p>Delete <strong>${esc(profile?.name || 'this profile')}</strong> from this browser?</p><p style="margin-top: 0.5rem; color: var(--color-red);">This permanently removes that profile's save, AI settings, and cache on this browser.</p>`,
          confirmText: 'Delete Profile',
          confirmClass: 'btn-danger',
          onConfirm: () => {
            const result = engine.deleteProfile(profileId);
            if (result.success) {
              showToast({ title: 'Profile deleted', message: `${profile?.name || 'Profile'} was removed from this browser.`, type: 'warning' });
              rerender();
            } else {
              showToast({ title: 'Delete blocked', message: result.reason, type: 'warning' });
            }
          }
        });
        return;
      }

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
        setTimeout(() => {
          const input = document.getElementById('rename-input');
          if (input) {
            input.focus();
            input.select();
          }
        }, 10);
        return;
      }
    });
  }

  const aiKeyBtn = document.getElementById('settings-ai-key');
  if (aiKeyBtn) {
    aiKeyBtn.addEventListener('click', () => {
      const current = engine.getAIApiKey();
      showModal({
        title: 'Gemini API Key',
        body: `
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            <p style="margin: 0; color: var(--color-text-secondary);">
              Paste your Gemini API key below. It stays saved in this browser profile.
            </p>
            <input
              type="password"
              id="settings-ai-key-input"
              class="input"
              value="${esc(current)}"
              placeholder="AIza..."
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        `,
        confirmText: 'Save Key',
        onConfirm: () => {
          const input = document.getElementById('settings-ai-key-input');
          const newKey = input ? input.value.trim() : '';
          engine.setAIApiKey(newKey);
          showToast({
            title: newKey ? 'API key saved!' : 'API key cleared',
            message: '',
            type: 'success',
            icon: '🔑'
          });
          rerender();
        }
      });
      setTimeout(() => {
        const input = document.getElementById('settings-ai-key-input');
        if (input) {
          input.focus();
          input.select();
        }
      }, 10);
    });
  }

  const aiToggleBtn = document.getElementById('settings-ai-toggle');
  if (aiToggleBtn) {
    aiToggleBtn.addEventListener('click', () => {
      const current = engine.getState().aiEnabled !== false;
      engine.setAIEnabled(!current);
      showToast({ title: !current ? 'AI Agent enabled' : 'AI Agent disabled', message: '', type: 'success', icon: '🤖' });
      rerender();
    });
  }

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

  const replayGuideBtn = document.getElementById('settings-replay-guide');
  if (replayGuideBtn) {
    replayGuideBtn.addEventListener('click', () => {
      engine.resetIntroGuide();
      showToast({
        title: 'Guide reset',
        message: 'The helper will appear again for this profile.',
        type: 'success',
        icon: Icons.sparkles,
      });
      rerender();
    });
  }

  const exportBtn = document.getElementById('settings-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const success = engine.exportData();
      if (success) {
        showToast({ title: 'Save exported!', message: 'Your progress has been saved to a file.', type: 'success' });
      }
    });
  }

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
