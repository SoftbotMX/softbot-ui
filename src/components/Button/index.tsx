import clsx from "clsx";
import * as React from "react";

export type ButtonTone =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export type ButtonLook = "solid" | "soft" | "outline" | "dash" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: ButtonTone;
  look?: ButtonLook;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  iconLeft?: string;
  iconRight?: string;
  as?: "button" | "a" | "span";
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  as = "button",
  tone,
  look = "solid",
  size = "md",
  block = false,
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  className,
  children,
  href,
  target,
  rel,
  type = "button",
  ...rest
}) => {
  const classes = clsx("btn", tone, look, size, block && "block", loading && "loading", className);

  const isDisabled = disabled || loading;

  const commonProps = {
    className: classes,
    "aria-busy": loading || undefined,
    "aria-disabled": isDisabled || undefined,
  };

  if (as === "a") {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        {...commonProps}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        onClick={(e) => {
          if (isDisabled) e.preventDefault();
          (rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)?.onClick?.(e);
        }}
      >
        <span className={clsx("flex justify-center items-center gap-2")}>
          {iconLeft && <span className={"icon-symbols"}>{iconLeft}</span>}
          {children}
          {iconRight && <span className={"icon-symbols"}>{iconRight}</span>}
        </span>
      </a>
    );
  }

  if (as === "span") {
    return (
      <span role="button" {...commonProps} {...(rest as React.HTMLAttributes<HTMLSpanElement>)}>
        <span className={clsx("flex justify-center items-center gap-2")}>
          {iconLeft && <span className={"icon-symbols"}>{iconLeft}</span>}
          {children}
          {iconRight && <span className={"icon-symbols"}>{iconRight}</span>}
        </span>
      </span>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      {...commonProps}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span className={clsx("flex justify-center items-center gap-2")}>
        {iconLeft && <span className={"icon-symbols"}>{iconLeft}</span>}
        {children}
        {iconRight && <span className={"icon-symbols"}>{iconRight}</span>}
      </span>
    </button>
  );
};

export default Button;
