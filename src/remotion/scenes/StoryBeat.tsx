import { interpolate } from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { CinematicBars } from "../components/CinematicBars";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function StoryBeat({ frame, startFrame, isMobile }: { frame: number; startFrame: number; isMobile?: boolean }) {
  const elapsed = frame - startFrame;

  const sceneOpacity = interpolate(elapsed, [0, 12, 78, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Opacity = interpolate(elapsed, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y = interpolate(elapsed, [15, 35], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const line2Opacity = interpolate(elapsed, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(elapsed, [35, 55], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const lineScale = interpolate(elapsed, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "0 24px" : 0, opacity: sceneOpacity }}>
      <div style={{ opacity: line1Opacity, transform: `translateY(${line1Y}px)`, fontFamily: "Georgia, serif", fontSize: isMobile ? 22 : 38, fontStyle: "italic", color: "rgba(240,232,213,0.9)", letterSpacing: "0.05em", textAlign: "center", marginBottom: 8 }}>
        A signature of
      </div>
      <div style={{ opacity: line2Opacity, transform: `translateY(${line2Y}px)`, fontFamily: "Georgia, serif", fontSize: isMobile ? 28 : 52, fontStyle: "italic", color: "#c4a878", letterSpacing: "0.05em", textAlign: "center", marginBottom: 24 }}>
        elegance and presence.
      </div>
      <div style={{ width: isMobile ? 100 : 160, height: 1, background: "linear-gradient(90deg, transparent, #c4a878, transparent)", transform: `scaleX(${lineScale})` }} />

      <FilmGrain frame={frame} opacity={0.05} />
      <CinematicBars frame={frame} startFrame={startFrame} />
    </div>
  );
}
