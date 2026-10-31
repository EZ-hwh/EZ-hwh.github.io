// A generative cyanotype, drawn in the browser.
// 1. Brush a sheet of Prussian-blue "emulsion" with ragged edges.
// 2. Lay evenly spaced streamlines of a noise field across it, stopping short of the
//    name's letterforms, like objects laid on the paper.
// 3. Develop: the lines grow outward from their seeds.
// The same seed always gives the same print.

type RGB = [number, number, number];

const GROUND: RGB = [28, 76, 133]; // #1C4C85
const GROUND_DEEP: RGB = [16, 52, 98]; // #103462
const EXPOSED: RGB = [238, 242, 245]; // #EEF2F5

const mix = (a: RGB, b: RGB, t: number): RGB =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;
const rgb = (c: RGB, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* ---------- seeded randomness ---------- */

/** A print number from any text, so the same text always gets the same print. */
export function seedFrom(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return 1 + ((h >>> 0) % 9999);
}

export type Rand = () => number;
export type Noise = (x: number, y: number) => number;

export function mulberry32(seed: number): Rand {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeNoise(rand: Rand): Noise {
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (h: number, x: number, y: number) => {
    switch (h & 7) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      case 3: return -x - y;
      case 4: return x;
      case 5: return -x;
      case 6: return y;
      default: return -y;
    }
  };
  return (x, y) => {
    let X = Math.floor(x);
    let Y = Math.floor(y);
    x -= X;
    y -= Y;
    X &= 255;
    Y &= 255;
    const u = fade(x);
    const v = fade(y);
    const aa = p[p[X] + Y], ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y], bb = p[p[X + 1] + Y + 1];
    const l1 = grad(aa, x, y) + u * (grad(ba, x - 1, y) - grad(aa, x, y));
    const l2 = grad(ab, x, y - 1) + u * (grad(bb, x - 1, y - 1) - grad(ab, x, y - 1));
    return l1 + v * (l2 - l1);
  };
}

/* ---------- 1. the brushed emulsion ---------- */

export function brushSheet(
  W: number,
  H: number,
  rand: Rand,
  noise: Noise,
  opts: { dpr?: number; margin?: number } = {},
): HTMLCanvasElement {
  const dpr = opts.dpr ?? 1;
  const off = document.createElement("canvas");
  off.width = Math.round(W * dpr);
  off.height = Math.round(H * dpr);
  const c = off.getContext("2d")!;
  c.scale(dpr, dpr);

  const m = Math.max(10, Math.min(W, H) * (opts.margin ?? 0.045));
  const row = 1.4;
  c.lineCap = "round";

  for (let y = 0; y <= H; y += row) {
    const nL = noise(y * 0.035, 3.1) * 0.5 + noise(y * 0.15, 7.7) * 0.25;
    const nR = noise(y * 0.035, 11.3) * 0.5 + noise(y * 0.15, 17.9) * 0.25;
    let x0 = m + nL * m * 0.9;
    let x1 = W - m + nR * m * 0.9;
    // bristles: the odd row reaches further where the brush started or lifted
    if (rand() < 0.07) x0 -= rand() * m * 0.8;
    if (rand() < 0.07) x1 += rand() * m * 0.8;
    const shade = 0.5 + noise(y * 0.012, 23.4) * 0.6 + (rand() - 0.5) * 0.12;
    c.strokeStyle = rgb(mix(GROUND, GROUND_DEEP, Math.min(1, Math.max(0, shade))), 0.97);
    c.lineWidth = row + 0.9;
    c.beginPath();
    c.moveTo(x0, y);
    c.lineTo(x1, y);
    c.stroke();
    // dry-brush tails: thin, faint, slightly bent
    if (rand() < 0.08) {
      const len = m * (0.25 + rand() * 0.6);
      const bend = (rand() - 0.5) * 2.2;
      const left = rand() < 0.5;
      const xa = left ? x0 : x1;
      const xb = left ? x0 - len : x1 + len;
      c.strokeStyle = rgb(GROUND, 0.25 + rand() * 0.3);
      c.lineWidth = 0.4 + rand() * 0.5;
      c.beginPath();
      c.moveTo(xa, y);
      c.quadraticCurveTo((xa + xb) / 2, y + bend, xb, y + bend * 1.6);
      c.stroke();
    }
  }

  // ragged top and bottom edges
  c.globalCompositeOperation = "destination-out";
  c.fillStyle = "#000";
  for (const edge of ["top", "bottom"] as const) {
    c.beginPath();
    // reach past the canvas so no partly covered pixel row survives at the very edge
    const yBase = edge === "top" ? -4 : H + 4;
    const pts: [number, number][] = [];
    for (let x = -4; x <= W + 7; x += 3) {
      const n = noise(x * 0.02, edge === "top" ? 31.7 : 41.3) * 0.6 + noise(x * 0.11, 5.5) * 0.25;
      const d = m * 0.85 + n * m * 0.7 + (rand() < 0.04 ? -rand() * m * 0.5 : 0);
      pts.push([x, edge === "top" ? d : H - d]);
    }
    c.moveTo(-4, yBase);
    for (const [x, y] of pts) c.lineTo(x, y);
    c.lineTo(pts[pts.length - 1][0], yBase);
    c.closePath();
    c.fill();
  }

  // mottling: uneven exposure across the sheet
  c.globalCompositeOperation = "source-atop";
  const blobs = Math.round((W * H) / 9000);
  for (let i = 0; i < blobs; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 20 + rand() * Math.min(W, H) * 0.35;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    const dark = rand() < 0.55;
    g.addColorStop(0, dark ? "rgba(10,36,74,0.10)" : "rgba(70,120,180,0.07)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // grain
  const tile = document.createElement("canvas");
  tile.width = tile.height = 96;
  const t = tile.getContext("2d")!;
  const img = t.createImageData(96, 96);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = rand() < 0.5 ? 0 : 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.floor(rand() * 26);
  }
  t.putImageData(img, 0, 0);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = c.createPattern(tile, "repeat")!;
  c.fillRect(0, 0, off.width, off.height);

  return off;
}

/* ---------- 2. evenly spaced streamlines ---------- */

interface Point { x: number; y: number; s: number }
interface Line { pts: Point[]; seed: number; width: number; tone: number }

function streamlines(W: number, H: number, rand: Rand, noise: Noise, obstacle: (x: number, y: number) => boolean): Line[] {
  // Line spacing and curl size follow the print's overall size, not just its short side,
  // so a low, wide strip keeps the same airy density as a taller print.
  const scale = Math.max(Math.min(W, H), Math.max(W, H) * 0.4, 330);
  const dsep = Math.max(6, scale * (0.016 + rand() * 0.01));
  const dtest = dsep * 0.55;
  const step = 1.1;
  const freq = (1.1 + rand() * 1.6) / scale;
  const swirl = 1.2 + rand() * 1.4;
  const drift = rand() * Math.PI * 2;
  const angle = (x: number, y: number) =>
    drift + noise(x * freq, y * freq) * Math.PI * swirl + noise(x * freq * 2.7 + 50, y * freq * 2.7) * 0.6;

  const cell = dsep;
  const cols = Math.ceil(W / cell) + 1;
  const rows = Math.ceil(H / cell) + 1;
  const grid: { x: number; y: number; id: number; s: number }[][] = Array.from({ length: cols * rows }, () => []);
  const key = (x: number, y: number) => Math.floor(y / cell) * cols + Math.floor(x / cell);

  function clear(x: number, y: number, d: number, id: number, s: number): boolean {
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    const d2 = d * d;
    for (let j = cy - 1; j <= cy + 1; j++) {
      if (j < 0 || j >= rows) continue;
      for (let i = cx - 1; i <= cx + 1; i++) {
        if (i < 0 || i >= cols) continue;
        for (const q of grid[j * cols + i]) {
          if (q.id === id && Math.abs(q.s - s) < 40) continue;
          const dx = q.x - x;
          const dy = q.y - y;
          if (dx * dx + dy * dy < d2) return false;
        }
      }
    }
    return true;
  }

  const lines: Line[] = [];
  const seeds: [number, number][] = [];
  const sp = dsep * 1.3;
  for (let y = sp / 2; y < H; y += sp)
    for (let x = sp / 2; x < W; x += sp) seeds.push([x + (rand() - 0.5) * sp, y + (rand() - 0.5) * sp]);
  for (let i = seeds.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [seeds[i], seeds[j]] = [seeds[j], seeds[i]];
  }

  const inBounds = (x: number, y: number) => x > -4 && y > -4 && x < W + 4 && y < H + 4;

  for (const [sx, sy] of seeds) {
    if (!inBounds(sx, sy) || obstacle(sx, sy)) continue;
    const id = lines.length;
    if (!clear(sx, sy, dsep, id, 0)) continue;

    const trace = (dir: 1 | -1) => {
      const pts: Point[] = [];
      let x = sx;
      let y = sy;
      for (let s = 1; s < 900; s++) {
        const a = angle(x, y);
        const nx = x + Math.cos(a) * step * dir;
        const ny = y + Math.sin(a) * step * dir;
        if (!inBounds(nx, ny) || obstacle(nx, ny) || !clear(nx, ny, dtest, id, s * dir)) break;
        x = nx;
        y = ny;
        pts.push({ x, y, s: s * dir });
      }
      return pts;
    };
    const fwd = trace(1);
    const back = trace(-1);
    const pts = back.reverse().concat([{ x: sx, y: sy, s: 0 }], fwd);
    if (pts.length * step < dsep * 2.5) continue;

    for (const q of pts) grid[key(q.x, q.y)]?.push({ x: q.x, y: q.y, id, s: q.s });
    lines.push({ pts, seed: back.length, width: 0.55 + Math.pow(rand(), 2) * 1.5, tone: 0.72 + rand() * 0.28 });
  }
  return lines;
}

/* The name is laid on the paper like a stencil: its letterforms, plus a thin margin,
   are kept clear so lines flow up to them. */
function nameMask(W: number, H: number, frame: DOMRect, nameEl: HTMLElement) {
  const off = document.createElement("canvas");
  off.width = Math.ceil(W);
  off.height = Math.ceil(H);
  const c = off.getContext("2d", { willReadFrequently: true })!;
  const cs = getComputedStyle(nameEl);
  const size = parseFloat(cs.fontSize);
  c.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`;
  if ("letterSpacing" in c) (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
  const pad = Math.max(5, size * 0.075);
  c.fillStyle = c.strokeStyle = "#000";
  c.lineWidth = pad * 2;
  c.lineJoin = "round";
  const range = document.createRange();
  nameEl.querySelectorAll("span").forEach((span) => {
    range.selectNodeContents(span); // the glyph box, whether the span is inline or block
    const r = range.getBoundingClientRect();
    const text = span.textContent ?? "";
    const m = c.measureText(text);
    const sx = m.width ? r.width / m.width : 1;
    const ascent = m.fontBoundingBoxAscent || size * 0.9;
    c.save();
    c.translate(r.left - frame.left, r.top - frame.top + ascent);
    c.scale(sx, 1);
    c.fillText(text, 0, 0);
    c.strokeText(text, 0, 0);
    c.restore();
  });
  const w = off.width;
  const h = off.height;
  const alpha = c.getImageData(0, 0, w, h).data;
  return (x: number, y: number) => {
    const xi = x | 0;
    const yi = y | 0;
    if (xi < 0 || yi < 0 || xi >= w || yi >= h) return false;
    return alpha[(yi * w + xi) * 4 + 3] > 0;
  };
}

/* ---------- 3. develop ---------- */

export interface PrintTarget {
  figure: HTMLElement;
  canvas: HTMLCanvasElement;
  nameEl: HTMLElement;
}

/** Draws print `seed` into the canvas. Returns a function that stops an animation in progress. */
export function developPrint(target: PrintTarget, seed: number, animate: boolean, onDone?: () => void): () => void {
  const { figure, canvas, nameEl } = target;
  const ctx = canvas.getContext("2d")!;
  const frame = figure.getBoundingClientRect();
  const W = frame.width;
  const H = frame.height;
  if (W < 10 || H < 10) {
    onDone?.();
    return () => {};
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);

  const rand = mulberry32(seed);
  const noise = makeNoise(rand);
  const sheet = brushSheet(W, H, rand, noise, { dpr });
  const lines = streamlines(W, H, rand, noise, nameMask(W, H, frame, nameEl));

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(sheet, 0, 0);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "source-atop";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const drawSpan = (line: Line, a: number, b: number) => {
    const pts = line.pts;
    const n = pts.length;
    const taper = Math.min(18, n / 3);
    ctx.strokeStyle = rgb(mix(GROUND, EXPOSED, line.tone));
    for (let i = Math.max(1, a); i <= b && i < n; i += 3) {
      const j = Math.min(i + 3, n - 1);
      const t = Math.min(1, i / taper, (n - 1 - i) / taper);
      ctx.lineWidth = Math.max(0.25, line.width * (0.35 + 0.65 * t));
      ctx.beginPath();
      ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
      for (let k = i; k <= j; k++) ctx.lineTo(pts[k].x, pts[k].y);
      ctx.stroke();
    }
  };

  if (!animate) {
    lines.forEach((ln) => drawSpan(ln, 1, ln.pts.length - 1));
    ctx.globalCompositeOperation = "source-over";
    onDone?.();
    return () => {};
  }

  // grow every line outward from its seed point
  const duration = 2600;
  const start = performance.now();
  const drawn = lines.map((ln) => ({ lo: ln.seed, hi: ln.seed }));
  const maxReach = lines.reduce((m, ln) => Math.max(m, ln.seed, ln.pts.length - ln.seed), 1);
  let raf = 0;

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const e = 1 - Math.pow(1 - t, 3);
    const reach = Math.ceil(e * maxReach);
    lines.forEach((ln, i) => {
      const d = drawn[i];
      const lo = Math.max(0, ln.seed - reach);
      const hi = Math.min(ln.pts.length - 1, ln.seed + reach);
      if (lo < d.lo) {
        drawSpan(ln, Math.max(1, lo), d.lo);
        d.lo = lo;
      }
      if (hi > d.hi) {
        drawSpan(ln, Math.max(1, d.hi), hi);
        d.hi = hi;
      }
    });
    if (t < 1) raf = requestAnimationFrame(step);
    else {
      ctx.globalCompositeOperation = "source-over";
      onDone?.();
    }
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** A brushed-edge mask (as a data URL) for framing an image like a print. */
export function brushedMask(width: number, height: number, seed = 20261029): string {
  const rand = mulberry32(seed);
  return brushSheet(width, height, rand, makeNoise(rand), { dpr: 1, margin: 0.035 }).toDataURL("image/png");
}
