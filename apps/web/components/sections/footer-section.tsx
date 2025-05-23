"use client";

import { Icons } from "@/components/icons";
import { FlickeringGrid } from "@workspace/ui/components/magicui/flickering-grid";
import { useMediaQuery } from "@/hooks/use-media-query";
import { siteConfig } from "@/lib/config";
import { Quote, Github } from "lucide-react";
import Link from "next/link";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

export function FooterSection() {
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer id="footer" className="w-full pb-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-10">
        <div className="flex flex-col items-start justify-start gap-y-5 max-w-xs mx-0">
          <Link href="/" className="flex items-center gap-2">
            <Quote className="size-5 text-primary" />
            <p className="text-xl font-semibold text-primary">
              {siteConfig.name}
            </p>
          </Link>
          <p className="tracking-tight text-muted-foreground font-medium">
            {siteConfig.hero.description}
          </p>

          <Link
            href="https://discord.gg/zuVe2kBETN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <DiscordLogoIcon className="size-4" />
            <span>Join our Discord</span>
          </Link>

          <Link
            href="https://x.com/taishik_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Icons.twitter className="size-4" />
            <span>Follow us on X</span>
          </Link>

          <Link
            href="https://github.com/taishikato/citeanalytics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="size-4" />
            <span>Star us on GitHub</span>
          </Link>
        </div>
      </div>
      <div className="w-full h-48 md:h-64 relative mt-24 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-background z-10 from-40%" />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            // @ts-ignore
            text={tablet ? "SkyAgent" : "Streamline your workflow"}
            fontSize={tablet ? 70 : 90}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="#6B7280"
            maxOpacity={0.3}
            flickerChance={0.1}
          />
        </div>
      </div>
    </footer>
  );
}
