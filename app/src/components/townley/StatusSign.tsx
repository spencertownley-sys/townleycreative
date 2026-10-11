import { clsx } from "clsx";
import type { CSSProperties, MouseEventHandler } from "react";

import { BOOKING_STATUS, PRICING_HREF } from "../../site";

type StatusSignProps = {
  status?: string;
  /** Dot color; defaults to --word. */
  dot?: string;
  pulse?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};

/** The OPEN sign: booking status with a pulsing green dot. */
export function StatusSign({
  status = BOOKING_STATUS,
  dot,
  pulse = true,
  href = PRICING_HREF,
  onClick,
  className,
}: StatusSignProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={clsx("tc-status", pulse && "tc-status--pulse", className)}
      style={dot ? ({ "--dot": dot } as CSSProperties) : undefined}
    >
      <span className="tc-status__dot" aria-hidden="true" />
      <span>{status}</span>
    </a>
  );
}
