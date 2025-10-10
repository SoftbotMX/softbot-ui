import clsx from "clsx";
import * as React from "react";

export type LoadingVariant = "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";

export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LoadingProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  variant?: LoadingVariant;
  size?: LoadingSize;
  label?: string;
  srOnlyLabel?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

const Loading = (props: LoadingProps) => {
  const {
    variant = "spinner",
    size = "md",
    className,
    label = "Loading…",
    srOnlyLabel = true,
    ...rest
  } = props;
  const variantCls = `loading-${variant}`;
  const sizeCls = `loading-${size}`;

  return (
    <span
      aria-label={label}
      role="status"
      aria-live="polite"
      className={clsx("loading", variantCls, sizeCls, className)}
      {...rest}
    >
      {srOnlyLabel ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="ms-2 align-middle">{label}</span>
      )}
    </span>
  );
};

export default Loading;
