import { useEffect, useRef } from 'react';
import type { AdSceneKey } from '../types/portfolio';

interface AdCanvasRendererProps {
  sceneKey: AdSceneKey;
  title: string;
  client: string;
  metrics: string;
  mode: 'thumbnail' | 'player';
  isPlaying?: boolean;
  isHovered?: boolean;
  currentTime?: number;
  durationSec?: number;
  className?: string;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBusinessSkyline(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isPlayer: boolean,
  progress: number
) {
  // Twilight purple-to-amber sunset sky matching mockup Card 1
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#1e1b4b');
  sky.addColorStop(0.45, '#6d28d9');
  sky.addColorStop(0.78, '#db2777');
  sky.addColorStop(1, '#f59e0b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Glowing sunset orb
  const sunX = w * 0.5 + Math.sin(t * 0.4) * w * 0.03;
  const sunY = h * 0.56;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, w * 0.28);
  sunGrad.addColorStop(0, 'rgba(253, 224, 71, 0.92)');
  sunGrad.addColorStop(0.45, 'rgba(244, 114, 182, 0.35)');
  sunGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, w, h);

  // Skyline towers
  const buildings = [
    { x: 0.03, w: 0.08, h: 0.42 },
    { x: 0.12, w: 0.07, h: 0.54 },
    { x: 0.2, w: 0.09, h: 0.65 },
    { x: 0.31, w: 0.08, h: 0.78 },
    { x: 0.41, w: 0.11, h: 0.86 },
    { x: 0.54, w: 0.09, h: 0.72 },
    { x: 0.65, w: 0.08, h: 0.58 },
    { x: 0.75, w: 0.1, h: 0.69 },
    { x: 0.87, w: 0.09, h: 0.48 },
  ];

  const pan = isPlayer ? Math.sin(t * 0.6) * w * 0.02 : 0;

  buildings.forEach((b, idx) => {
    const bx = b.x * w + pan;
    const bw = b.w * w;
    const bh = b.h * h * 0.78;
    const by = h * 0.84 - bh;

    const bGrad = ctx.createLinearGradient(bx, by, bx, h * 0.84);
    bGrad.addColorStop(0, idx % 2 === 0 ? '#1e1b4b' : '#0f172a');
    bGrad.addColorStop(1, '#050816');
    ctx.fillStyle = bGrad;
    ctx.fillRect(bx, by, bw, bh);

    // Illuminated neon window grids
    ctx.fillStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.55)' : 'rgba(232, 121, 249, 0.5)';
    const cols = 3;
    const rows = Math.floor(bh / 14);
    for (let r = 1; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r + c + idx + Math.floor(t * 2)) % 5 !== 0) {
          ctx.fillRect(bx + 5 + c * ((bw - 10) / cols), by + r * 12, (bw - 18) / cols, 4);
        }
      }
    }
  });

  // Water reflection / foreground boulevard
  const ground = ctx.createLinearGradient(0, h * 0.82, 0, h);
  ground.addColorStop(0, '#090d24');
  ground.addColorStop(1, '#030510');
  ctx.fillStyle = ground;
  ctx.fillRect(0, h * 0.82, w, h * 0.18);

  // Moving light traffic streaks
  for (let i = 0; i < 6; i++) {
    const lx = ((t * 160 + i * 190) % (w + 180)) - 90;
    const ly = h * 0.86 + (i % 3) * 8;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(34, 211, 238, 0.85)' : 'rgba(244, 114, 182, 0.85)';
    ctx.fillRect(lx, ly, 44, 2.5);
  }

  if (isPlayer) {
    drawCommercialOverlay(
      ctx,
      w,
      h,
      progress,
      'SCALE YOUR BRAND PRESENCE',
      'HIGH-CONVERTING CORPORATE ADS',
      '+165% QUALIFIED LEADS',
      '#a855f7',
      '#22d3ee'
    );
  }
}

function drawCarAction(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isPlayer: boolean,
  progress: number
) {
  // Desert canyon sky & track matching mockup Card 2
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  sky.addColorStop(0, '#451a03');
  sky.addColorStop(0.55, '#c2410c');
  sky.addColorStop(1, '#fb923c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.65);

  // Distant canyon mesas
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.62);
  ctx.lineTo(w * 0.18, h * 0.44);
  ctx.lineTo(w * 0.36, h * 0.56);
  ctx.lineTo(w * 0.62, h * 0.39);
  ctx.lineTo(w * 0.84, h * 0.52);
  ctx.lineTo(w, h * 0.43);
  ctx.lineTo(w, h * 0.65);
  ctx.closePath();
  ctx.fill();

  // Red desert track ground
  const road = ctx.createLinearGradient(0, h * 0.58, 0, h);
  road.addColorStop(0, '#7c2d12');
  road.addColorStop(0.45, '#431407');
  road.addColorStop(1, '#1c0a04');
  ctx.fillStyle = road;
  ctx.fillRect(0, h * 0.58, w, h * 0.42);

  // Speed streaks on ground
  for (let i = 0; i < 10; i++) {
    const sx = w - ((t * 480 + i * 140) % (w + 200));
    const sy = h * 0.66 + (i % 4) * (h * 0.07);
    ctx.fillStyle = 'rgba(251, 146, 60, 0.32)';
    ctx.fillRect(sx, sy, 68, 2);
  }

  // Billowing red dust plume behind rear wheel
  const carShake = isPlayer || t > 0 ? Math.sin(t * 28) * 1.6 : 0;
  const cx = w * 0.5 + (isPlayer ? Math.sin(t * 1.4) * w * 0.03 : 0);
  const cy = h * 0.62 + carShake;

  for (let d = 0; d < 12; d++) {
    const dx = cx - w * 0.16 - ((t * 160 + d * 28) % (w * 0.34));
    const dy = cy + h * 0.07 - Math.sin(d + t * 5) * 10;
    const rad = 12 + (d % 5) * 9;
    ctx.fillStyle = `rgba(239, 68, 68, ${0.34 - d * 0.022})`;
    ctx.beginPath();
    ctx.arc(dx, dy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sleek crimson sports coupe silhouette
  ctx.save();
  ctx.translate(cx, cy);
  const scale = w / 480;
  ctx.scale(scale, scale);

  // Under-car shadow
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.beginPath();
  ctx.ellipse(0, 34, 126, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Car body
  const carGrad = ctx.createLinearGradient(-115, -35, 115, 25);
  carGrad.addColorStop(0, '#991b1b');
  carGrad.addColorStop(0.5, '#ef4444');
  carGrad.addColorStop(1, '#dc2626');
  ctx.fillStyle = carGrad;
  ctx.beginPath();
  ctx.moveTo(-112, 18);
  ctx.lineTo(-104, -6);
  ctx.lineTo(-60, -14);
  ctx.lineTo(-20, -34);
  ctx.lineTo(44, -32);
  ctx.lineTo(98, -10);
  ctx.lineTo(118, 6);
  ctx.lineTo(112, 22);
  ctx.closePath();
  ctx.fill();

  // Windshield & cabin glass
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(-48, -13);
  ctx.lineTo(-16, -30);
  ctx.lineTo(38, -28);
  ctx.lineTo(66, -12);
  ctx.closePath();
  ctx.fill();

  // Glowing LED Headlight & Tail light
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(107, 2, 9, 3.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff2e54';
  ctx.fillRect(-108, -2, 12, 4);

  // Wheels
  [-68, 72].forEach((wx) => {
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(wx, 22, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(wx, 22, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Spinning spoke lines
    for (let s = 0; s < 4; s++) {
      const ang = t * 18 + (s * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(wx, 22);
      ctx.lineTo(wx + Math.cos(ang) * 11, 22 + Math.sin(ang) * 11);
      ctx.stroke();
    }
  });

  ctx.restore();

  if (isPlayer) {
    drawCommercialOverlay(
      ctx,
      w,
      h,
      progress,
      'ENGINEERED FOR PURE MOTION',
      'VELOCE GT · 4K ACTION SPOT',
      '4.2x AD RECALL SCORE',
      '#ef4444',
      '#fb923c'
    );
  }
}

function drawTravelAviation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isPlayer: boolean,
  progress: number
) {
  // Crisp sky blue gradient matching mockup Card 3
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#0284c7');
  sky.addColorStop(0.55, '#38bdf8');
  sky.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Volumetric clouds drifting
  const clouds = [
    { x: 0.15, y: 0.72, r: 58 },
    { x: 0.35, y: 0.78, r: 72 },
    { x: 0.58, y: 0.7, r: 64 },
    { x: 0.82, y: 0.76, r: 80 },
    { x: 0.25, y: 0.24, r: 38 },
    { x: 0.75, y: 0.28, r: 44 },
  ];

  clouds.forEach((c, idx) => {
    const cx = ((c.x * w - t * (18 + idx * 4)) % (w + 180) + (w + 180)) % (w + 180) - 90;
    const cy = c.y * h;
    const rad = c.r * (w / 520);
    const cg = ctx.createRadialGradient(cx, cy, 4, cx, cy, rad);
    cg.addColorStop(0, 'rgba(255,255,255,0.92)');
    cg.addColorStop(0.6, 'rgba(255,255,255,0.45)');
    cg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  });

  // Jetliner ascending smoothly
  const floatY = Math.sin(t * 1.8) * (h * 0.025);
  const px = w * 0.52;
  const py = h * 0.44 + floatY;
  const scale = w / 520;

  // Contrail behind jet
  const contrail = ctx.createLinearGradient(0, py + 24 * scale, px, py);
  contrail.addColorStop(0, 'rgba(255,255,255,0)');
  contrail.addColorStop(1, 'rgba(255,255,255,0.55)');
  ctx.strokeStyle = contrail;
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(px - 220 * scale, py + 72 * scale);
  ctx.lineTo(px - 30 * scale, py + 12 * scale);
  ctx.stroke();

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(-0.22);
  ctx.scale(scale, scale);

  // Fuselage
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(0, 0, 108, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  // Blue airline belly & tail stripe
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.moveTo(-98, -4);
  ctx.lineTo(-124, -44);
  ctx.lineTo(-98, -44);
  ctx.lineTo(-68, -8);
  ctx.closePath();
  ctx.fill();

  // Main swept wings
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(-12, 4);
  ctx.lineTo(-42, 68);
  ctx.lineTo(-16, 68);
  ctx.lineTo(28, 4);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(4, -8);
  ctx.lineTo(-26, -54);
  ctx.lineTo(-4, -54);
  ctx.lineTo(32, -8);
  ctx.closePath();
  ctx.fill();

  // Cockpit glass
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(82, -5, 13, 4.5, 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  if (isPlayer) {
    drawCommercialOverlay(
      ctx,
      w,
      h,
      progress,
      'CONNECTING EVERY HORIZON',
      'SKYWARD GLOBAL AIRWAYS',
      '94% VIDEO COMPLETION',
      '#0284c7',
      '#22d3ee'
    );
  }
}

function drawLifestyleAlpine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isPlayer: boolean,
  progress: number
) {
  // Crisp alpine sky matching mockup Card 4
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  sky.addColorStop(0, '#0284c7');
  sky.addColorStop(0.65, '#38bdf8');
  sky.addColorStop(1, '#bae6fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.6);

  // Snowy mountain range
  const peaks = [
    { x: 0, h: 0.45 },
    { x: 0.16, h: 0.22 },
    { x: 0.34, h: 0.42 },
    { x: 0.52, h: 0.18 },
    { x: 0.72, h: 0.38 },
    { x: 0.88, h: 0.24 },
    { x: 1, h: 0.46 },
  ];

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.6);
  peaks.forEach((p) => ctx.lineTo(p.x * w, p.h * h));
  ctx.lineTo(w, h * 0.6);
  ctx.closePath();
  ctx.fill();

  // Snow caps
  ctx.fillStyle = '#f8fafc';
  [
    [0.16, 0.22, 0.08],
    [0.52, 0.18, 0.1],
    [0.88, 0.24, 0.07],
  ].forEach(([px, py, spread]) => {
    ctx.beginPath();
    ctx.moveTo(px * w, py * h);
    ctx.lineTo((px - spread) * w, (py + 0.12) * h);
    ctx.lineTo(px * w, (py + 0.09) * h);
    ctx.lineTo((px + spread) * w, (py + 0.12) * h);
    ctx.closePath();
    ctx.fill();
  });

  // Emerald forest slopes
  ctx.fillStyle = '#065f46';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.42);
  ctx.lineTo(w * 0.32, h * 0.6);
  ctx.lineTo(0, h * 0.62);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w, h * 0.4);
  ctx.lineTo(w * 0.65, h * 0.6);
  ctx.lineTo(w, h * 0.62);
  ctx.closePath();
  ctx.fill();

  // Turquoise alpine lake with subtle ripple reflection
  const lake = ctx.createLinearGradient(0, h * 0.58, 0, h);
  lake.addColorStop(0, '#0ea5e9');
  lake.addColorStop(0.5, '#0284c7');
  lake.addColorStop(1, '#0f766e');
  ctx.fillStyle = lake;
  ctx.fillRect(0, h * 0.58, w, h * 0.42);

  for (let r = 0; r < 8; r++) {
    const ry = h * 0.64 + r * (h * 0.042);
    const rx = w * 0.2 + Math.sin(t * 2 + r) * 24;
    ctx.fillStyle = 'rgba(224, 242, 254, 0.24)';
    ctx.fillRect(rx, ry, w * 0.55 - r * 12, 1.5);
  }

  if (isPlayer) {
    drawCommercialOverlay(
      ctx,
      w,
      h,
      progress,
      'LIVE BEYOND THE ORDINARY',
      'NORDIC PEAK OUTFITTERS',
      '3.6x CAMPAIGN ROAS',
      '#10b981',
      '#06b6d4'
    );
  }
}

function drawAiNeural(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isPlayer: boolean,
  progress: number
) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#09071a');
  bg.addColorStop(1, '#130b2e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Neural grid
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.16)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Orbiting glowing rings
  const cx = w * 0.5;
  const cy = h * 0.48;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * (0.6 + i * 0.3) * (i % 2 === 0 ? 1 : -1));
    ctx.strokeStyle = i === 1 ? 'rgba(34, 211, 238, 0.7)' : 'rgba(168, 85, 247, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, w * (0.14 + i * 0.045), h * (0.18 + i * 0.05), 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const orb = ctx.createRadialGradient(cx, cy, 4, cx, cy, w * 0.12);
  orb.addColorStop(0, '#e0f2fe');
  orb.addColorStop(0.45, '#22d3ee');
  orb.addColorStop(1, 'rgba(139, 92, 246, 0)');
  ctx.fillStyle = orb;
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.12, 0, Math.PI * 2);
  ctx.fill();

  if (isPlayer) {
    drawCommercialOverlay(
      ctx,
      w,
      h,
      progress,
      'NEXT-GEN AI PRODUCT VISUALS',
      'LUMINA SMART AUDIO LAUNCH',
      '4.5% CTR · 980K VIEWS',
      '#a855f7',
      '#22d3ee'
    );
  }
}

function drawSocialStreetwear(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isPlayer: boolean,
  progress: number
) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#1e0b2e');
  bg.addColorStop(0.5, '#4c0519');
  bg.addColorStop(1, '#090d1f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Kinetic diagonal neon bars
  for (let i = 0; i < 6; i++) {
    const bx = ((i * 110 + t * 90) % (w + 160)) - 80;
    ctx.save();
    ctx.translate(bx, h * 0.5);
    ctx.rotate(-0.35);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(236, 72, 153, 0.25)' : 'rgba(139, 92, 246, 0.25)';
    ctx.fillRect(-16, -h, 32, h * 2);
    ctx.restore();
  }

  // Bold geometric focal emblem
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, w * 0.28, h * 0.2, w * 0.44, h * 0.56, 16);
  ctx.stroke();

  if (isPlayer) {
    drawCommercialOverlay(
      ctx,
      w,
      h,
      progress,
      'BUILT FOR SCROLL-STOPPING REELS',
      'KINETIX DROP CAMPAIGN',
      '4.2M VIEWS · 5.1x ROAS',
      '#ec4899',
      '#8b5cf6'
    );
  }
}

function drawCommercialOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
  hookHeadline: string,
  brandLine: string,
  metricLine: string,
  accentA: string,
  accentB: string
) {
  // Subtle cinematic letterbox bars
  const barH = h * 0.06;
  ctx.fillStyle = 'rgba(2, 4, 12, 0.72)';
  ctx.fillRect(0, 0, w, barH);
  ctx.fillRect(0, h - barH, w, barH);

  // Act 1: 0.0 -> 0.26 kinetic hook banner
  if (progress < 0.28) {
    const localAlpha = progress < 0.05 ? progress / 0.05 : progress > 0.22 ? (0.28 - progress) / 0.06 : 1;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, localAlpha));
    ctx.fillStyle = 'rgba(5, 7, 20, 0.55)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = `700 ${Math.max(12, Math.round(w * 0.018))}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(brandLine, w / 2, h * 0.42);

    const grad = ctx.createLinearGradient(w * 0.25, 0, w * 0.75, 0);
    grad.addColorStop(0, accentA);
    grad.addColorStop(1, accentB);
    ctx.fillStyle = grad;
    ctx.font = `800 ${Math.max(18, Math.round(w * 0.036))}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(hookHeadline, w / 2, h * 0.53);
    ctx.restore();
  }

  // Act 2: 0.28 -> 0.78 live lower-third kinetic metric card
  if (progress >= 0.28 && progress < 0.78) {
    const enter = Math.min(1, (progress - 0.28) / 0.08);
    ctx.save();
    ctx.globalAlpha = enter;
    const boxW = Math.min(w * 0.52, 340);
    const boxH = 54;
    const bx = 24;
    const by = h - barH - boxH - 18;
    ctx.fillStyle = 'rgba(6, 9, 24, 0.82)';
    drawRoundedRect(ctx, bx, by, boxW, boxH, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 11px "JetBrains Mono", monospace`;
    ctx.fillText(brandLine, bx + 14, by + 20);

    ctx.fillStyle = '#f8fafc';
    ctx.font = `700 15px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(metricLine, bx + 14, by + 40);
    ctx.restore();
  }

  // Act 3: 0.78 -> 1.0 End-card CTA
  if (progress >= 0.78) {
    const enter = Math.min(1, (progress - 0.78) / 0.08);
    ctx.save();
    ctx.globalAlpha = enter;
    ctx.fillStyle = 'rgba(5, 7, 20, 0.84)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 ${Math.max(11, Math.round(w * 0.015))}px "JetBrains Mono", monospace`;
    ctx.fillText('CAMPAIGN RESULT · ' + metricLine, w / 2, h * 0.39);

    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.max(18, Math.round(w * 0.034))}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(brandLine, w / 2, h * 0.49);

    const grad = ctx.createLinearGradient(w * 0.35, 0, w * 0.65, 0);
    grad.addColorStop(0, accentA);
    grad.addColorStop(1, accentB);
    ctx.fillStyle = grad;
    ctx.font = `700 ${Math.max(13, Math.round(w * 0.02))}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('DIRECTED & EDITED BY RASHEDUL', w / 2, h * 0.59);
    ctx.restore();
  }
}

export function AdCanvasRenderer({
  sceneKey,
  title,
  client,
  metrics,
  mode,
  isPlaying = false,
  isHovered = false,
  currentTime = 0,
  durationSec = 20,
  className = '',
}: AdCanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let lastTs = performance.now();

    const renderFrame = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const targetW = Math.max(320, Math.round(rect.width * dpr));
      const targetH = Math.max(180, Math.round(rect.height * dpr));

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = rect.width || 320;
      const h = rect.height || 180;

      if (mode === 'thumbnail' && isHovered) {
        hoverTimeRef.current += dt;
      }

      const t = mode === 'player' ? currentTime : hoverTimeRef.current;
      const progress = durationSec > 0 ? Math.min(1, Math.max(0, t / durationSec)) : 0;

      let activeScene = sceneKey;
      if (sceneKey === 'showreel') {
        const scenes: AdSceneKey[] = [
          'business-skyline',
          'car-action',
          'travel-aviation',
          'lifestyle-alpine',
        ];
        const idx = Math.floor((t / Math.max(durationSec, 1)) * scenes.length) % scenes.length;
        activeScene = scenes[idx];
      }

      const isPlayer = mode === 'player';
      switch (activeScene) {
        case 'business-skyline':
          drawBusinessSkyline(ctx, w, h, t, isPlayer, progress);
          break;
        case 'car-action':
          drawCarAction(ctx, w, h, t, isPlayer, progress);
          break;
        case 'travel-aviation':
          drawTravelAviation(ctx, w, h, t, isPlayer, progress);
          break;
        case 'lifestyle-alpine':
          drawLifestyleAlpine(ctx, w, h, t, isPlayer, progress);
          break;
        case 'ai-neural':
          drawAiNeural(ctx, w, h, t, isPlayer, progress);
          break;
        case 'social-streetwear':
          drawSocialStreetwear(ctx, w, h, t, isPlayer, progress);
          break;
        default:
          drawBusinessSkyline(ctx, w, h, t, isPlayer, progress);
          break;
      }

      if (isPlayer && sceneKey === 'showreel') {
        drawCommercialOverlay(
          ctx,
          w,
          h,
          progress,
          title.toUpperCase(),
          client.toUpperCase(),
          metrics.toUpperCase(),
          '#a855f7',
          '#22d3ee'
        );
      }

      ctx.restore();

      if ((mode === 'thumbnail' && isHovered) || (mode === 'player' && isPlaying)) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [sceneKey, title, client, metrics, mode, isPlaying, isHovered, currentTime, durationSec]);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} />;
}
