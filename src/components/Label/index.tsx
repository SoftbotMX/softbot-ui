// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import clsx from "clsx";
import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  position?: "leading" | "trailing";
  ref?: React.Ref<HTMLLabelElement>;
}

const Label = ({ className, position, children, ...rest }: LabelProps) => {
  const posCls =
    position === "leading"
      ? "label-leading"
      : position === "trailing"
        ? "label-trailing"
        : undefined;

  return (
    <label className={clsx("label", posCls, className)} {...rest}>
      {children}
    </label>
  );
};

export interface FloatingLabelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: React.ReactNode;
  field: React.ReactElement | ((props: { id: string }) => React.ReactElement);
  id?: string;
  floatingSpanClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const FloatingLabel = (props: FloatingLabelProps) => {
  const { label, field, id, className, floatingSpanClassName, ...rest } = props;
  const autoId = React.useId();
  const fieldId = id ?? `fl-${autoId}`;

  const renderField =
    typeof field === "function"
      ? field({ id: fieldId })
      : React.cloneElement(field as React.ReactElement, { id: fieldId });

  const ensuredField =
    React.isValidElement(renderField) &&
    (renderField.props.placeholder === undefined || renderField.props.placeholder === null)
      ? React.cloneElement(renderField, { placeholder: " " })
      : renderField;

  return (
    <div className={clsx("floating-label", className)} {...rest}>
      {ensuredField}
      <span className={clsx(floatingSpanClassName)}>{label}</span>
    </div>
  );
};

export default Label;
