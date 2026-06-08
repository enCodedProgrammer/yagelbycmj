import { interpolate } from "remotion";

export function CinematicBars({ frame, startFrame = 0 }: { frame: number; startFrame?: number }) {
  const progress = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barHeight = `${progress * 10}%`;

  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: barHeight, background: "#000", zIndex: 100 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: barHeight, background: "#000", zIndex: 100 }} />
    </>
  );
}
