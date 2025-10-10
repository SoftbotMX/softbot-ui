import clsx from "clsx";
import * as React from "react";

export type StatsOrientation = "horizontal" | "vertical";

export interface StatsProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: StatsOrientation;
  ref?: React.Ref<HTMLDivElement>;
}

export const Stats = ({ orientation = "horizontal", className, children, ...rest }: StatsProps) => {
  const orientationCls = orientation === "vertical" ? "stats-vertical" : "stats-horizontal";

  return (
    <div className={clsx("stats", orientationCls, className)} {...rest}>
      {children}
    </div>
  );
};

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export const Stat = ({ className, children, ...rest }: StatProps) => (
  <div className={clsx("stat", className)} {...rest}>
    {children}
  </div>
);

export interface SlotProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  icon?: string;
}

export const StatFigure = ({ className, icon, ...rest }: SlotProps) => (
  <div className={clsx("stat-figure", className)} {...rest}>
    <span className="icon-symbols">{icon}</span>
  </div>
);

export const StatTitle = ({ className, children, ...rest }: SlotProps) => (
  <div className={clsx("stat-title", className)} {...rest}>
    {children}
  </div>
);

export const StatValue = ({ className, children, ...rest }: SlotProps) => (
  <div className={clsx("stat-value", className)} {...rest}>
    {children}
  </div>
);

export const StatDesc = ({ className, children, ...rest }: SlotProps) => (
  <div className={clsx("stat-desc", className)} {...rest}>
    {children}
  </div>
);

export const StatActions = ({ className, children, ...rest }: SlotProps) => (
  <div className={clsx("stat-actions", className)} {...rest}>
    {children}
  </div>
);

export default Object.assign(Stats, {
  Item: Stat,
  Figure: StatFigure,
  Title: StatTitle,
  Value: StatValue,
  Desc: StatDesc,
  Actions: StatActions,
});
