// ============================================
// LevelZero — SaveManager
// localStorage persistence with versioning
// ============================================

const SAVE_KEY = 'levelzero_save';
const SAVE_VERSION = 1;

export class SaveManager {
    constructor() {
        this._debounceTimer = null;
    }

    /**
     * Save game state to localStorage (debounced)
     */
    save(state) {
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            try {
                const saveData = {
                    version: SAVE_VERSION,
                    timestamp: Date.now(),
                    state: state
                };
                localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
            } catch (err) {
                console.error('[SaveManager] Failed to save:', err);
            }
        }, 500);
    }

    /**
     * Force immediate save (no debounce)
     */
    saveImmediate(state) {
        clearTimeout(this._debounceTimer);
        try {
            const saveData = {
                version: SAVE_VERSION,
                timestamp: Date.now(),
                state: state
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        } catch (err) {
            console.error('[SaveManager] Failed to save:', err);
        }
    }

    /**
     * Load game state from localStorage
     * @returns {object|null} The saved state, or null if not found
     */
    load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return null;

            const saveData = JSON.parse(raw);

            // Version migration (future-proof)
            if (saveData.version !== SAVE_VERSION) {
                return this._migrate(saveData);
            }

            return saveData.state;
        } catch (err) {
            console.error('[SaveManager] Failed to load:', err);
            return null;
        }
    }

    /**
     * Export save data as downloadable JSON file
     */
    exportData(state) {
        try {
            const saveData = {
                version: SAVE_VERSION,
                timestamp: Date.now(),
                exportedAt: new Date().toISOString(),
                state: state
            };
            const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `levelzero-save-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return true;
        } catch (err) {
            console.error('[SaveManager] Export failed:', err);
            return false;
        }
    }

    /**
     * Import save data from a JSON file
     * @param {File} file
     * @returns {Promise<object|null>}
     */
    async importData(file) {
        try {
            const text = await file.text();
            const saveData = JSON.parse(text);

            // Basic validation
            if (!saveData.state || !saveData.version) {
                throw new Error('Invalid save file format');
            }

            // Version check
            if (saveData.version !== SAVE_VERSION) {
                const migrated = this._migrate(saveData);
                return migrated;
            }

            return saveData.state;
        } catch (err) {
            console.error('[SaveManager] Import failed:', err);
            return null;
        }
    }

    /**
     * Delete all save data
     */
    resetAll() {
        try {
            localStorage.removeItem(SAVE_KEY);
            return true;
        } catch (err) {
            console.error('[SaveManager] Reset failed:', err);
            return false;
        }
    }

    /**
     * Check if a save exists
     */
    hasSave() {
        return localStorage.getItem(SAVE_KEY) !== null;
    }

    /**
     * Migrate old save data to current version
     * @private
     */
    _migrate(saveData) {
        // Future: add migration logic per version
        console.log(`[SaveManager] Migrating from v${saveData.version} to v${SAVE_VERSION}`);
        return saveData.state;
    }
}

export const saveManager = new SaveManager();
