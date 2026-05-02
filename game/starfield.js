class Starfield {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.stars = [];
    this._createStars();
  }

  _createStars() {
    const layers = [
      { count: 40, speed: 0.5, size: 1, color: '#dddddd' },
      { count: 20, speed: 1.0, size: 2, color: '#cccccc' },
      { count: 10, speed: 2.0, size: 2, color: '#aaaaaa' }
    ];

    for (const layer of layers) {
      for (let i = 0; i < layer.count; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          speed: layer.speed,
          size: layer.size,
          color: layer.color
        });
      }
    }
  }

  update(deltaTime) {
    for (const star of this.stars) {
      star.y += star.speed * deltaTime * 60;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    }
  }

  draw(ctx) {
    for (const star of this.stars) {
      ctx.fillStyle = star.color;
      // Drawing squares for retro pixel feel
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }
}
