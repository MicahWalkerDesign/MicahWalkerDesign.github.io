// In js/components/paperToss/game.js

// Replace the lanes block:
this.lanes = {
  // Distance lanes are vertical (Y). Smaller Y is farther (toward top).
  // NOTE: We intentionally keep bin spawns between 0.25h and 0.50h.
  // Spawning in the lowest 25% (y > 0.75h) is too close/impossible given current throw model.
  A: {
    // Far (highest on screen within allowed band)
    centerY: this.height * 0.28,
    minY: this.height * 0.25,
    maxY: this.height * 0.32
  },
  B: {
    // Mid
    centerY: this.height * 0.38,
    minY: this.height * 0.34,
    maxY: this.height * 0.42
  },
  C: {
    // Near (lowest on screen within allowed band)
    centerY: this.height * 0.48,
    minY: this.height * 0.44,
    maxY: this.height * 0.50
  }
};

// Add fireworks to state initialization:
if (typeof this.state === 'object' && !Array.isArray(this.state)) {
  this.state.fireworks = [];
}

// In placeBinInLane() function:
const safetyMarginY = this.options.binHeight / 2 + 10;  // Keep bin fully inside lane bounds

// Replace jitterRange line only:
const jitterRange = this.width * 0.08; // Slightly reduced jitter for fairness

// After the score is incremented / hit confirmed, add:
this.spawnFirework(
  this.bin.x + this.bin.width / 2,
  this.bin.y + this.bin.height * 0.25
);

// Add these two methods near other draw/update helpers:

spawnFirework(x, y) {
  const count = 14;
  const speed = 2.6;
  const life = 28;
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
    const v = speed * (0.85 + Math.random() * 0.35);
    this.state.fireworks.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      life,
      maxLife: life
    });
  }
}

updateAndDrawFireworks(ctx) {
  if (!this.state.fireworks || this.state.fireworks.length === 0) return;
  for (let i = this.state.fireworks.length - 1; i >= 0; i--) {
    const p = this.state.fireworks[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06; // tiny gravity so sparks fall a bit
    p.life -= 1;

    const t = Math.max(0, p.life) / p.maxLife;
    ctx.save();
    ctx.globalAlpha = 0.9 * t;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (p.life <= 0) {
      this.state.fireworks.splice(i, 1);
    }
  }
}

// In the main draw/render method, after drawing bin and paper but before UI overlays:
this.updateAndDrawFireworks(ctx);

// Remove or disable calls that render the old circle hit animation (e.g., calls to drawScoreCircle or similar).
// For example, if there is a call like:
// this.drawScoreCircle(...);
// Remove or comment out that call so the old circle effect no longer renders.
