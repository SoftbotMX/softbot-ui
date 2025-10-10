import clsx from "clsx";
import * as React from "react";

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: React.ReactNode;
  legendActions?: React.ReactNode;
  label?: React.ReactNode;
  ref?: React.Ref<HTMLFieldSetElement>;
}

const Fieldset = (props: FieldsetProps) => {
  const { legend, legendActions, label, className, children, ref, ...rest } = props;
  return (
    <fieldset ref={ref} className={clsx("fieldset", className)} {...rest}>
      {(legend != null || legendActions != null) && (
        <legend className="fieldset-legend">
          <span className="truncate">{legend}</span>
          {legendActions ? <span className="shrink-0">{legendActions}</span> : null}
        </legend>
      )}

      {label != null ? <div className="fieldset-label">{label}</div> : null}

      {children}
    </fieldset>
  );
};

export default Fieldset;
