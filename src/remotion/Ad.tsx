import { Intro } from "./scenes/Intro";
import { BrandEmergence } from "./scenes/BrandEmergence";
import { ForHer } from "./scenes/ForHer";
import { ZoomPunch } from "./scenes/ZoomPunch";
import { ForHim } from "./scenes/ForHim";
import { StoryBeat } from "./scenes/StoryBeat";
import { DoubleReveal } from "./scenes/DoubleReveal";
import { EndCard } from "./scenes/EndCard";

export const TOTAL_FRAMES = 1030;

// Scene start frames (elapsed=0 origin for each scene).
// Derived from each scene's new fade-out boundary so transitions stay flush:
//   Brand fades out at elapsed 108 → frame 168; ForHer fades at elapsed 168 → frame 318;
//   ZoomPunch anchors at ForHer's fade start (318); ForHim at punch+30 (348);
//   StoryBeat at ForHim fade (348+168=516); DoubleReveal at story fade (516+135=651);
//   EndCard at double fade (651+198=849).
const S = {
  intro:  0,
  brand:  60,
  forHer: 150,
  punch:  318,   // was 300 — anchored to ForHer's new fade boundary
  forHim: 348,   // was 330 — punch+30
  story:  516,   // was 480 — ForHim new fade boundary
  double: 651,   // was 570 — StoryBeat new fade boundary
  end:    849,   // was 750 — DoubleReveal new fade boundary
};

export function YagelAd({ frame, isMobile }: { frame: number; isMobile?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
      {frame < 70 && <Intro frame={frame} isMobile={isMobile} />}
      {frame >= 55  && frame < 178 && <BrandEmergence frame={frame} startFrame={S.brand}  isMobile={isMobile} />}
      {frame >= 145 && frame < 328 && <ForHer         frame={frame} startFrame={S.forHer} isMobile={isMobile} />}
      {frame >= 316 && frame < 353 && <ZoomPunch      frame={frame} startFrame={S.punch} />}
      {frame >= 343 && frame < 526 && <ForHim         frame={frame} startFrame={S.forHim} isMobile={isMobile} />}
      {frame >= 511 && frame < 661 && <StoryBeat      frame={frame} startFrame={S.story}  isMobile={isMobile} />}
      {frame >= 646 && frame < 859 && <DoubleReveal   frame={frame} startFrame={S.double} isMobile={isMobile} />}
      {frame >= 844 &&                <EndCard         frame={frame} startFrame={S.end}    isMobile={isMobile} />}
    </div>
  );
}
