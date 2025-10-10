import clsx from "clsx";
import * as React from "react";

export type AlertTone = "info" | "success" | "warning" | "error";
export type AlertLook = "soft" | "outline" | "dash";
export type AlertDirection = "horizontal" | "vertical";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  look?: AlertLook;
  direction?: AlertDirection;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  tone = "info",
  look,
  direction = "horizontal",
  icon,
  title,
  actions,
  className,
  children,
  ...rest
}) => {
  return (
    <div role="alert" className={clsx("alert", tone, look, direction, className)} {...rest}>
      {icon && (
        <div aria-hidden className="icon">
          {icon}
        </div>
      )}

      <div className="content">
        {title ? <div className="font-medium">{title}</div> : null}
        {children ? <div>{children}</div> : null}
      </div>

      {actions ? <div className="actions">{actions}</div> : null}
    </div>
  );
};

export default Alert;
