import { Radar } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

interface IconRippleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon we want to have.
   */
  icon?: React.ElementType;
  /**
   * Size of Icon
   */
  iconSize?: number;
  /**
   * Color of the Icon
   */
  iconColor?: string;
  /**
   * Border color that will have ripple animation
   */
  borderColor?: string;
  /**
   * Padding around the icon
   */
  inset?: string;
}

export function IconRipple({
  icon: Icon = Radar,
  iconSize = 24,
  iconColor = "#ddd",
  borderColor = "#ddd",
  inset = "10px",
}: IconRippleProps) {
  const customBorderStyle = {
    borderColor,
  };
  const insetStyle = {
    top: `-${inset}`,
    bottom: `-${inset}`,
    left: `-${inset}`,
    right: `-${inset}`,
  };

  return (
    <div className={cn("group relative flex items-center justify-center")}>
      <Icon size={iconSize} color={iconColor} />
      <div
        className={cn("absolute -inset-4 animate-ping rounded-full border-2")}
        style={{ ...customBorderStyle, ...insetStyle }}
      />
    </div>
  );
}
