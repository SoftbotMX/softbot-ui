import clsx from "clsx";
import * as React from "react";

export type CardSize = "xs" | "sm" | "md" | "lg" | "xl";
export type CardBorder = "none" | "solid" | "dash";
export type CardLayout = "default" | "side";
export type CardImageMode = "normal" | "full";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  size?: CardSize;
  border?: CardBorder;
  layout?: CardLayout;
  imageMode?: CardImageMode;

  title?: React.ReactNode;
  figure?: React.ReactNode;
  actions?: React.ReactNode;
}

const sizeToClass = (s?: CardSize) => (s ? `card-${s}` : undefined);
const borderToClass = (b?: CardBorder) =>
  b === "solid" ? "card-border" : b === "dash" ? "card-dash" : undefined;

const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    size = "md",
    border = "solid",
    layout = "default",
    imageMode = "normal",
    title,
    figure,
    actions,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = clsx(
    "card",
    sizeToClass(size),
    borderToClass(border),
    layout === "side" && "card-side",
    imageMode === "full" && "image-full",
    className,
  );

  const hasShortcuts = figure || title || actions;

  return (
    <div ref={ref} className={classes} {...rest}>
      {hasShortcuts ? (
        <>
          {figure ? <figure>{figure}</figure> : null}
          <div className="card-body">
            {title ? <div className="card-title">{title}</div> : null}
            {children}
            {actions ? <div className="card-actions">{actions}</div> : null}
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
});

export type CardFigureProps = React.HTMLAttributes<HTMLElement>;
const CardFigure: React.FC<CardFigureProps> = ({ className, children, ...rest }) => (
  <figure className={clsx(className)} {...rest}>
    {children}
  </figure>
);

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;
const CardBody: React.FC<CardBodyProps> = ({ className, children, ...rest }) => (
  <div className={clsx("card-body", className)} {...rest}>
    {children}
  </div>
);

export type CardTitleProps = React.HTMLAttributes<HTMLDivElement>;
const CardTitle: React.FC<CardTitleProps> = ({ className, children, ...rest }) => (
  <div className={clsx("card-title", className)} {...rest}>
    {children}
  </div>
);

export type CardActionsProps = React.HTMLAttributes<HTMLDivElement>;
const CardActions: React.FC<CardActionsProps> = ({ className, children, ...rest }) => (
  <div className={clsx("card-actions", className)} {...rest}>
    {children}
  </div>
);

const Card = Object.assign(CardRoot, {
  Figure: CardFigure,
  Body: CardBody,
  Title: CardTitle,
  Actions: CardActions,
});

export default Card;
