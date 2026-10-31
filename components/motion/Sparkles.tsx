"use client";

import { useEffect, useRef } from "react";
import { isCalm } from "@/lib/calm-mode";
import { glitter } from "@/lib/motion";
import { onBurst } from "@/lib/toast";

type P = { x: number; y: number; vx: number; vy: number; life: number; size: number; spin: number; color: string; star: boolean; alive: boolean };

const COLORS = ["#ff8fc7", "#a9d8ff", "#c9b6f0", "#ffd75e", "#ffffff", "#7b4fd6"];
const POOL = glitter.maxParticles + 30; // trail is capped at maxParticles; bursts get a little extra room

/**
 * Glitter trail (mouse only) + sparkle burst on click. One small canvas, a fixed particle pool,
 * and the rAF loop sleeps whenever nothing is alive, so idle pages cost nothing.
 */
export function Sparkles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pool: P[] = Array.from({ length: POOL }, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, size: 0, spin: 0, color: "", star: false, alive: false }));
    let raf = 0;
    let trailAlive = 0;
    let lastMove = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const spawn = (x: number, y: number, speed: number, trail: boolean) => {
      if (trail && trailAlive >= glitter.maxParticles) return;
      const p = pool.find((q) => !q.alive);
      if (!p) return;
      const sparkle = document.documentElement.classList.contains("sparkle-mode");
      Object.assign(p, {
        x, y, alive: true, life: 1,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed + (trail ? 0.6 : 0),
        size: Math.random() * 3 + (sparkle ? 3 : 2),
        spin: Math.random() * 3,
        star: Math.random() < 0.45,
        color: sparkle ? `hsl(${(performance.now() / 6) % 360} 95% 72%)` : COLORS[(Math.random() * COLORS.length) | 0],
      });
      if (trail) trailAlive++;
      (p as P & { trail?: boolean }).trail = trail;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const drawStar = (p: P) => {
      const r = p.size * 1.7;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -r);
        ctx.lineTo(r * 0.24, -r * 0.24);
        ctx.rotate(Math.PI / 2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    function tick() {
      ctx!.clearRect(0, 0, innerWidth, innerHeight);
      let any = false;
      for (const p of pool) {
        if (!p.alive) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 0.04;
        p.spin += 0.12;
        p.life -= 0.028;
        if (p.life <= 0) {
          p.alive = false;
          if ((p as P & { trail?: boolean }).trail) trailAlive--;
          continue;
        }
        any = true;
        ctx!.globalAlpha = p.life;
        ctx!.fillStyle = p.color;
        if (p.star) drawStar(p);
        else {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      raf = any ? requestAnimationFrame(tick) : 0;
      if (!any) ctx!.clearRect(0, 0, innerWidth, innerHeight);
    }

    const fine = matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      if (!fine || e.pointerType !== "mouse" || isCalm()) return;
      const now = performance.now();
      if (now - lastMove < 24) return; // throttle: ~40 spawns/sec max
      lastMove = now;
      spawn(e.clientX, e.clientY, 1.2, true);
    };
    const doBurst = (x: number, y: number, n: number = glitter.burstCount) => {
      if (isCalm()) return;
      for (let i = 0; i < n; i++) spawn(x, y, 6, false);
    };
    const onClick = (e: PointerEvent) => doBurst(e.clientX, e.clientY);

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onClick, { passive: true });
    const offBurst = onBurst(({ x, y, count }) => doBurst(x, y, count));

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onClick);
      offBurst();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 70 }} />;
}
