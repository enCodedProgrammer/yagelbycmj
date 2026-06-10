import { interpolate } from "remotion";
import { Particles } from "../components/Particles";
import { FilmGrain } from "../components/FilmGrain";
import { CinematicBars } from "../components/CinematicBars";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function DoubleReveal({ frame, startFrame, isMobile }: { frame: number; startFrame: number; isMobile?: boolean }) {
  const elapsed = frame - startFrame;

  const sceneOpacity = interpolate(elapsed, [0, 20, 178, 198], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const herSlide = interpolate(elapsed, [0, 55], [isMobile ? 0 : -300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const himSlide = interpolate(elapsed, [0, 55], [isMobile ? 0 : 300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const herY = isMobile ? interpolate(elapsed, [0, 55], [-200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut }) : Math.sin(elapsed * 0.025) * 10;
  const himY = isMobile ? interpolate(elapsed, [20, 75], [-200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut }) : Math.sin(elapsed * 0.025 + Math.PI) * 10;
  const kenBurns = interpolate(elapsed, [0, 180], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const priceOpacity = interpolate(elapsed, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const priceY = interpolate(elapsed, [80, 110], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const ctaOpacity = interpolate(elapsed, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dividerOpacity = interpolate(elapsed, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const imgH = isMobile ? 180 : 380;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: sceneOpacity }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0a0508 0%, #160a0d 50%, #0a0508 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(196,168,120,0.1) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)" }} />
      <Particles frame={frame} color="#c4a878" />

      {isMobile ? (
        /* Mobile: stacked vertically */
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, transform: `scale(${kenBurns})`, padding: "0 16px" }}>
          {/* For Her */}
          <div style={{ transform: `translateY(${herY}px)`, display: "flex", alignItems: "center", gap: 16 }}>
            <img src="/images/yagel-f.jpeg" style={{ height: imgH, objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7))" }} />
            <div style={{ opacity: priceOpacity, transform: `translateY(${priceY}px)` }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: "0.3em", color: "rgba(196,168,120,0.6)", textTransform: "uppercase", marginBottom: 4 }}>For Her</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#c4a878" }}>£40 · $40</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "rgba(196,168,120,0.6)", marginTop: 2 }}>₦40,000</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, rgba(196,168,120,0.3), transparent)", opacity: dividerOpacity }} />

          {/* For Him */}
          <div style={{ transform: `translateY(${himY}px)`, display: "flex", alignItems: "center", gap: 16, flexDirection: "row-reverse" }}>
            <img src="/images/yagel-m.jpeg" style={{ height: imgH, objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7))" }} />
            <div style={{ opacity: priceOpacity, transform: `translateY(${priceY}px)`, textAlign: "right" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: "0.3em", color: "rgba(196,168,120,0.6)", textTransform: "uppercase", marginBottom: 4 }}>For Him</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#c4a878" }}>£40 · $40</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "rgba(196,168,120,0.6)", marginTop: 2 }}>₦40,000</div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop: side by side */
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 60, transform: `scale(${kenBurns})` }}>
          <div style={{ transform: `translateX(${herSlide}px) translateY(${herY}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <img src="/images/yagel-f.jpeg" style={{ height: imgH, objectFit: "contain", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(196,168,120,0.25))" }} />
            <div style={{ opacity: priceOpacity, transform: `translateY(${priceY}px)`, textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: "0.4em", color: "rgba(196,168,120,0.6)", textTransform: "uppercase", marginBottom: 6 }}>For Her</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#c4a878" }}>£40 · $40</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "rgba(196,168,120,0.6)", marginTop: 4 }}>₦40,000</div>
            </div>
          </div>

          <div style={{ width: 1, height: 300, background: "linear-gradient(180deg, transparent, rgba(196,168,120,0.3), transparent)", opacity: dividerOpacity }} />

          <div style={{ transform: `translateX(${himSlide}px) translateY(${himY}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <img src="/images/yagel-m.jpeg" style={{ height: imgH, objectFit: "contain", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(80,100,200,0.2))" }} />
            <div style={{ opacity: priceOpacity, transform: `translateY(${priceY}px)`, textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: "0.4em", color: "rgba(196,168,120,0.6)", textTransform: "uppercase", marginBottom: 6 }}>For Him</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#c4a878" }}>£40 · $40</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "rgba(196,168,120,0.6)", marginTop: 4 }}>₦40,000</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "absolute", bottom: isMobile ? 40 : 80, left: 0, right: 0, textAlign: "center", opacity: ctaOpacity }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: isMobile ? 9 : 12, letterSpacing: "0.4em", color: "rgba(196,168,120,0.5)", textTransform: "uppercase" }}>
          Free Shipping · UK · USA · Nigeria
        </div>
      </div>

      <FilmGrain frame={frame} opacity={0.04} />
      <CinematicBars frame={frame} startFrame={startFrame} />
    </div>
  );
}
