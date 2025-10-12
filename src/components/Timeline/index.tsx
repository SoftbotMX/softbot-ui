import clsx from "clsx";
import * as React from "react";

export type TimelineOrientation = "horizontal" | "vertical";
export type TimelineSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TimelineTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface TimelineItem {
  start?: React.ReactNode;
  end?: React.ReactNode;
  middle?: React.ReactNode;
  startBox?: boolean;
  endBox?: boolean;
  iconTone?: TimelineTone;
  iconSize?: TimelineSize;
  className?: string;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLUListElement> {
  items: TimelineItem[];
  orientation?: TimelineOrientation;
  compact?: boolean;
  snapIcon?: boolean;
  ref?: React.Ref<HTMLUListElement>;
}

const Box: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="timeline-box">{children}</div>
);

const DefaultDot: React.FC<{ tone?: TimelineTone; size?: TimelineSize }> = ({
  tone = "primary",
  size = "md",
}) => <span className={clsx("status", `status-${tone}`, `status-${size}`)} />;

const Timeline: React.FC<TimelineProps> = ({
  items,
  orientation = "horizontal",
  compact = false,
  snapIcon = false,
  className,
  ...rest
}) => {
  return (
    <ul
      className={clsx(
        "timeline",
        orientation === "vertical" ? "timeline-vertical" : "timeline-horizontal",
        compact && "timeline-compact",
        snapIcon && "timeline-snap-icon",
        className,
      )}
      {...rest}
    >
      {items.map((it, i) => {
        const startEl = it.startBox && it.start ? <Box>{it.start}</Box> : it.start;
        const endEl = it.endBox && it.end ? <Box>{it.end}</Box> : it.end;

        return (
          <li key={i} className={it.className}>
            <hr />
            {startEl && <div className="timeline-start">{startEl}</div>}

            <div className="timeline-middle">
              {it.middle ?? <DefaultDot tone={it.iconTone} size={it.iconSize} />}
            </div>

            {endEl && <div className="timeline-end">{endEl}</div>}
            <hr />
          </li>
        );
      })}
    </ul>
  );
};

export default Timeline;
