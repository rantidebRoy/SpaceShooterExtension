class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;

    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.life = 1.0;
    this.decay = 0.02 + Math.random() * 0.03;
    this.size = 2 + Math.random() * 2;
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime * 60;
    this.y += this.vy * deltaTime * 60;
    this.life -= this.decay * deltaTime * 60;
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    // Square particles for retro feel without shadows
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1.0;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  createExplosion(x, y, count = 15, isPlayer = false) {
    const color = isPlayer ? '#535353' : '#aaaaaa';
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  update(deltaTime) {
    this.particles.forEach(p => p.update(deltaTime));
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }
}
