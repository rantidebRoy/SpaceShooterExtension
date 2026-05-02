class Player {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.width = 44;
    this.height = 48;
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 70;

    this.speed = 8;
    this.shootCooldown = 0;
    this.shootCooldownMax = 0.15;

    this.invincible = false;
    this.invincibleTimer = 0;
    this.invincibleDuration = 2;
    
    this.engineFlicker = 0;
  }

  update(deltaTime, keys) {
    if (keys['ArrowLeft'] || keys['KeyA']) this.x -= this.speed * deltaTime * 60;
    if (keys['ArrowRight'] || keys['KeyD']) this.x += this.speed * deltaTime * 60;

    this.x = Math.max(this.width / 2, Math.min(this.canvasWidth - this.width / 2, this.x));

    if (this.shootCooldown > 0) this.shootCooldown -= deltaTime;

    if (this.invincible) {
      this.invincibleTimer -= deltaTime;
      if (this.invincibleTimer <= 0) this.invincible = false;
    }
    
    this.engineFlicker = Math.random() * 8;
  }

  tryShoot() {
    if (this.shootCooldown <= 0) {
      this.shootCooldown = this.shootCooldownMax;
      return new Bullet(this.x, this.y - this.height / 2);
    }
    return null;
  }

  hit() {
    this.invincible = true;
    this.invincibleTimer = this.invincibleDuration;
  }

  getHitbox() {
    return {
      x: this.x - this.width / 2 + 5,
      y: this.y - this.height / 2 + 5,
      width: this.width - 10,
      height: this.height - 10
    };
  }

  draw(ctx) {
    if (this.invincible && Date.now() % 100 < 50) return;

    ctx.save();
    
    // Engine flame
    ctx.fillStyle = '#aaaaaa'; // Light gray
    ctx.beginPath();
    ctx.moveTo(this.x - 8, this.y + this.height / 2);
    ctx.lineTo(this.x + 8, this.y + this.height / 2);
    ctx.lineTo(this.x, this.y + this.height / 2 + 15 + this.engineFlicker);
    ctx.fill();

    // Ship main body (sleek solid design)
    ctx.fillStyle = '#535353'; // Dark gray
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.height / 2); // Nose
    ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2); // Right wing tip
    ctx.lineTo(this.x + this.width / 4, this.y + this.height / 3); // Right inner wing
    ctx.lineTo(this.x, this.y + this.height / 2); // Bottom center
    ctx.lineTo(this.x - this.width / 4, this.y + this.height / 3); // Left inner wing
    ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2); // Left wing tip
    ctx.fill();

    // Ship cockpit
    ctx.fillStyle = '#ffffff'; // White window
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.height / 4);
    ctx.lineTo(this.x + 6, this.y + 4);
    ctx.lineTo(this.x - 6, this.y + 4);
    ctx.fill();

    // Wing cannons/stripes
    ctx.fillStyle = '#aaaaaa'; // Light gray accents
    ctx.fillRect(this.x - this.width / 2 + 2, this.y + this.height / 4, 4, 12);
    ctx.fillRect(this.x + this.width / 2 - 6, this.y + this.height / 4, 4, 12);

    ctx.restore();
  }
}
