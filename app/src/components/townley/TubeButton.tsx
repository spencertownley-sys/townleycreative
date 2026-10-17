import { clsx } from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "fill" | "outline" | "text";

type Common = {
  /** fill = green, the one message button; outline = blue tube; text = plain. */
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };
type ButtonProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

/** All CTAs. A link when given an href (external links open in a new tab), else a button. */
export function TubeButton(props: LinkProps | ButtonProps) {
  const { variant = "fill", icon, className, children, ...rest } = props;
  const classes = clsx("tc-btn", `tc-btn--${variant}`, className);
  const content = (
    <>
      {children}
      {icon}
    </>
  );

  if (rest.href !== undefined) {
    const external = /^https?:\/\//.test(rest.href);
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonRest} type={type} className={classes}>
      {content}
    </button>
  );
}
