import { interpolate } from "remotion";
import { Particles } from "../components/Particles";
import { FilmGrain } from "../components/FilmGrain";
import { CinematicBars } from "../components/CinematicBars";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function ForHer({ frame, startFrame, isMobile }: { frame: number; startFrame: number; isMobile?: boolean }) {
  const elapsed = frame - startFrame;

  const sceneOpacity = interpolate(elapsed, [0, 15, 150, 168], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bottleY = interpolate(elapsed, [0, 50], [180, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const kenBurnsScale = interpolate(elapsed, [0, 150], [1, 1.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const note1Opacity = interpolate(elapsed, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const note2Opacity = interpolate(elapsed, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const note3Opacity = interpolate(elapsed, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = interpolate(elapsed, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleX = interpolate(elapsed, [20, 45], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

  const imgH = isMobile ? 260 : 480;
  const pad = isMobile ? 20 : 80;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: sceneOpacity }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0508 0%, #2d0a14 50%, #1a0508 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180,80,20,0.18) 0%, transparent 70%)", mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
      <Particles frame={frame} color="#c4a878" />

      {/* Bottle */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${bottleY}px) scale(${kenBurnsScale})` }}>
        <img src="/images/yagel-f.jpeg" style={{ height: imgH, objectFit: "contain", filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.8)) drop-shadow(0 0 60px rgba(196,168,120,0.3))" }} />
      </div>

      {/* Title — top-left on desktop, top-center on mobile */}
      {isMobile ? (
        <div style={{ position: "absolute", top: "12%", left: 0, right: 0, textAlign: "center", opacity: titleOpacity, transform: `translateX(${titleX}px)` }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: "0.5em", color: "rgba(196,168,120,0.7)", textTransform: "uppercase", marginBottom: 8 }}>For Her</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 32, fontStyle: "italic", color: "#f0e8d5", lineHeight: 1.1 }}>Yagel</div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: pad, top: "38%", opacity: titleOpacity, transform: `translateX(${titleX}px)` }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 16, letterSpacing: "0.5em", color: "rgba(196,168,120,0.7)", textTransform: "uppercase", marginBottom: 12 }}>For Her</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 52, fontStyle: "italic", color: "#f0e8d5", lineHeight: 1.1, fontWeight: 400 }}>Yagel</div>
        </div>
      )}

      {/* Notes — bottom on mobile, right side on desktop */}
      {isMobile ? (
        <div style={{ position: "absolute", bottom: "10%", left: 0, right: 0, textAlign: "center", display: "flex", justifyContent: "center", gap: 20 }}>
          {[
            { label: "Top", value: "Citrus · Saffron", opacity: note1Opacity },
            { label: "Heart", value: "Rose · Jasmine", opacity: note2Opacity },
            { label: "Base", value: "Vanilla · Oud", opacity: note3Opacity },
          ].map((note) => (
            <div key={note.label} style={{ opacity: note.opacity }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 8, letterSpacing: "0.3em", color: "rgba(196,168,120,0.5)", textTransform: "uppercase", marginBottom: 3 }}>{note.label}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "rgba(240,232,213,0.9)" }}>{note.value}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ position: "absolute", right: pad, bottom: "28%", textAlign: "right" }}>
          {[
            { label: "Top Note", value: "Citrus · Saffron", opacity: note1Opacity },
            { label: "Heart", value: "Rose · Jasmine", opacity: note2Opacity },
            { label: "Base", value: "Vanilla · Oud · Musk", opacity: note3Opacity },
          ].map((note) => (
            <div key={note.label} style={{ opacity: note.opacity, marginBottom: 16 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: "0.4em", color: "rgba(196,168,120,0.5)", textTransform: "uppercase", marginBottom: 4 }}>{note.label}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "rgba(240,232,213,0.9)", letterSpacing: "0.1em" }}>{note.value}</div>
            </div>
          ))}
        </div>
      )}

      <FilmGrain frame={frame} opacity={0.04} />
      <CinematicBars frame={frame} startFrame={startFrame} />
    </div>
  );
}
