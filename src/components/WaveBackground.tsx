"use client";

import { useEffect, useRef } from "react";

const ROW_COUNT = 30;
const LINE_COLOR = "10, 88, 235";
const MOUSE_RADIUS = 280;
const MOUSE_STRENGTH = 85;

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrame = 0;
    let time = 0;

    const mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < -100 || y < -100 || x > width + 100 || y > height + 100) {
        mouse.targetX = -9999;
        mouse.targetY = -9999;
        return;
      }
      mouse.targetX = x;
      mouse.targetY = y;
    }

    function handlePointerLeave() {
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    }

    function draw() {
      if (!ctx) return;
      time += 0.007;
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const rowSpacing = height / ROW_COUNT;
      const step = Math.max(4, Math.floor(width / 220));

      for (let row = 0; row < ROW_COUNT; row++) {
        const baseY = row * rowSpacing + rowSpacing / 2;
        const rowPhase = row * 0.6;
        const amplitude = 26 + 20 * Math.sin(row * 0.45 + 1.2);
        const opacity = 0.08 + 0.26 * (1 - Math.abs(row - ROW_COUNT / 2) / (ROW_COUNT / 2));

        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const wave =
            Math.sin(x * 0.0045 + time * 1.6 + rowPhase) * amplitude +
            Math.sin(x * 0.011 - time * 1.1 + rowPhase * 1.8) * (amplitude * 0.6) +
            Math.sin(x * 0.0022 + time * 0.7 + rowPhase * 0.5) * (amplitude * 0.85);

          let y = baseY + wave;

          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const falloff = Math.pow(1 - dist / MOUSE_RADIUS, 1.6);
            const push = falloff * MOUSE_STRENGTH;
            const angle = Math.atan2(dy, dx || 0.0001);
            y += Math.sin(angle) * push;
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${LINE_COLOR}, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
