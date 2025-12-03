import clsx from "clsx";
import * as React from "react";

export type BadgeTone =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export type BadgeLook = "soft" | "outline" | "dash" | "ghost";
export type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  look?: BadgeLook;
  size?: BadgeSize;
  empty?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  as?: "span" | "div" | "button" | "a";
  href?: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  target?: string;
  rel?: string;
}

const Badge: React.FC<BadgeProps> = ({
  tone,
  look,
  size,
  empty = false,
  iconLeft,
  iconRight,
  as = "span",
  className,
  children,
  href,
  type,
  target,
  rel,
  ...rest
}) => {
  const RawElement: React.HTMLElementType = as;

  return (
    <RawElement
      className={clsx("badge", tone, look, size, className)}
      href={as === "a" ? href : undefined}
      type={as === "button" ? (type ?? "button") : undefined}
      target={as === "a" ? target : undefined}
      rel={as === "a" ? rel : undefined}
      {...rest}
    >
      {empty ? null : (
        <span className={clsx("inline-flex items-center gap-2")}>
          {iconLeft && <span className="icon-symbols">{iconLeft}</span>}
          {children}
          {iconRight && <span className="icon-symbols">{iconRight}</span>}
        </span>
      )}
    </RawElement>
  );
};

export default Badge;
