// ============================================
// LevelZero — Modal Component
// ============================================

/**
 * Show a modal dialog
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.body - HTML content
 * @param {string} [options.confirmText] - Confirm button label
 * @param {string} [options.cancelText] - Cancel button label
 * @param {string} [options.confirmClass] - CSS class for confirm button
 * @param {Function} [options.onConfirm]
 * @param {Function} [options.onCancel]
 * @returns {HTMLElement} The overlay element
 */
export function showModal({
    title,
    body,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmClass = 'btn-primary',
    onConfirm = null,
    onCancel = null,
}) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';

    overlay.innerHTML = `
    <div class="modal-content">
      <h2 class="modal-title">${title}</h2>
      <div class="modal-body">${body}</div>
      <div class="modal-actions">
        <button class="btn btn-ghost modal-cancel">${cancelText}</button>
        <button class="btn ${confirmClass} modal-confirm">${confirmText}</button>
      </div>
    </div>
  `;

    const close = () => {
        overlay.style.animation = 'fadeOut 0.2s ease forwards';
        setTimeout(() => overlay.remove(), 200);
    };

    // Event listeners
    overlay.querySelector('.modal-cancel').addEventListener('click', () => {
        if (onCancel) onCancel();
        close();
    });

    overlay.querySelector('.modal-confirm').addEventListener('click', () => {
        if (onConfirm) onConfirm();
        close();
    });

    // Click backdrop to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            if (onCancel) onCancel();
            close();
        }
    });

    // Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            if (onCancel) onCancel();
            close();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(overlay);

    // Focus the confirm button
    overlay.querySelector('.modal-confirm').focus();

    return overlay;
}
