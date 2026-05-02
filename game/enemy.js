class Enemy {
  constructor(canvasWidth, canvasHeight, speed = 3) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.width = 32;
    this.height = 36;
    this.x = Math.random() * (canvasWidth - this.width * 2) + this.width;
    this.y = -this.height;

    // Straight movement, no wobble
    this.speed = speed + Math.random() * 1;
    this.active = true;
    this.points = Math.round(speed * 100);
  }

  update(deltaTime) {
    // Simply move straight down
    this.y += this.speed * deltaTime * 60;

    if (this.y > this.canvasHeight + this.height) {
      this.active = false;
    }
  }

  getHitbox() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  draw(ctx) {
    ctx.save();
    
    // Solid alien fighter design
    ctx.fillStyle = '#535353'; // Dark gray hull
    
    // Main body
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height / 2); // Bottom point
    ctx.lineTo(this.x + this.width / 2, this.y - this.height / 4); // Right wing tip
    ctx.lineTo(this.x + this.width / 4, this.y - this.height / 2); // Right top
    ctx.lineTo(this.x - this.width / 4, this.y - this.height / 2); // Left top
    ctx.lineTo(this.x - this.width / 2, this.y - this.height / 4); // Left wing tip
    ctx.fill();

    // White core eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing accents
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 4, 8, 12);
    ctx.fillRect(this.x + this.width / 2 - 8, this.y - this.height / 4, 8, 12);

    ctx.restore();
  }
}
