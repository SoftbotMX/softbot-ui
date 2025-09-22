import * as React from "react";
import type { HTMLProps } from "react";

export interface PropsInput extends HTMLProps<HTMLInputElement> {
  label?: string;
  legend?: string;
  validity?: boolean;
  error?: boolean;
  icon?: string;
}

const Input = (props: PropsInput) => {
  const { label, placeholder, legend, type } = props;
  return label ? (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <input type={type} className="input" placeholder={placeholder} />
      {legend && <p className="label">{legend}</p>}
    </fieldset>
  ) : (
    <label className="input">
      Path
      <input type="text" className="grow" placeholder="src/app/" />
      <span className="badge badge-neutral badge-xs">Optional</span>
    </label>
  );
};

export default Input;
