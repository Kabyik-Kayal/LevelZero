# LevelZero — Gamify Your Life

LevelZero is a beautiful, gamified life-tracker RPG built with Vanilla JavaScript, HTML, and CSS, packaged as a standalone desktop app with Electron. It turns your daily routines into a role-playing game where you are the main character. Complete quests, build habits, earn gold, unlock achievements, and level up your real-life attributes.

## Features

- **Personalized AI Agent**: Connects to the Gemini API to scrape your online portfolio and dynamically generate personalized daily quests and habits tailored to your career goals and interests. (Requires a free Gemini API key).
- **Quest System**: Add one-off tasks (quests) with different difficulties (Easy, Medium, Hard, Epic) and categories (Strength, Intelligence, Charisma, Vitality).
- **Habit Tracker**: Build daily consistency. Habits track your current and longest streaks.
- **Starter Packs**: Quick-start your journey with curated packs of quests and habits (e.g., MLOps Grind, Desk Jockey Fitness, Otaku Recovery).
- **RPG Mechanics**: Earn XP to level up, and Gold to spend in the Shop. Lose HP if you fail to complete your daily quests.
- **Shop & Inventory**: Buy potions, titles, and themes with your hard-earned gold.
- **Achievements**: Unlock badges for reaching milestones.
- **Local Storage**: Your progress is saved entirely in your browser. No database required.
- **Data Portability**: Export and import your save file as JSON to backup or transfer your progress.

## Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES Modules)
- **Desktop**: Electron (standalone macOS `.dmg` builds via `electron-builder`)
- **AI Integration**: `@google/genai` (Google Gemini SDK, bundled via npm)
- **Architecture**: Modular vanilla JS with a custom EventBus and State Manager. No frontend frameworks.

## Getting Started

### Desktop App (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/LevelZero.git
   cd LevelZero
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app:**
   ```bash
   npm start
   ```

4. **Build a distributable `.dmg`:**
   ```bash
   npm run dist
   ```

### Web (Browser)

You can also run LevelZero in the browser. Since the app uses ES Modules, it must be served over a local web server.

```bash
python3 -m http.server 8080   # or: npx serve .
# Open http://localhost:8080
```

## Setting up the AI Agent

To enable personalized quests and habits:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Inside the app, click on the **Settings** tab.
3. Under the **AI Agent** section, click **Set Key** and paste your Gemini API key.
4. Click **Test** to ensure the connection works.
5. Click **Regenerate** to scrape your portfolio and generate your first set of personalized suggestions!

## Project Structure

```text
LevelZero/
├── index.html          # Main entry point and layout
├── main.js             # Electron main process
├── preload.js          # Electron preload script
├── package.json        # npm config & electron-builder settings
├── assets/             # App icon
│   └── icon.png
├── css/                # Vanilla CSS files structured by component
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
└── js/                 # Modular JavaScript structure
    ├── app.js          # Main initializer and event wiring
    ├── engine/         # Core game logic and state
    │   ├── GameEngine.js
    │   ├── EventBus.js
    │   ├── SaveManager.js
    │   └── AIAgent.js  # Gemini API integration
    ├── modules/        # UI rendering logic for tabs
    │   ├── Activities.js  # Unified quests + habits view
    │   ├── Character.js
    │   ├── Shop.js
    │   ├── Achievements.js
    │   └── Settings.js
    ├── components/     # Reusable UI components
    │   ├── Header.js
    │   ├── Icons.js
    │   ├── Modal.js
    │   └── Toast.js
    └── data/           # Hardcoded game content
        ├── achievements.js
        ├── dailyQuests.js
        ├── shopItems.js
        ├── starterPacks.js
        └── titles.js
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
