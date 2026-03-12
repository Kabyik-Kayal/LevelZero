// ============================================
// LevelZero — AI Agent
// Scrapes portfolio, generates personalized
// quests & habits via Google Gemini API
// ============================================

import { saveManager } from './SaveManager.js';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_SDK_URL = 'https://esm.sh/@google/genai@0.7.0';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class AIAgentEngine {
    constructor() {
        this._profileCache = null;
        this._sdkPromise = null;
    }

    async _loadGoogleGenAI() {
        if (!this._sdkPromise) {
            this._sdkPromise = import(GEMINI_SDK_URL)
                .then(module => module.GoogleGenAI)
                .catch(err => {
                    this._sdkPromise = null;
                    throw err;
                });
        }

        return this._sdkPromise;
    }

    _isOfflineError(err) {
        const message = String(err?.message || '').toLowerCase();
        return !navigator.onLine
            || message.includes('failed to fetch')
            || message.includes('networkerror')
            || message.includes('load failed')
            || err?.name === 'TypeError';
    }

    // --- Profile Scraping ---

    /**
     * Fetch a URL via CORS proxy, return text content
     */
    async _fetchPage(url) {
        try {
            const proxyUrl = CORS_PROXY + encodeURIComponent(url);
            const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
            if (!response.ok) return null;
            const html = await response.text();
            // Strip HTML tags to get readable text, limit to 3000 chars
            const text = html
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 3000);
            return text;
        } catch (err) {
            console.warn(`[AIAgent] Failed to fetch ${url}:`, err.message);
            return null;
        }
    }

    /**
     * Scrape all pages and build a profile summary, with caching
     * @param {string[]} urls - URLs to scrape
     */
    async scrapeProfile(urls = [], forceRefresh = false) {
        // Check cache
        if (!forceRefresh) {
            const cached = this._loadCache();
            if (cached) {
                this._profileCache = cached;
                return cached;
            }
        }

        if (urls.length === 0) {
            console.warn('[AIAgent] No portfolio URLs configured.');
            return null;
        }

        console.log('[AIAgent] Scraping portfolio...');
        const results = await Promise.allSettled(
            urls.map(url => this._fetchPage(url))
        );

        const sections = [];
        urls.forEach((url, i) => {
            const result = results[i];
            if (result.status === 'fulfilled' && result.value) {
                sections.push(`--- Content from ${url} ---\n${result.value}`);
            }
        });

        const profile = sections.join('\n\n');
        this._profileCache = profile;
        this._saveCache(profile);

        console.log(`[AIAgent] Scraped ${sections.length}/${urls.length} pages.`);
        return profile;
    }

    _loadCache() {
        try {
            const raw = localStorage.getItem(saveManager.getAICacheStorageKey());
            if (!raw) return null;
            const { data, timestamp } = JSON.parse(raw);
            if (Date.now() - timestamp > CACHE_DURATION) return null;
            return data;
        } catch {
            return null;
        }
    }

    _saveCache(data) {
        try {
            localStorage.setItem(saveManager.getAICacheStorageKey(), JSON.stringify({
                data,
                timestamp: Date.now(),
            }));
        } catch (err) {
            console.warn('[AIAgent] Cache save failed:', err.message);
        }
    }

    // --- Gemini API ---

    /**
     * Test if an API key is valid
     */
    async testConnection(apiKey) {
        console.log('[AIAgent] Testing connection with GoogleGenAI SDK...');
        try {
            const GoogleGenAI = await this._loadGoogleGenAI();
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: 'Say "connected" in one word.',
            });
            console.log('[AIAgent] ✓ Connection successful:', response.text);
            return true;
        } catch (err) {
            if (this._isOfflineError(err)) {
                console.warn('[AIAgent] Gemini SDK unavailable while offline.');
            } else {
                console.error('[AIAgent] Test connection error:', err);
            }
            return false;
        }
    }

    /**
     * Generate personalized quests and habits using Gemini
     * @param {string} apiKey
     * @param {object} gameState
     * @param {string[]} urls - Portfolio URLs to scrape
     */
    async generateDailyContent(apiKey, gameState, urls = []) {
        const profile = await this.scrapeProfile(urls);
        if (!profile) {
            console.warn('[AIAgent] No profile data available.');
            return null;
        }

        const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

        const prompt = `You are the AI dungeon master for "LevelZero", a gamified life RPG app.

Based on the player's real-life profile, current game state, and the time context, generate PERSONALIZED and ACTIONABLE quests and habits for today.

=== PLAYER PROFILE (scraped from their portfolio & links) ===
${profile.slice(0, 6000)}

=== CURRENT GAME STATE ===
- Level: ${gameState.stats.level}
- Attributes: STR ${gameState.attributes.strength}, INT ${gameState.attributes.intelligence}, CHA ${gameState.attributes.charisma}, VIT ${gameState.attributes.vitality}
- Active quests: ${gameState.quests.length}
- Active habits: ${gameState.habits.length}
- Completed quests total: ${gameState.completedQuestCount}
- Login streak: ${gameState.loginStreak} days

=== TIME CONTEXT ===
- Day: ${dayOfWeek}
- Time: ${timeOfDay}

=== RULES ===
1. Generate exactly 3 quests and 2 habits
2. IMPORTANT FOR QUESTS: The quests MUST form a structured progression path to help the player get an AI/ML engineering job or internship.
3. Quests should include: updating their resume/portfolio, learning specific ML concepts, building projects (like Cogito, UnArxiv), LeetCode/prep, and sending applications.
4. IMPORTANT FOR HABITS: Focus STRICTLY on building non-technical consistency (e.g., health, mindfulness, sleep schedule, fitness, reading).
5. Emphasize consistency over intensity. Habits should be things they can do every single day.
6. Mix categories: intelligence, strength, charisma, vitality
7. Difficulty must be one of: easy, medium, hard, epic. Use 'easy' or 'medium' for habits.
8. Category must be one of: intelligence, strength, charisma, vitality
9. Keep text concise (max 80 chars)
10. Consider the day of week (weekday = more work focused, weekend = more relaxed/recovery)

=== OUTPUT FORMAT ===
Respond with ONLY valid JSON, no markdown, no backticks, no explanation:
{
  "quests": [
    {"text": "...", "difficulty": "...", "category": "..."},
    {"text": "...", "difficulty": "...", "category": "..."},
    {"text": "...", "difficulty": "...", "category": "..."}
  ],
  "habits": [
    {"text": "...", "category": "..."},
    {"text": "...", "category": "..."}
  ]
}`;

        try {
            console.log(`[AIAgent] Generating with model: ${GEMINI_MODEL}...`);
            const GoogleGenAI = await this._loadGoogleGenAI();
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: prompt,
                config: {
                    temperature: 0.9,
                    response_mime_type: 'application/json',
                }
            });

            const rawText = response.text;
            if (!rawText) return null;

            // Clean and parse JSON
            const cleaned = rawText
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();

            const parsed = JSON.parse(cleaned);
            return this._validateContent(parsed);
        } catch (err) {
            if (this._isOfflineError(err)) {
                console.warn('[AIAgent] AI generation unavailable offline.');
            } else {
                console.error('[AIAgent] Generation failed:', err.message);
            }
            return null;
        }
    }

    /**
     * Validate and sanitize the AI output
     */
    _validateContent(parsed) {
        const validDifficulties = ['easy', 'medium', 'hard', 'epic'];
        const validCategories = ['intelligence', 'strength', 'charisma', 'vitality'];

        const quests = (parsed.quests || [])
            .filter(q => q.text && typeof q.text === 'string')
            .map(q => ({
                text: q.text.slice(0, 80),
                difficulty: validDifficulties.includes(q.difficulty) ? q.difficulty : 'medium',
                category: validCategories.includes(q.category) ? q.category : 'intelligence',
            }))
            .slice(0, 5);

        const habits = (parsed.habits || [])
            .filter(h => h.text && typeof h.text === 'string')
            .map(h => ({
                text: h.text.slice(0, 80),
                category: validCategories.includes(h.category) ? h.category : 'vitality',
            }))
            .slice(0, 4);

        if (quests.length === 0 && habits.length === 0) return null;
        return { quests, habits };
    }
}

export const aiAgent = new AIAgentEngine();
