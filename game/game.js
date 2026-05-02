

class InputHandler {
  constructor() {
    this.keys = {};
    
    // Arrow functions '() => {}' automatically bind 'this' to the class instance.
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      // Prevent browser from scrolling when pressing space or arrow keys
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  isPressed(code) {
    return !!this.keys[code];
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.input = new InputHandler();

    // UI Elements mapped in a clean object
    this.ui = {
      hud: document.getElementById('hud'),
      score: document.getElementById('scoreDisplay'),
      lives: document.getElementById('livesDisplay'),
      startScreen: document.getElementById('startScreen'),
      gameOverScreen: document.getElementById('gameOverScreen'),
      pauseScreen: document.getElementById('pauseScreen'),
      finalScore: document.getElementById('finalScore'),
      bestScore: document.getElementById('bestScore'),
      startBtn: document.getElementById('startBtn'),
      restartBtn: document.getElementById('restartBtn'),
      pauseBtn: document.getElementById('pauseBtn'),
      resumeBtn: document.getElementById('resumeBtn'),
      offlinePromptScreen: document.getElementById('offlinePromptScreen'),
      waitingScreen: document.getElementById('waitingScreen'),
      yesPlayBtn: document.getElementById('yesPlayBtn'),
      noWaitBtn: document.getElementById('noWaitBtn')
    };

    // Game State
    this.highScore = 0;
    this.lastFrameTime = 0;

    // Check if we were redirected due to offline error
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('url')) {
      this.state = 'prompt';
      this.ui.startScreen.classList.add('hidden');
      this.ui.offlinePromptScreen.classList.remove('hidden');
    } else {
      this.state = 'menu';
    }

    // Bind event listeners
    this.ui.startBtn.addEventListener('click', () => this.start());
    this.ui.restartBtn.addEventListener('click', () => this.start());
    this.ui.pauseBtn.addEventListener('click', () => this.pause());
    this.ui.resumeBtn.addEventListener('click', () => this.resume());
    
    this.ui.yesPlayBtn.addEventListener('click', () => {
      this.ui.offlinePromptScreen.classList.add('hidden');
      this.ui.startScreen.classList.remove('hidden');
      this.state = 'menu';
    });
    
    this.ui.noWaitBtn.addEventListener('click', () => {
      this.ui.offlinePromptScreen.classList.add('hidden');
      this.ui.waitingScreen.classList.remove('hidden');
      this.state = 'waiting';
    });

    window.addEventListener('resize', () => this.resizeCanvas());

    // Initial setup
    this.resizeCanvas();
    this.loadHighScore();
    
    // Kick off the loop
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Recreate starfield to cover the new canvas size
    this.starfield = new Starfield(this.canvas.width, this.canvas.height);
  }

  loadHighScore() {
    try {
      chrome.storage.local.get('highScore', (result) => {
        this.highScore = result.highScore || 0;
      });
    } catch (e) {
      this.highScore = 0; // Fallback if running outside Chrome Extension
    }
  }

  start() {
    this.state = 'playing';
    this.score = 0;
    this.lives = 3;
    
    // Difficulty Settings
    this.enemySpawnTimer = 0;
    this.enemySpawnInterval = 1.5;
    this.difficultyTimer = 0;
    this.currentEnemySpeed = 2;

    // Reset Game Objects
    this.player = new Player(this.canvas.width, this.canvas.height);
    this.bullets = [];
    this.enemies = [];
    this.particles = new ParticleSystem();
    this.starfield = new Starfield(this.canvas.width, this.canvas.height);

    // Update UI
    this.updateHUD();
    this.ui.startScreen.classList.add('hidden');
    this.ui.gameOverScreen.classList.add('hidden');
    this.ui.hud.classList.remove('hidden');
  }

  gameOver() {
    this.state = 'gameover';

    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        chrome.storage.local.set({ highScore: this.highScore });
      } catch (e) {}
    }

    this.ui.finalScore.textContent = this.score;
    this.ui.bestScore.textContent = this.highScore;

    this.ui.hud.classList.add('hidden');
    this.ui.gameOverScreen.classList.remove('hidden');
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.ui.pauseScreen.classList.remove('hidden');
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.ui.pauseScreen.classList.add('hidden');
    // Prevent huge deltaTime jump after resuming
    this.lastFrameTime = performance.now();
  }

  updateHUD() {
    this.ui.score.textContent = this.score;
    this.ui.lives.textContent = '▲ '.repeat(Math.max(0, this.lives));
  }

  /**
   * Helper utility for Axis-Aligned Bounding Box (AABB) collision
   */
  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  update(deltaTime) {
    this.starfield.update(deltaTime);
    
    if (this.state !== 'playing') return;

    // Update Player
    this.player.update(deltaTime, this.input.keys);

    if (this.input.isPressed('Space')) {
      const bullet = this.player.tryShoot();
      if (bullet) this.bullets.push(bullet);
    }

    // Update Bullets
    this.bullets.forEach(b => b.update(deltaTime));
    this.bullets = this.bullets.filter(b => b.active);

    // Update Enemies
    this.enemies.forEach(e => e.update(deltaTime));
    this.enemies = this.enemies.filter(e => e.active);

    // Enemy Spawning
    this.enemySpawnTimer -= deltaTime;
    if (this.enemySpawnTimer <= 0) {
      this.enemies.push(new Enemy(this.canvas.width, this.canvas.height, this.currentEnemySpeed));
      this.enemySpawnTimer = this.enemySpawnInterval;
    }

    // Difficulty Scaling
    this.difficultyTimer += deltaTime;
    if (this.difficultyTimer >= 10) {
      this.difficultyTimer = 0;
      this.currentEnemySpeed += 0.3;
      this.enemySpawnInterval = Math.max(0.4, this.enemySpawnInterval - 0.1);
    }

    // Collisions
    this.handleCollisions();

    // Update Particles
    this.particles.update(deltaTime);
  }

  handleCollisions() {
    // 1. Bullets vs Enemies
    for (const bullet of this.bullets) {
      if (!bullet.active) continue;
      
      for (const enemy of this.enemies) {
        if (!enemy.active) continue;
        
        if (this.checkCollision(bullet, enemy.getHitbox())) {
          bullet.active = false;
          enemy.active = false;
          
          this.score += enemy.points;
          this.updateHUD();
          this.particles.createExplosion(enemy.x, enemy.y, 20, false);
        }
      }
    }

    // 2. Player vs Enemies
    if (!this.player.invincible) {
      for (const enemy of this.enemies) {
        if (!enemy.active) continue;
        
        if (this.checkCollision(this.player.getHitbox(), enemy.getHitbox())) {
          enemy.active = false;
          
          this.particles.createExplosion(enemy.x, enemy.y, 15, false);
          this.particles.createExplosion(this.player.x, this.player.y, 30, true);
          
          this.player.hit();
          this.lives--;
          this.updateHUD();
          
          if (this.lives <= 0) {
            this.gameOver();
            return;
          }
        }
      }
    }
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.starfield.draw(this.ctx);

    // Draw game objects if active
    if (this.state === 'playing' || this.state === 'gameover' || this.state === 'paused') {
      this.bullets.forEach(b => b.draw(this.ctx));
      this.enemies.forEach(e => e.draw(this.ctx));
      if (this.state === 'playing') this.player.draw(this.ctx);
      this.particles.draw(this.ctx);
    }
  }

  loop(timestamp) {
    // Calculate deltaTime in seconds, clamp to 0.1s max to prevent huge jumps
    const deltaTime = this.lastFrameTime ? (timestamp - this.lastFrameTime) / 1000 : 1 / 60;
    this.lastFrameTime = timestamp;
    const clampedDelta = Math.min(deltaTime, 0.1);

    this.update(clampedDelta);
    this.render();

    // Request next frame
    requestAnimationFrame((ts) => this.loop(ts));
  }
}

// Initialize the game
const game = new Game();

// ==========================================
// AUTO-RELOAD LOGIC FOR OFFLINE INTERCEPTION
// ==========================================
// When the browser detects the internet is back online...
window.addEventListener('online', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const originalUrl = urlParams.get('url');
  
  if (originalUrl) {
    // Optionally change the title or show a message
    document.title = "Reconnecting...";
    // Redirect back to the original page
    window.location.href = originalUrl;
  }
});
