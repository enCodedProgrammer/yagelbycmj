import { interpolate } from "remotion";

export function ZoomPunch({ frame, startFrame }: { frame: number; startFrame: number }) {
  const elapsed = frame - startFrame;

  const scale = interpolate(elapsed, [0, 8, 15, 30], [1, 2.5, 1.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashOpacity = interpolate(elapsed, [0, 5, 15, 30], [0, 0.9, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glitchX = elapsed < 10 ? Math.sin(elapsed * 20) * 8 : 0;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #c4a878, #8a5c20, #000)", opacity: flashOpacity, transform: `scale(${scale}) translateX(${glitchX}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 30% 30% at 50% 50%, rgba(255,255,255,0.6), transparent)", opacity: interpolate(elapsed, [0, 5, 12], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </div>
  );
}
