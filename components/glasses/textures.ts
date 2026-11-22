import * as THREE from "three";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let backdropTexture: THREE.CanvasTexture | null = null;

/** Soft warm light pool that gives the glass something to refract. */
export function getBackdropTexture(): THREE.CanvasTexture {
  if (backdropTexture) return backdropTexture;

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f3ede2";
  ctx.fillRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(
    size * 0.48,
    size * 0.44,
    size * 0.04,
    size * 0.5,
    size * 0.5,
    size * 0.62,
  );
  glow.addColorStop(0, "#fdf9f1");
  glow.addColorStop(0.42, "#faf4e9");
  glow.addColorStop(0.78, "#f6efe3");
  glow.addColorStop(1, "#f3ede2");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  const warm = ctx.createLinearGradient(0, 0, size, size);
  warm.addColorStop(0, "rgba(255,246,230,0.34)");
  warm.addColorStop(0.5, "rgba(255,246,230,0)");
  warm.addColorStop(1, "rgba(213,190,160,0)");
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, size, size);

  backdropTexture = new THREE.CanvasTexture(canvas);
  backdropTexture.colorSpace = THREE.SRGBColorSpace;
  return backdropTexture;
}

let tortoiseTexture: THREE.CanvasTexture | null = null;

/** Hand-painted tortoise acetate, generated once on a canvas. */
export function getTortoiseTexture(): THREE.CanvasTexture {
  if (tortoiseTexture) return tortoiseTexture;

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(1987);

  ctx.fillStyle = "#8a5426";
  ctx.fillRect(0, 0, size, size);

  const blob = (x: number, y: number, rx: number, ry: number, rot: number, color: string, alpha: number) => {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.72, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(rx, ry);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  };

  const palette = [
    { color: "#3a2110", alpha: 0.9 },
    { color: "#2a170c", alpha: 0.75 },
    { color: "#6b3d18", alpha: 0.55 },
    { color: "#a86a2f", alpha: 0.5 },
    { color: "#c98d4a", alpha: 0.32 },
  ];

  for (let i = 0; i < 150; i++) {
    const p = palette[Math.floor(rand() * palette.length)];
    const r = 18 + rand() * 78;
    blob(
      rand() * size,
      rand() * size,
      r,
      r * (0.45 + rand() * 0.8),
      rand() * Math.PI,
      p.color,
      p.alpha,
    );
  }

  for (let i = 0; i < 520; i++) {
    const r = 2 + rand() * 11;
    blob(
      rand() * size,
      rand() * size,
      r,
      r * (0.4 + rand() * 1.1),
      rand() * Math.PI,
      rand() > 0.5 ? "rgba(38,21,10,0.85)" : "rgba(201,141,74,0.55)",
      0.6,
    );
  }

  const image = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const grain = (rand() - 0.5) * 16;
    image.data[i] = Math.max(0, Math.min(255, image.data[i] + grain));
    image.data[i + 1] = Math.max(0, Math.min(255, image.data[i + 1] + grain));
    image.data[i + 2] = Math.max(0, Math.min(255, image.data[i + 2] + grain));
  }
  ctx.putImageData(image, 0, 0);

  tortoiseTexture = new THREE.CanvasTexture(canvas);
  tortoiseTexture.colorSpace = THREE.SRGBColorSpace;
  tortoiseTexture.wrapS = THREE.RepeatWrapping;
  tortoiseTexture.wrapT = THREE.RepeatWrapping;
  tortoiseTexture.repeat.set(0.09, 0.09);
  tortoiseTexture.offset.set(0.35, 0.55);
  tortoiseTexture.anisotropy = 4;
  return tortoiseTexture;
}
