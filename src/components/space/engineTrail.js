import { engineOrigin, frameDelta } from './spacePhysics.js';

const colors = ['#9ceafa', '#c1f1ff', '#f3fcff', '#c8bdf1'];
export class EngineTrail {
  constructor(capacity = 64) {
    this.particles = Array.from({ length: capacity }, () => ({ expires: 0 }));
    this.cursor = 0;
    this.emitted = 0;
  }
  emit(from, to, heading, now, deltaMs) {
    const dx = to.x - from.x, dy = to.y - from.y;
    const distance = Math.hypot(dx, dy);
    if (!Number.isFinite(distance) || distance < .5) return 0;
    const elapsed = deltaMs > 0 ? deltaMs : frameDelta(now, 0);
    const speed = Math.min(2400, distance / elapsed * 1000);
    const count = Math.min(3, Math.max(1, Math.ceil(distance / 18)));
    const life = 360 + Math.min(280, speed * .12);
    for (let i = 0; i < count; i++) {
      const fraction = (i + 1) / count;
      const origin = engineOrigin({ x: from.x + dx * fraction, y: from.y + dy * fraction }, heading);
      const particle = this.particles[this.cursor++ % this.particles.length];
      const drift = 18 + Math.min(50, speed * .025);
      Object.assign(particle, { ...origin, vx: -Math.cos(heading) * drift, vy: -Math.sin(heading) * drift, life, expires: now + life, color: colors[this.cursor % colors.length] });
      this.emitted++;
    }
    return count;
  }
  draw(context, now, deltaMs, width, height) {
    context.clearRect(0, 0, width, height);
    let alive = 0;
    for (const particle of this.particles) {
      if (particle.expires <= now) continue;
      alive++;
      particle.x += particle.vx * deltaMs / 1000;
      particle.y += particle.vy * deltaMs / 1000;
      const alpha = (particle.expires - now) / particle.life;
      const size = alpha > .55 ? 4 : alpha > .2 ? 3 : 2;
      context.fillStyle = particle.color;
      context.globalAlpha = alpha * .17;
      context.fillRect(Math.round(particle.x) - 1, Math.round(particle.y) - 1, size + 2, size + 2);
      context.globalAlpha = alpha * .95;
      context.fillRect(Math.round(particle.x), Math.round(particle.y), size, size);
    }
    context.globalAlpha = 1;
    return alive;
  }
  clear() { this.particles.forEach(particle => { particle.expires = 0; }); }
}

