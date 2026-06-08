function seeded(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: seeded(i * 7) * 100,
  y: seeded(i * 13) * 100,
  size: 1 + seeded(i * 3) * 3,
  speed: 0.04 + seeded(i * 5) * 0.08,
  drift: (seeded(i * 11) - 0.5) * 0.03,
  delay: seeded(i * 17) * 60,
  opacity: 0.2 + seeded(i * 19) * 0.6,
}));

export function Particles({ frame, color = "#c4a878" }: { frame: number; color?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {PARTICLES.map((p) => {
        const t = Math.max(0, frame - p.delay) * p.speed;
        const x = ((p.x + p.drift * frame * 100) % 100 + 100) % 100;
        const y = ((p.y - t * 10) % 100 + 100) % 100;
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.05 + p.id);

        return (
          <div key={p.id} style={{
            position: "absolute",
            left: `${x}%`, top: `${y}%`,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: color,
            opacity: p.opacity * pulse,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }} />
        );
      })}
    </div>
  );
}
