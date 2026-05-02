# Space Shooter — Project Architecture

Congratulations! The project files are fully built. We've created a functional, modular Chrome Extension game from scratch. Let's break down how everything works.

## 📂 Project Structure

We followed a modular approach to keep the code clean and easy to understand. Here's what we built:

```text
e:\ChromeGame\
├── manifest.json         # Extension configuration (The "ID card")
├── icons/                # Generated icons (16x16, 48x48, 128x128)
│
├── popup/                # The small window when you click the extension
│   ├── popup.html        # UI structure
│   ├── popup.css         # Styling (variables, flexbox, animations)
│   └── popup.js          # Logic (reads high score, launches game)
│
└── game/                 # The core game files
    ├── game.html         # Main game page (Canvas + layered UI)
    ├── game.css          # Full-screen layout and UI overlays
    │
    │   # Game Modules (Object-Oriented JavaScript)
    ├── starfield.js      # Parallax background effect
    ├── player.js         # Spaceship movement, state, and drawing
    ├── bullet.js         # Projectile logic
    ├── enemy.js          # Alien logic, sine-wave movement
    ├── particles.js      # Explosion effects using particle systems
    │
    └── game.js           # THE ORCHESTRATOR: Game Loop and state
```

---

## 🧩 Key Architecture Concepts

### 1. The Game Loop (`game.js`)
At the heart of the game is the **Game Loop**. This is a function that runs 60 times every second using `requestAnimationFrame`.

```javascript
function gameLoop(timestamp) {
  // 1. Calculate time passed (deltaTime)
  const deltaTime = calculateDelta(timestamp);

  // 2. Update logic (move things, check collisions)
  update(deltaTime);

  // 3. Draw everything
  render();

  // 4. Repeat forever
  requestAnimationFrame(gameLoop);
}
```
**Why `deltaTime`?** We use the elapsed time between frames to calculate movement. This ensures the game runs at the same speed regardless of whether the player's monitor is 60Hz or 144Hz.

### 2. Object-Oriented Design (Classes)
Instead of having one giant file with all the code, we split the logic into **Classes** (Player, Enemy, Bullet). Each class is responsible for its own state and behavior:
- **State**: `this.x`, `this.y`, `this.speed`
- **Behavior**: `update()` and `draw()`

The main `game.js` just loops through lists (arrays) of these objects and tells them to update and draw themselves.

### 3. Collision Detection (AABB)
We used **AABB (Axis-Aligned Bounding Box)** collision detection. Every object has a `getHitbox()` method returning `{x, y, width, height}`. The game simply checks if the bullet's rectangle overlaps with the enemy's rectangle.

```javascript
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
```

### 4. Vector Graphics vs Images
Notice we didn't use any external image files for the game (no PNGs for the ship or enemies). Everything is drawn mathematically using the HTML5 Canvas API (`lineTo`, `arc`, `fill`).
- **Pros**: Zero load time, mathematically perfect scaling, easy to animate colors.
- **Cons**: Takes more code to draw complex shapes.

### 5. Chrome Extension Integration
The game is wrapped in a Chrome Extension using `manifest.json`.
- **`chrome.storage.local`**: We use this API to save the High Score. Unlike normal web `localStorage`, this persists across different parts of the extension.
- **`chrome.tabs.create`**: Used in `popup.js` to open the full-screen game in a new browser tab.

---

## 🚀 How to Play / Install

1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select your `e:\ChromeGame` folder
5. Pin the extension to your toolbar, click it, and hit **LAUNCH GAME**!

Take some time to read through the comments in `game.js` and `player.js`. They contain detailed explanations of JavaScript best practices!
