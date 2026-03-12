// ============================================
// LevelZero — Intro Guide
// First-time floating guide for new profiles
// ============================================

import { Icons } from './Icons.js';

const GUIDE_STEPS = [
    {
        tab: 'activities',
        stepLabel: 'Arrival',
        title: 'Welcome to LevelZero.',
        body: 'I am Ember, your little guide. This world turns your real life into quests, streaks, levels, and rewards.',
        bullets: [
            `${Icons.sword}<span>Quests give short bursts of progress.</span>`,
            `${Icons.heartPulse}<span>Habits build long-term streaks.</span>`,
            `${Icons.star}<span>XP and gold make progress feel tangible.</span>`,
        ],
    },
    {
        tab: 'activities',
        stepLabel: 'Activities',
        title: 'Your journey begins here.',
        body: 'Use the Activities tab to add work, study, fitness, or recovery goals. Completing them grows your attributes and keeps momentum alive.',
        bullets: [
            `${Icons.target}<span>Add one-off quests you want done today.</span>`,
            `${Icons.activity}<span>Track daily habits you want to repeat.</span>`,
            `${Icons.coins}<span>Every completion turns effort into gold.</span>`,
        ],
    },
    {
        tab: 'character',
        stepLabel: 'Hero',
        title: 'This is your hero sheet.',
        body: 'Your profile tracks level, health, attributes, and your longer story. As you stay consistent, the character becomes a reflection of your real progress.',
        bullets: [
            `${Icons.user}<span>Name and personalize your hero.</span>`,
            `${Icons.shield}<span>Protect HP by not letting habits slip.</span>`,
            `${Icons.award}<span>See your growth in titles and milestones.</span>`,
        ],
    },
    {
        tab: 'shop',
        stepLabel: 'Rewards',
        title: 'Spend progress on real rewards.',
        body: 'The Bazaar lets you cash in gold for breaks, treats, or custom rewards. It keeps discipline paired with something enjoyable.',
        bullets: [
            `${Icons.shoppingBag}<span>Redeem gold for built-in rewards.</span>`,
            `${Icons.gift}<span>Create your own custom reward rituals.</span>`,
            `${Icons.lock}<span>Some rewards stay gated until you grow.</span>`,
        ],
    },
    {
        tab: 'settings',
        stepLabel: 'Command',
        title: 'Settings holds your guide tools.',
        body: 'This is where you manage your browser profile, AI settings, and backups. Each browser profile keeps its own separate save.',
        bullets: [
            `${Icons.settings}<span>Manage browser profiles safely.</span>`,
            `${Icons.sparkles}<span>Connect AI suggestions when you want them.</span>`,
            `${Icons.download}<span>Export or import your progress anytime.</span>`,
        ],
    },
];

function buildMascot() {
    return `
      <div class="intro-guide-mascot" aria-hidden="true">
        <div class="intro-guide-mascot-glow"></div>
        <div class="intro-guide-mascot-shadow"></div>
        <div class="intro-guide-mascot-cape"></div>
        <div class="intro-guide-mascot-arm intro-guide-mascot-arm-left"></div>
        <div class="intro-guide-mascot-arm intro-guide-mascot-arm-right"></div>
        <div class="intro-guide-mascot-hood"></div>
        <div class="intro-guide-mascot-head">
          <span class="intro-guide-mascot-blush intro-guide-mascot-blush-left"></span>
          <span class="intro-guide-mascot-blush intro-guide-mascot-blush-right"></span>
          <span class="intro-guide-mascot-eye"></span>
          <span class="intro-guide-mascot-eye"></span>
          <span class="intro-guide-mascot-mouth"></span>
        </div>
        <div class="intro-guide-mascot-body">
          <div class="intro-guide-mascot-emblem">${Icons.star}</div>
        </div>
        <div class="intro-guide-mascot-feet">
          <span></span>
          <span></span>
        </div>
        <div class="intro-guide-mascot-spark intro-guide-mascot-spark-a">${Icons.sparkles}</div>
        <div class="intro-guide-mascot-spark intro-guide-mascot-spark-b">${Icons.star}</div>
      </div>
    `;
}

export function showIntroGuide({ onStepChange = null, onComplete = null } = {}) {
    const existing = document.getElementById('intro-guide');
    if (existing) return existing;

    const shell = document.createElement('div');
    shell.className = 'intro-guide-shell';
    shell.id = 'intro-guide';

    let stepIndex = 0;

    const close = (completed = false) => {
        shell.classList.add('is-closing');
        setTimeout(() => shell.remove(), 180);
        if (completed && onComplete) {
            onComplete();
        }
    };

    const renderStep = () => {
        const step = GUIDE_STEPS[stepIndex];
        if (onStepChange) {
            onStepChange(step, stepIndex);
        }

        shell.innerHTML = `
          <div class="intro-guide-panel">
            ${buildMascot()}
            <div class="intro-guide-card">
              <div class="intro-guide-eyebrow">
                <span>${step.stepLabel}</span>
                <span>${stepIndex + 1} / ${GUIDE_STEPS.length}</span>
              </div>
              <h3 class="intro-guide-title">${step.title}</h3>
              <p class="intro-guide-body">${step.body}</p>
              <div class="intro-guide-bullets">
                ${step.bullets.map(item => `<div class="intro-guide-bullet">${item}</div>`).join('')}
              </div>
              <div class="intro-guide-dots">
                ${GUIDE_STEPS.map((_, index) => `<span class="intro-guide-dot ${index === stepIndex ? 'active' : ''}"></span>`).join('')}
              </div>
              <div class="intro-guide-actions">
                <button class="btn btn-ghost intro-guide-skip" type="button">Skip</button>
                <div class="intro-guide-actions-right">
                  ${stepIndex > 0 ? '<button class="btn btn-ghost intro-guide-back" type="button">Back</button>' : ''}
                  <button class="btn btn-primary intro-guide-next" type="button">${stepIndex === GUIDE_STEPS.length - 1 ? 'Begin Journey' : 'Next'}</button>
                </div>
              </div>
            </div>
          </div>
        `;

        shell.querySelector('.intro-guide-skip')?.addEventListener('click', () => close(true));
        shell.querySelector('.intro-guide-back')?.addEventListener('click', () => {
            stepIndex = Math.max(0, stepIndex - 1);
            renderStep();
        });
        shell.querySelector('.intro-guide-next')?.addEventListener('click', () => {
            if (stepIndex >= GUIDE_STEPS.length - 1) {
                close(true);
                return;
            }
            stepIndex += 1;
            renderStep();
        });
    };

    document.body.appendChild(shell);
    renderStep();

    return shell;
}
