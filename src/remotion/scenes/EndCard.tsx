import { interpolate } from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { CinematicBars } from "../components/CinematicBars";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function EndCard({ frame, startFrame, isMobile }: { frame: number; startFrame: number; isMobile?: boolean }) {
  const elapsed = frame - startFrame;

  const sceneOpacity = interpolate(elapsed, [0, 20, 150, 178], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoOpacity = interpolate(elapsed, [15, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoY = interpolate(elapsed, [15, 40], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const taglineOpacity = interpolate(elapsed, [40, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineScale = interpolate(elapsed, [55, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlOpacity = interpolate(elapsed, [75, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = 0.6 + 0.4 * Math.sin(elapsed * 0.08);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "0 24px" : 0, opacity: sceneOpacity }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 30% at 50% 50%, rgba(196,168,120,${0.06 * glow}) 0%, transparent 70%)` }} />

      <div style={{ opacity: logoOpacity, transform: `translateY(${logoY}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: isMobile ? 52 : 96, fontWeight: 400, letterSpacing: isMobile ? "0.25em" : "0.4em", color: "#c4a878", textShadow: `0 0 ${40 * glow}px rgba(196,168,120,0.4)`, marginBottom: 4, textAlign: "center" }}>
        YAGEL
      </div>
      <div style={{ width: isMobile ? 100 : 180, height: 1, background: "linear-gradient(90deg, transparent, #c4a878, transparent)", transform: `scaleX(${lineScale})`, marginBottom: 20, marginTop: 8 }} />
      <div style={{ opacity: taglineOpacity, fontFamily: "Georgia, serif", fontSize: isMobile ? 11 : 14, fontStyle: "italic", letterSpacing: isMobile ? "0.15em" : "0.3em", color: "rgba(196,168,120,0.6)", textAlign: "center", marginBottom: 32 }}>
        A Signature of Elegance and Presence
      </div>
      <div style={{ opacity: urlOpacity, fontFamily: "Georgia, serif", fontSize: isMobile ? 9 : 11, letterSpacing: "0.4em", color: "rgba(196,168,120,0.35)", textTransform: "uppercase" }}>
        yagelbycmj.com
      </div>

      <FilmGrain frame={frame} opacity={0.05} />
      <CinematicBars frame={frame} startFrame={startFrame} />
    </div>
  );
}
