# LevelZero — Gamify Your Life

LevelZero is a beautiful, gamified life-tracker RPG built with pure Vanilla JavaScript, HTML, and CSS. It turns your daily routines into a role-playing game where you are the main character. Complete quests, build habits, earn gold, unlock achievements, and level up your real-life attributes.

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

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ESModules)
- **AI Integration**: `@google/genai` (Google Gemini SDK via ESM CDN)
- **Architecture**: Modular vanilla JS with a custom EventBus and State Manager. No frameworks.

## Getting Started

Since the app uses ES Modules, it must be served over a local web server (opening the `index.html` directly in the browser via `file://` will not work due to CORS restrictions on modules).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/LevelZero.git
   cd LevelZero
   ```

2. **Run a local web server:**
   You can use python, Node.js, or any simple HTTP server.
   
   *Using Python (macOS/Linux usually have this pre-installed):*
   ```bash
   python3 -m http.server 8080
   ```
   
   *Using Node.js (via npx):*
   ```bash
   npx serve .
   ```

3. **Open the app:**
   Navigate to `http://localhost:8080` in your web browser.

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
├── css/                # Vanilla CSS files structured by component
│   ├── base.css
│   ├── components.css
│   ├── animations.css
│   └── variables.css
└── js/                 # Modular JavaScript structure
    ├── app.js          # Main initializer and event wiring
    ├── engine/         # Core game logic and state
    │   ├── GameEngine.js
    │   ├── EventBus.js
    │   ├── SaveManager.js
    │   └── AIAgent.js  # Gemini API integration
    ├── modules/        # UI rendering logic for tabs
    │   ├── Dashboard.js
    │   ├── Habits.js
    │   ├── Shop.js
    │   ├── Profile.js
    │   └── Settings.js
    ├── components/     # Reusable UI components
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
