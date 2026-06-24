/* ============================================================
   AVLA RUNNER — pure simulation core (no canvas, no React).
   Kept framework-free so it can be unit-tested headlessly in Node.
   AvlaGame.jsx drives this each frame and renders g to a <canvas>.
   ============================================================ */

export const GROUND_H = 96;       // ground band height (px from bottom)
export const CW = 38, CH = 44;    // character size
export const CHAR_X = 58;         // character's fixed x
export const GRAVITY = 2700;      // px/s^2
export const JUMP_V = -980;       // initial jump velocity
export const BASE_SPEED = 300, MAX_SPEED = 760;

const OBSTACLES = [
  { w: 18, h: 26 }, { w: 16, h: 36 }, { w: 30, h: 22 },
  { w: 22, h: 46 }, { w: 14, h: 30 },
];

function rand() { return Math.random(); }

export function createGame(W, H) {
  return {
    W, H,
    charY: H - GROUND_H - CH, vy: 0, air: false, t: 0, blink: 0,
    dist: 0, speed: BASE_SPEED,
    obstacles: [], coins: [], particles: [],
    score: 0, coinScore: 0, coins_n: 0,
    sinceObs: 90, sinceCoin: 140,
    pop: 0, squash: 0, shake: 0, over: false,
  };
}

export function resize(g, W, H) {
  g.W = W; g.H = H;
  if (!g.air) g.charY = H - GROUND_H - CH;
}

export function tryJump(g) {
  if (g.over) return false;
  if (!g.air) { g.vy = JUMP_V; g.air = true; g.squash = -1; return true; }
  return false;
}

function groundY(g) { return g.H - GROUND_H; }

function makeObstacle(W) {
  const k = OBSTACLES[(rand() * OBSTACLES.length) | 0];
  return { x: W + 26, w: k.w, h: k.h, tall: k.h >= 40 };
}

function makeCoin(W, gy) {
  const y = gy - CH - 16 - rand() * 96;
  return { x: W + 32, y, r: 11, got: false };
}

function dust(g, gy) {
  for (let i = 0; i < 6; i++) {
    g.particles.push({
      x: CHAR_X + CW / 2 + (rand() * 16 - 8),
      y: gy - 2,
      vx: (rand() * 2 - 1) * 90 - 40,
      vy: -rand() * 120,
      life: 0.3 + rand() * 0.2, r: 2 + rand() * 2,
    });
  }
}

/* advance the world by dt seconds. returns true on the frame the run ends. */
export function tick(g, dt) {
  if (g.over) return false;
  const gy = groundY(g);
  g.t += dt;
  g.blink = (g.blink + dt) % 3.2;
  g.speed = Math.min(MAX_SPEED, BASE_SPEED + g.dist * 0.018);
  g.dist += g.speed * dt;
  g.score += g.speed * dt * 0.02;
  if (g.pop > 0) g.pop = Math.max(0, g.pop - dt * 2.4);
  if (g.squash !== 0) g.squash *= Math.max(0, 1 - dt * 7);
  if (Math.abs(g.squash) < 0.02) g.squash = 0;
  if (g.shake > 0) g.shake = Math.max(0, g.shake - dt * 3);

  // character physics
  const wasAir = g.air;
  g.vy += GRAVITY * dt;
  g.charY += g.vy * dt;
  const floor = gy - CH;
  if (g.charY >= floor) {
    g.charY = floor;
    if (wasAir && g.vy > 240) { g.squash = 1; dust(g, gy); }
    g.vy = 0; g.air = false;
  }

  // obstacles — spawn by distance gap so they're always clearable
  g.sinceObs += g.speed * dt;
  const minGap = g.speed * 0.7 + 150;
  if (g.sinceObs > minGap + rand() * 190) { g.sinceObs = 0; g.obstacles.push(makeObstacle(g.W)); }
  for (const o of g.obstacles) o.x -= g.speed * dt;
  g.obstacles = g.obstacles.filter((o) => o.x + o.w > -28);

  // coins
  g.sinceCoin += g.speed * dt;
  if (g.sinceCoin > 320 + rand() * 360) { g.sinceCoin = 0; g.coins.push(makeCoin(g.W, gy)); }
  for (const cn of g.coins) cn.x -= g.speed * dt;
  g.coins = g.coins.filter((cn) => !cn.got && cn.x > -28);

  // particles
  for (const p of g.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 1100 * dt; p.life -= dt; }
  if (g.particles.length) g.particles = g.particles.filter((p) => p.life > 0);

  // collisions (forgiving hitbox)
  const cb = { x: CHAR_X + 6, y: g.charY + 5, w: CW - 13, h: CH - 8 };
  for (const o of g.obstacles) {
    const oy = gy - o.h;
    if (cb.x < o.x + o.w - 3 && cb.x + cb.w > o.x + 3 && cb.y + cb.h > oy + 2) {
      g.over = true; g.shake = 1; return true;
    }
  }
  // coin pickup
  for (const cn of g.coins) {
    if (cn.got) continue;
    const dx = cn.x - (CHAR_X + CW / 2), dy = cn.y - (g.charY + CH / 2);
    if (dx * dx + dy * dy < (cn.r + 19) * (cn.r + 19)) {
      cn.got = true; g.coinScore += 10; g.coins_n += 1; g.pop = 1;
    }
  }
  return false;
}

export function totalScore(g) { return Math.floor(g.score + g.coinScore); }
