class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 16;
    this.speed = 15;
    this.active = true;
  }

  update(deltaTime) {
    this.y -= this.speed * deltaTime * 60;
    if (this.y + this.height < 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#535353'; // Dark gray
    ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
  }
}
