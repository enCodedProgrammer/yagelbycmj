export function FilmGrain({ frame, opacity = 0.04 }: { frame: number; opacity?: number }) {
  const x = (frame * 37) % 200;
  const y = (frame * 53) % 200;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 90,
        pointerEvents: "none",
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        backgroundPosition: `${x}px ${y}px`,
        mixBlendMode: "overlay",
      }}
    />
  );
}
