import clsx from "clsx";
import * as React from "react";

export type KbdSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: KbdSize;
  keyLabel?: React.ReactNode;
  keys?: React.ReactNode[];
  separator?: React.ReactNode;
  itemClassName?: string;
  asGroup?: keyof React.JSX.IntrinsicElements;
  ref?: React.Ref<HTMLElement>;
}

const Kbd = (props: KbdProps) => {
  const {
    size = "md",
    keyLabel,
    keys,
    separator = "+",
    className,
    itemClassName,
    asGroup = "span",
    ...rest
  } = props;
  const sizeCls = size ? `kbd-${size}` : undefined;

  if (!keys || keys.length === 0) {
    return (
      <kbd className={clsx("kbd", sizeCls, className)} {...rest}>
        {keyLabel}
      </kbd>
    );
  }

  const As: any = asGroup;

  return (
    <As className={clsx("inline-flex items-center gap-1", className)} {...rest}>
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 ? (
            <span aria-hidden className="px-0.5 opacity-70">
              {separator}
            </span>
          ) : null}
          <kbd className={clsx("kbd", sizeCls, itemClassName)}>{k}</kbd>
        </React.Fragment>
      ))}
    </As>
  );
};

export default Kbd;
