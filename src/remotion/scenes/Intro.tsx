import { interpolate } from "remotion";
import { CinematicBars } from "../components/CinematicBars";
import { Particles } from "../components/Particles";

export function Intro({ frame }: { frame: number; isMobile?: boolean }) {
  const opacity = interpolate(frame, [50, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", opacity }}>
      <Particles frame={frame} color="#c4a878" />
      <CinematicBars frame={frame} startFrame={0} />
    </div>
  );
}
