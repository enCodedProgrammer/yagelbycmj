import { Intro } from "./scenes/Intro";
import { BrandEmergence } from "./scenes/BrandEmergence";
import { ForHer } from "./scenes/ForHer";
import { ForHim } from "./scenes/ForHim";
import { StoryBeat } from "./scenes/StoryBeat";
import { DoubleReveal } from "./scenes/DoubleReveal";
import { EndCard } from "./scenes/EndCard";

export const TOTAL_FRAMES = 1000;

// Scene start frames (elapsed=0 origin for each scene).
// Derived from each scene's fade-out boundary so transitions stay flush:
//   Brand fades out at elapsed 108 → frame 168; ForHer fades at elapsed 168 → frame 318;
//   ForHim starts at 318 (direct cross-fade, no ZoomPunch);
//   StoryBeat at ForHim fade (318+168=486); DoubleReveal at story fade (486+135=621);
//   EndCard at double fade (621+198=819).
const S = {
  intro:  0,
  brand:  60,
  forHer: 150,
  forHim: 318,   // starts as ForHer fades out — direct cross-fade, no punch flash
  story:  486,
  double: 621,
  end:    819,
};

export function YagelAd({ frame, isMobile }: { frame: number; isMobile?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
      {frame < 70 && <Intro frame={frame} isMobile={isMobile} />}
      {frame >= 55  && frame < 178 && <BrandEmergence frame={frame} startFrame={S.brand}  isMobile={isMobile} />}
      {frame >= 145 && frame < 328 && <ForHer         frame={frame} startFrame={S.forHer} isMobile={isMobile} />}
      {frame >= 313 && frame < 496 && <ForHim         frame={frame} startFrame={S.forHim} isMobile={isMobile} />}
      {frame >= 481 && frame < 631 && <StoryBeat      frame={frame} startFrame={S.story}  isMobile={isMobile} />}
      {frame >= 616 && frame < 829 && <DoubleReveal   frame={frame} startFrame={S.double} isMobile={isMobile} />}
      {frame >= 814 &&                <EndCard         frame={frame} startFrame={S.end}    isMobile={isMobile} />}
    </div>
  );
}
