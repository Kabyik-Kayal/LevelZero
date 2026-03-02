// ============================================
// LevelZero — HTML Escape Utility
// Prevents XSS when injecting user text into innerHTML
// ============================================

const ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

const ESCAPE_RE = /[&<>"']/g;

/**
 * Escape HTML special characters to prevent XSS injection.
 * Safe to use inside innerHTML template literals.
 * @param {string} str - Raw user input
 * @returns {string} Escaped string
 */
export function esc(str) {
    if (typeof str !== 'string') return '';
    return str.replace(ESCAPE_RE, ch => ESCAPE_MAP[ch]);
}
