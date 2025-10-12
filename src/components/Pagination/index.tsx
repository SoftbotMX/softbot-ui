import clsx from "clsx";
import * as React from "react";

import { getTokens, labelForControl, symbolForControl } from "./helpers";
import { useControllablePage } from "./useControllablePage";

export type PaginationSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  total: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  showEdges?: boolean;
  showPrevNext?: boolean;
  size?: PaginationSize;
  disabled?: boolean;
  itemClassName?: string;
  "aria-label"?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const Pagination = (props: PaginationProps) => {
  const {
    total,
    page,
    defaultPage = 1,
    onPageChange,
    siblingCount = 1,
    showEdges = true,
    showPrevNext = true,
    size = "md",
    disabled = false,
    className,
    itemClassName,
    "aria-label": ariaLabel = "Pagination",
    ...rest
  } = props;

  const [value, setValue] = useControllablePage(page, defaultPage, onPageChange);
  const current = Math.min(Math.max(1, value), Math.max(1, total));

  const tokens = React.useMemo(
    () => getTokens(total, current, siblingCount, showEdges, showPrevNext, disabled),
    [total, current, siblingCount, showEdges, showPrevNext, disabled],
  );

  const go = (p: number) => {
    if (disabled) return;
    const clamped = Math.min(Math.max(1, p), total);
    if (clamped !== current) setValue(clamped);
  };

  return (
    <nav className={clsx("join", className)} role="navigation" aria-label={ariaLabel} {...rest}>
      {tokens.map((t) => {
        if (t.type === "ellipsis") {
          return (
            <button
              key={t.key}
              type="button"
              className={clsx("join-item btn ghost", size)}
              disabled
              aria-hidden="true"
              tabIndex={-1}
            >
              …
            </button>
          );
        }
        if (t.type === "control") {
          const { kind, disabled: d } = t;
          const target =
            kind === "first"
              ? 1
              : kind === "prev"
                ? current - 1
                : kind === "next"
                  ? current + 1
                  : total;
          return (
            <button
              key={t.key}
              type="button"
              className={clsx("join-item btn ghost", size, itemClassName)}
              onClick={() => go(target)}
              aria-label={labelForControl(kind)}
              disabled={d}
            >
              {symbolForControl(kind)}
            </button>
          );
        }

        return (
          <button
            key={t.key}
            type="button"
            className={clsx("join-item btn ghost", size, t.active && "active", itemClassName)}
            aria-current={t.active ? "page" : undefined}
            onClick={() => go(t.page)}
          >
            {t.page}
          </button>
        );
      })}
    </nav>
  );
};

export default Pagination;
