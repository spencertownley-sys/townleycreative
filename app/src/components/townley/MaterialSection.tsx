import { clsx } from "clsx";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type Material = "brick" | "asphalt" | "metal" | "leather" | "dirt" | "ground";

type MaterialSectionProps = HTMLAttributes<HTMLElement> & {
  material: Material;
  as?: "section" | "div" | "footer" | "aside";
  children?: ReactNode;
};

/** Section wrapper: one material per section (the page grain is global). */
export function MaterialSection({
  material,
  as: Tag = "section",
  className,
  children,
  ...rest
}: MaterialSectionProps) {
  return (
    <Tag className={clsx("tc-mat", `tc-mat-${material}`, className)} {...rest}>
      {children}
    </Tag>
  );
}

type MetalBarProps = {
  /** Bar height in px. */
  thickness?: number;
  bolts?: boolean;
  className?: string;
};

/** Brushed-metal divider with bolt heads at the ends. */
export function MetalBar({ thickness = 10, bolts = true, className }: MetalBarProps) {
  return (
    <div
      className={clsx("tc-metal-bar tc-mat-metal", className)}
      style={{ "--bar-h": `${thickness}px` } as CSSProperties}
      aria-hidden="true"
    >
      {bolts ? (
        <>
          <span className="tc-metal-bar__bolt tc-metal-bar__bolt--l" />
          <span className="tc-metal-bar__bolt tc-metal-bar__bolt--r" />
        </>
      ) : null}
    </div>
  );
}
