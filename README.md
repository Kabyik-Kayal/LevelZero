# ⚔️ LevelZero — Gamify Your Life

**LevelZero** is a desktop role-playing game where YOU are the main character! 

**Live Website:** [https://www.kabyik.dev/LevelZero/](https://www.kabyik.dev/LevelZero/)

Instead of fighting dragons in a fantasy world, LevelZero turns your actual, real-life goals and daily routines into an RPG. Complete your daily quests, build strong habits, earn gold, and level up your real-life attributes. 

If you fail to do your habits, your character takes damage—so stay consistent to survive!

---

## ✨ Features

- **Personalized AI Dungeon Master**: Connects to an AI to generate custom, personalized daily quests tailored to your career goals and interests!
- **Epic Quest System**: Create one-off tasks (quests) with varying difficulties (Easy, Medium, Hard, Epic). Earning XP boosts your Strength, Intelligence, Charisma, and Vitality!
- **Daily Habit Tracker**: Build consistency. Watch your "streak" go up as you chain daily successful habit completions. 
- **Consequences**: It's a real game. Earn Gold to spend in the Shop. Lose HP (Health Points) if you skip your daily habits. If your HP hits zero, you die and lose all your streaks!
- **Shop & Inventory**: Buy potions, rare titles, and custom themes with your hard-earned gold.
- **Achievements**: Unlock specialized badges for reaching epic milestones. Can you find the secret ones?
- **Total Privacy**: Your game save is stored entirely on your computer. No cloud databases parsing your daily habits.

---

## 🎮 How to Play (The Core Loop)

1. **Add Quests & Habits**: Every day, write down the things you need to do.
2. **Complete Them**: Click the empty circles to cross them off.
3. **Get Rewarded**: You instantly earn **XP** and **Gold**.
4. **Level Up**: When you get enough XP, you level up and earn a new Hero Title!
5. **Spend Gold**: Go to the **Bazaar** (Shop) tab to spend your gold on cool rewards.

---

## 🚀 How to Install (Noob-Friendly Guide)

LevelZero runs as an app on your computer. Here is the absolute easiest way to get it running!

### **Step 1: Download the Files**
Click the green **"Code"** button at the top right of this page and click **"Download ZIP"**. Unzip the folder somewhere on your computer (like your Desktop).

### **Step 2: Download Node.js**
You need a small program called Node.js to run the game.
1. Go to [nodejs.org](https://nodejs.org/)
2. Download and install the version that says **"Recommended for Most Users"**. (Just click Next on everything during the installer).

### **Step 3: Open your Terminal / Command Prompt**
- **On Mac**: Press `Cmd + Space`, type `Terminal`, and hit Enter.
- **On Windows**: Press the `Windows Key`, type `cmd`, and hit Enter.

### **Step 4: Run the Game!**
You just need to type three commands into that black box. Press **Enter** after each line:

1. Tell the computer to go to the unzipped game folder (Replace `Path/To/LevelZero` with wherever you put the folder. *Tip: You can just type `cd ` and then drag the folder into the terminal window!*):
   ```bash
   cd Path/To/LevelZero
   ```

2. Tell it to download the required game files (this takes a minute):
   ```bash
   npm install
   ```

3. Launch the game!
   ```bash
   npm start
   ```

*You only have to do the `npm install` part once! Next time you want to play, just open your terminal, do the `cd` command, and type `npm start`!*

---

## 🤖 Setting up the AI (Highly Recommended!)

LevelZero features an incredibly cool AI integration that acts like your personal Dungeon Master. Here is how to turn it on:

1. Get a **100% free** API key from [Google AI Studio](https://aistudio.google.com/apikey) by clicking "Get API Key". 
2. Open **LevelZero**, and click on the **Config (Settings)** tab on the far right.
3. Under the **AI Agent** section, click **Set Key** and paste that long code you just got.
4. Click **Test** to make sure it connected successfully.
5. *(Optional)* Scroll down to **Portfolio URLs** and put in a link to your Website, LinkedIn, or GitHub.
6. Click **Regenerate**. The AI will scan your links and automatically generate a custom set of daily quests and habits perfectly tailored to what you want to achieve!
