import { interpolate } from "remotion";

interface GlitchTextProps {
  frame: number;
  text: string;
  startFrame: number;
  style?: React.CSSProperties;
}

export function GlitchText({ frame, text, startFrame, style }: GlitchTextProps) {
  const elapsed = frame - startFrame;
  const letters = text.split("");

  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "relative", zIndex: 2 }}>
        {letters.map((letter, i) => {
          const letterStart = i * 4;
          const opacity = interpolate(elapsed - letterStart, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isGlitching = elapsed >= letterStart && elapsed < letterStart + 6;
          const glitchOffset = isGlitching ? Math.sin(elapsed * 17 + i) * 4 : 0;

          return (
            <span key={i} style={{ opacity, display: "inline-block", transform: `translateX(${glitchOffset}px)` }}>
              {letter}
            </span>
          );
        })}
      </span>

      <span style={{
        position: "absolute", top: 0, left: 0,
        color: "rgba(255,50,50,0.5)",
        transform: `translateX(${Math.sin(elapsed * 0.3) * 2}px)`,
        mixBlendMode: "screen", pointerEvents: "none",
        opacity: interpolate(elapsed, [0, 30, 60], [0.8, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>{text}</span>

      <span style={{
        position: "absolute", top: 0, left: 0,
        color: "rgba(50,100,255,0.5)",
        transform: `translateX(${Math.sin(elapsed * 0.3 + Math.PI) * 2}px)`,
        mixBlendMode: "screen", pointerEvents: "none",
        opacity: interpolate(elapsed, [0, 30, 60], [0.8, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>{text}</span>
    </div>
  );
}
