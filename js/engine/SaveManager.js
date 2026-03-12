// ============================================
// LevelZero — SaveManager
// localStorage persistence with browser profiles
// ============================================

const SAVE_VERSION = 1;
const PROFILE_VERSION = 1;
const LEGACY_SAVE_KEY = 'levelzero_save';
const LEGACY_AI_CACHE_KEY = 'levelzero_ai_profile_cache';
const ACTIVE_PROFILE_KEY = 'levelzero_active_profile_id';
const PROFILES_INDEX_KEY = 'levelzero_profiles';

function makeProfileId() {
    return `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeProfileName(name, fallback = 'Player 1') {
    const trimmed = (name || '').trim();
    return trimmed || fallback;
}

function getSaveKey(profileId) {
    return `levelzero_save_${profileId}`;
}

function getAICacheKey(profileId) {
    return `levelzero_ai_profile_cache_${profileId}`;
}

export class SaveManager {
    constructor() {
        this._debounceTimer = null;
        this._ensureProfilesInitialized();
    }

    _readProfiles() {
        try {
            const raw = localStorage.getItem(PROFILES_INDEX_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed?.profiles) ? parsed.profiles : [];
        } catch (err) {
            console.error('[SaveManager] Failed to read profile index:', err);
            return [];
        }
    }

    _writeProfiles(profiles) {
        localStorage.setItem(PROFILES_INDEX_KEY, JSON.stringify({
            version: PROFILE_VERSION,
            profiles,
        }));
    }

    _ensureProfilesInitialized() {
        let profiles = this._readProfiles();
        let activeProfileId = localStorage.getItem(ACTIVE_PROFILE_KEY);

        if (profiles.length === 0) {
            const migrated = this._migrateLegacySave();
            profiles = migrated ? [migrated] : [this._makeProfile('Player 1')];
            this._writeProfiles(profiles);
        }

        const activeExists = profiles.some(profile => profile.id === activeProfileId);
        if (!activeExists) {
            activeProfileId = profiles[0].id;
            localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
        }

        this._touchProfile(activeProfileId);
    }

    _migrateLegacySave() {
        const legacySave = localStorage.getItem(LEGACY_SAVE_KEY);
        const legacyCache = localStorage.getItem(LEGACY_AI_CACHE_KEY);
        if (!legacySave && !legacyCache) return null;

        const profile = this._makeProfile('Player 1');

        if (legacySave) {
            localStorage.setItem(getSaveKey(profile.id), legacySave);
            localStorage.removeItem(LEGACY_SAVE_KEY);
        }

        if (legacyCache) {
            localStorage.setItem(getAICacheKey(profile.id), legacyCache);
            localStorage.removeItem(LEGACY_AI_CACHE_KEY);
        }

        localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
        return profile;
    }

    _makeProfile(name) {
        const now = Date.now();
        return {
            id: makeProfileId(),
            name: normalizeProfileName(name),
            createdAt: now,
            lastUsedAt: now,
        };
    }

    _touchProfile(profileId) {
        const profiles = this._readProfiles();
        const nextProfiles = profiles.map(profile => (
            profile.id === profileId
                ? { ...profile, lastUsedAt: Date.now() }
                : profile
        ));
        this._writeProfiles(nextProfiles);
    }

    getProfiles() {
        return this._readProfiles().sort((a, b) => b.lastUsedAt - a.lastUsedAt);
    }

    getActiveProfileId() {
        return localStorage.getItem(ACTIVE_PROFILE_KEY);
    }

    getActiveProfile() {
        const activeId = this.getActiveProfileId();
        return this.getProfiles().find(profile => profile.id === activeId) || null;
    }

    createProfile(name) {
        const profiles = this._readProfiles();
        const profileName = normalizeProfileName(name, `Player ${profiles.length + 1}`);
        const profile = this._makeProfile(profileName);
        this._writeProfiles([...profiles, profile]);
        localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
        return profile;
    }

    renameProfile(profileId, name) {
        const profiles = this._readProfiles();
        const nextProfiles = profiles.map(profile => (
            profile.id === profileId
                ? { ...profile, name: normalizeProfileName(name, profile.name) }
                : profile
        ));
        this._writeProfiles(nextProfiles);
        return nextProfiles.find(profile => profile.id === profileId) || null;
    }

    switchProfile(profileId) {
        const profile = this.getProfiles().find(entry => entry.id === profileId);
        if (!profile) return null;
        localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
        this._touchProfile(profileId);
        return this.getActiveProfile();
    }

    deleteProfile(profileId) {
        const profiles = this._readProfiles();
        if (profiles.length <= 1) {
            return { success: false, reason: 'At least one profile is required' };
        }

        const exists = profiles.some(profile => profile.id === profileId);
        if (!exists) {
            return { success: false, reason: 'Profile not found' };
        }

        const nextProfiles = profiles.filter(profile => profile.id !== profileId);
        this._writeProfiles(nextProfiles);
        localStorage.removeItem(getSaveKey(profileId));
        localStorage.removeItem(getAICacheKey(profileId));

        if (this.getActiveProfileId() === profileId) {
            localStorage.setItem(ACTIVE_PROFILE_KEY, nextProfiles[0].id);
            this._touchProfile(nextProfiles[0].id);
        }

        return { success: true };
    }

    getSaveStorageKey(profileId = this.getActiveProfileId()) {
        return getSaveKey(profileId);
    }

    getAICacheStorageKey(profileId = this.getActiveProfileId()) {
        return getAICacheKey(profileId);
    }

    save(state, profileId = this.getActiveProfileId()) {
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            try {
                const saveData = {
                    version: SAVE_VERSION,
                    timestamp: Date.now(),
                    state,
                };
                localStorage.setItem(getSaveKey(profileId), JSON.stringify(saveData));
                this._touchProfile(profileId);
            } catch (err) {
                console.error('[SaveManager] Failed to save:', err);
            }
        }, 500);
    }

    saveImmediate(state, profileId = this.getActiveProfileId()) {
        clearTimeout(this._debounceTimer);
        try {
            const saveData = {
                version: SAVE_VERSION,
                timestamp: Date.now(),
                state,
            };
            localStorage.setItem(getSaveKey(profileId), JSON.stringify(saveData));
            this._touchProfile(profileId);
        } catch (err) {
            console.error('[SaveManager] Failed to save:', err);
        }
    }

    load(profileId = this.getActiveProfileId()) {
        try {
            const raw = localStorage.getItem(getSaveKey(profileId));
            if (!raw) return null;

            const saveData = JSON.parse(raw);
            if (saveData.version !== SAVE_VERSION) {
                return this._migrate(saveData);
            }

            this._touchProfile(profileId);
            return saveData.state;
        } catch (err) {
            console.error('[SaveManager] Failed to load:', err);
            return null;
        }
    }

    exportData(state, profileId = this.getActiveProfileId()) {
        try {
            const profile = this.getProfiles().find(entry => entry.id === profileId);
            const safeName = (profile?.name || 'profile').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
            const saveData = {
                version: SAVE_VERSION,
                timestamp: Date.now(),
                exportedAt: new Date().toISOString(),
                profileId,
                profileName: profile?.name || 'Profile',
                state,
            };
            const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `levelzero-${safeName}-${new Date().toISOString().slice(0, 10)}.json`;
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

    async importData(file) {
        try {
            const text = await file.text();
            const saveData = JSON.parse(text);
            if (!saveData.state || !saveData.version) {
                throw new Error('Invalid save file format');
            }

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

    resetAll(profileId = this.getActiveProfileId()) {
        try {
            clearTimeout(this._debounceTimer);
            localStorage.removeItem(getSaveKey(profileId));
            localStorage.removeItem(getAICacheKey(profileId));
            this._touchProfile(profileId);
            return true;
        } catch (err) {
            console.error('[SaveManager] Reset failed:', err);
            return false;
        }
    }

    hasSave(profileId = this.getActiveProfileId()) {
        return localStorage.getItem(getSaveKey(profileId)) !== null;
    }

    _migrate(saveData) {
        console.log(`[SaveManager] Migrating from v${saveData.version} to v${SAVE_VERSION}`);
        return saveData.state;
    }
}

export const saveManager = new SaveManager();
