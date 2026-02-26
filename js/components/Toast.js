// ============================================
// LevelZero — Toast Notification System
// ============================================

import { Icons } from './Icons.js';

let toastContainer = null;

function ensureContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * Show a toast notification
 * @param {object} options
 * @param {string} options.title - Toast title
 * @param {string} [options.message] - Toast subtitle
 * @param {string} [options.type] - 'success' | 'achievement' | 'level-up' | 'warning'
 * @param {string} [options.icon] - Custom icon SVG string
 * @param {number} [options.duration] - Duration in ms (default 3000)
 */
export function showToast({ title, message = '', type = 'success', icon = '', duration = 3000 }) {
    const container = ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const defaultIcons = {
        success: Icons.check,
        achievement: Icons.trophy,
        'level-up': Icons.star,
        warning: Icons.alertTriangle,
    };

    const iconContent = icon || defaultIcons[type] || Icons.zap;

    toast.innerHTML = `
    <div class="toast-icon"><span style="font-size: 1.2rem;">${iconContent}</span></div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <div class="toast-timer"></div>
  `;

    // Set animation duration for timer
    const timer = toast.querySelector('.toast-timer');
    if (timer) {
        timer.style.animationDuration = `${duration}ms`;
    }

    container.appendChild(toast);

    // Auto dismiss
    setTimeout(() => {
        toast.classList.add('dismissing');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}
