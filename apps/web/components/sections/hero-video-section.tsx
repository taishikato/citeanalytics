import { HeroVideoDialog } from "@workspace/ui/components/magicui/hero-video-dialog";

import heroScreenshot from "@/assets/hero-screenshot.png";

export function HeroVideoSection() {
  return (
    <div className="relative px-6 mt-10">
      <div className="relative size-full shadow-xl rounded-2xl overflow-hidden">
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/EHcOJih-eIA"
          thumbnailSrc={heroScreenshot.src}
          thumbnailAlt="Hero Video"
        />
      </div>
    </div>
  );
}
