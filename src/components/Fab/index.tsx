import clsx from "clsx";
import * as React from "react";

import Button, { type ButtonProps } from "../Button";

export interface FabProps {
  withClose?: boolean;
  flower?: boolean;
  mainButton?: boolean;
  actions?: FabActions[];
  buttonProps: ButtonProps;
  closeButtonProps: ButtonProps;
  mainButtonProps: ButtonProps;
  className: string;
}

export interface FabActions extends ButtonProps {
  label?: string;
  tooltip?: string;
}

const Fab = (props: FabProps) => {
  const {
    withClose,
    flower,
    actions,
    buttonProps,
    closeButtonProps,
    mainButtonProps,
    mainButton,
    className,
  } = props;

  return (
    <div className={clsx("fab", flower && "fab-flower", className)}>
      <Button
        tabIndex={0}
        role="button"
        {...buttonProps}
        className={clsx("circle", buttonProps?.className)}
      />

      {withClose && (
        <div className={"fab-close"}>
          <Button
            tone={"error"}
            iconLeft={"close"}
            {...closeButtonProps}
            className={clsx("circle", closeButtonProps?.className)}
          />
        </div>
      )}

      {(flower || mainButton) && (
        <Button
          tone={"neutral"}
          {...mainButtonProps}
          className={clsx("circle", "fab-main-action", mainButtonProps?.className)}
        />
      )}

      {actions?.map((action, index) =>
        action.label ? (
          <div key={`fab-action-${index}`}>
            {action.label} <Button className={"circle"} {...action} />
          </div>
        ) : action.tooltip ? (
          <div key={`fab-action-${index}`} className="tooltip" data-tip={"label"}>
            <Button className={"circle"} {...action} />
          </div>
        ) : (
          <Button key={`fab-action-${index}`} className={"circle"} {...action} />
        ),
      )}
    </div>
  );
};

export default Fab;
