import { clsx } from "clsx";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";

/** Adds `className` once the element crosses 70% of the viewport. */
export function useLitOnView(ref: RefObject<HTMLElement | null>, className = "is-lit") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add(className);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add(className);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, className]);
}

type TubeHeadingProps = {
  children: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
};

/** Section H2: a lit tube word over a blue underline tube 20% shorter than it. */
export function TubeHeading({ children, id, as: Tag = "h2", className }: TubeHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useLitOnView(ref);
  return (
    <Tag ref={ref} id={id} className={clsx("tc-tube-heading", className)}>
      <span className="tc-tube-heading__word">{children}</span>
    </Tag>
  );
}
