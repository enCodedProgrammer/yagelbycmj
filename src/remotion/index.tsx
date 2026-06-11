import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { YagelAd, TOTAL_FRAMES } from "./Ad";

// YagelAd is scroll-driven on the website (frame comes from scroll position).
// In Remotion Studio, frame must come from useCurrentFrame() instead.
const DesktopAd = () => {
  const frame = useCurrentFrame();
  return <YagelAd frame={frame} isMobile={false} />;
};

const MobileAd = () => {
  const frame = useCurrentFrame();
  return <YagelAd frame={frame} isMobile={true} />;
};

const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="YagelAd-Desktop"
        component={DesktopAd}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="YagelAd-Mobile"
        component={MobileAd}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};

registerRoot(RemotionRoot);
