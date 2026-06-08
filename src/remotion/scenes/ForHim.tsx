import { interpolate } from "remotion";
import { Particles } from "../components/Particles";
import { FilmGrain } from "../components/FilmGrain";
import { CinematicBars } from "../components/CinematicBars";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function ForHim({ frame, startFrame, isMobile }: { frame: number; startFrame: number; isMobile?: boolean }) {
  const elapsed = frame - startFrame;

  const sceneOpacity = interpolate(elapsed, [0, 15, 130, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bottleY = interpolate(elapsed, [0, 50], [-200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const kenBurnsScale = interpolate(elapsed, [0, 150], [1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parallaxX = Math.sin(elapsed * 0.02) * (isMobile ? 4 : 8);
  const note1Opacity = interpolate(elapsed, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const note2Opacity = interpolate(elapsed, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const note3Opacity = interpolate(elapsed, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = interpolate(elapsed, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleX = interpolate(elapsed, [25, 50], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

  const imgH = isMobile ? 260 : 480;
  const pad = isMobile ? 20 : 80;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: sceneOpacity }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #050810 0%, #0a0d1a 50%, #050810 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(20,40,100,0.2) 0%, transparent 70%)", mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.85) 100%)" }} />
      <Particles frame={frame} color="#8899cc" />

      {/* Bottle */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${bottleY}px) translateX(${parallaxX}px) scale(${kenBurnsScale})` }}>
        <img src="/images/yagel-m.jpeg" style={{ height: imgH, objectFit: "contain", filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.9)) drop-shadow(0 0 60px rgba(80,100,200,0.25))" }} />
      </div>

      {/* Title */}
      {isMobile ? (
        <div style={{ position: "absolute", top: "12%", left: 0, right: 0, textAlign: "center", opacity: titleOpacity, transform: `translateX(${titleX}px)` }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: "0.5em", color: "rgba(136,153,204,0.7)", textTransform: "uppercase", marginBottom: 8 }}>For Him</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 32, fontStyle: "italic", color: "#e8eaf0", lineHeight: 1.1 }}>Yagel</div>
        </div>
      ) : (
        <div style={{ position: "absolute", right: pad, top: "38%", textAlign: "right", opacity: titleOpacity, transform: `translateX(${titleX}px)` }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 16, letterSpacing: "0.5em", color: "rgba(136,153,204,0.7)", textTransform: "uppercase", marginBottom: 12 }}>For Him</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 52, fontStyle: "italic", color: "#e8eaf0", lineHeight: 1.1, fontWeight: 400 }}>Yagel</div>
        </div>
      )}

      {/* Notes */}
      {isMobile ? (
        <div style={{ position: "absolute", bottom: "10%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
          {[
            { label: "Top", value: "Mango · Ginger", opacity: note1Opacity },
            { label: "Heart", value: "Woods · Patchouli", opacity: note2Opacity },
            { label: "Base", value: "Oud · Musk", opacity: note3Opacity },
          ].map((note) => (
            <div key={note.label} style={{ opacity: note.opacity, textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 8, letterSpacing: "0.3em", color: "rgba(136,153,204,0.5)", textTransform: "uppercase", marginBottom: 3 }}>{note.label}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "rgba(232,234,240,0.9)" }}>{note.value}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ position: "absolute", left: pad, bottom: "28%", textAlign: "left" }}>
          {[
            { label: "Top Note", value: "Mango · Ginger", opacity: note1Opacity },
            { label: "Heart", value: "Woods · Patchouli", opacity: note2Opacity },
            { label: "Base", value: "Oud · Musk · Incense", opacity: note3Opacity },
          ].map((note) => (
            <div key={note.label} style={{ opacity: note.opacity, marginBottom: 16 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: "0.4em", color: "rgba(136,153,204,0.5)", textTransform: "uppercase", marginBottom: 4 }}>{note.label}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "rgba(232,234,240,0.9)", letterSpacing: "0.1em" }}>{note.value}</div>
            </div>
          ))}
        </div>
      )}

      <FilmGrain frame={frame} opacity={0.04} />
      <CinematicBars frame={frame} startFrame={startFrame} />
    </div>
  );
}
