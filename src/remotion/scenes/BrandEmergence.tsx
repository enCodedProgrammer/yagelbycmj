import { interpolate } from "remotion";
import { GlitchText } from "../components/GlitchText";
import { FilmGrain } from "../components/FilmGrain";
import { CinematicBars } from "../components/CinematicBars";

export function BrandEmergence({ frame, startFrame, isMobile }: { frame: number; startFrame: number; isMobile?: boolean }) {
  const elapsed = frame - startFrame;

  const opacity = interpolate(elapsed, [0, 10, 70, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(elapsed, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = interpolate(elapsed, [40, 60], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineScale = interpolate(elapsed, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity }}>
      <GlitchText frame={frame} text="YAGEL" startFrame={startFrame} style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: isMobile ? 56 : 140,
        fontWeight: 400,
        letterSpacing: isMobile ? "0.2em" : "0.3em",
        color: "#c4a878",
        textTransform: "uppercase",
      }} />

      <div style={{ width: isMobile ? 120 : 200, height: 1, background: "linear-gradient(90deg, transparent, #c4a878, transparent)", transform: `scaleX(${lineScale})`, marginTop: 12, marginBottom: 16 }} />

      <div style={{ opacity: taglineOpacity, transform: `translateY(${taglineY}px)`, fontFamily: "Georgia, serif", fontSize: isMobile ? 11 : 18, letterSpacing: "0.5em", color: "rgba(196,168,120,0.7)", textTransform: "uppercase" }}>
        Extrait de Parfum
      </div>

      <FilmGrain frame={frame} opacity={0.05} />
      <CinematicBars frame={frame} startFrame={startFrame} />
    </div>
  );
}
