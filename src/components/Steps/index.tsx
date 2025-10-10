import clsx from "clsx";
import * as React from "react";

export type StepsOrientation = "horizontal" | "vertical";
export type StepTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface StepItem {
  label?: React.ReactNode;
  content?: string;
  icon?: string;
  tone?: StepTone;
  className?: string;
}

export interface StepsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: StepItem[];
  orientation?: StepsOrientation;
  currentIndex?: number;
  completedCount?: number;
  activeTone?: StepTone;
  direction?: StepsOrientation;
  ref?: React.Ref<HTMLUListElement>;
}

const Steps = (props: StepsProps) => {
  const {
    items,
    orientation = "horizontal",
    direction, // alias
    currentIndex,
    completedCount,
    activeTone = "primary",
    className,
    ...rest
  } = props;
  const orientationFinal = direction ?? orientation;

  const isDone = (idx: number) => {
    if (typeof completedCount === "number") return idx < completedCount;
    if (typeof currentIndex === "number") return idx < currentIndex;
    return false;
  };

  return (
    <ul
      className={clsx(
        "steps",
        orientationFinal === "vertical" ? "steps-vertical" : "steps-horizontal",
        className,
      )}
      role="list"
      {...rest}
    >
      {items.map((step, idx) => {
        const { label, content, icon, tone, className: liCls } = step;
        const computedTone = tone ?? (isDone(idx) ? activeTone : undefined);
        const toneCls = computedTone ? `step-${computedTone}` : undefined;

        const dataContent = typeof content === "string" && !icon ? { "data-content": content } : {};

        return (
          <li key={idx} className={clsx("step", toneCls, liCls)} {...dataContent}>
            {icon ? (
              <span
                className="step-icon"
                aria-hidden="true"
                title={typeof label === "string" ? label : undefined}
              >
                <span className="icon-symbols">{icon}</span>
              </span>
            ) : null}

            {/* Texto debajo del círculo */}
            {label ? <div className="mt-1">{label}</div> : null}
          </li>
        );
      })}
    </ul>
  );
};

export default Steps;
