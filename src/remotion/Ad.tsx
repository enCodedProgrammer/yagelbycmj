import { Intro } from "./scenes/Intro";
import { BrandEmergence } from "./scenes/BrandEmergence";
import { ForHer } from "./scenes/ForHer";
import { ZoomPunch } from "./scenes/ZoomPunch";
import { ForHim } from "./scenes/ForHim";
import { StoryBeat } from "./scenes/StoryBeat";
import { DoubleReveal } from "./scenes/DoubleReveal";
import { EndCard } from "./scenes/EndCard";

export const TOTAL_FRAMES = 900;

const S = {
  intro: 0,
  brand: 60,
  forHer: 150,
  punch: 300,
  forHim: 330,
  story: 480,
  double: 570,
  end: 750,
};

export function YagelAd({ frame, isMobile }: { frame: number; isMobile?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
      {frame < 70 && <Intro frame={frame} isMobile={isMobile} />}
      {frame >= 55 && frame < 160 && <BrandEmergence frame={frame} startFrame={S.brand} isMobile={isMobile} />}
      {frame >= 145 && frame < 310 && <ForHer frame={frame} startFrame={S.forHer} isMobile={isMobile} />}
      {frame >= 298 && frame < 335 && <ZoomPunch frame={frame} startFrame={S.punch} />}
      {frame >= 325 && frame < 490 && <ForHim frame={frame} startFrame={S.forHim} isMobile={isMobile} />}
      {frame >= 475 && frame < 580 && <StoryBeat frame={frame} startFrame={S.story} isMobile={isMobile} />}
      {frame >= 565 && frame < 760 && <DoubleReveal frame={frame} startFrame={S.double} isMobile={isMobile} />}
      {frame >= 745 && <EndCard frame={frame} startFrame={S.end} isMobile={isMobile} />}
    </div>
  );
}
