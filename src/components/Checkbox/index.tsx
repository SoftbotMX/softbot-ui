import clsx from "clsx";
import React, { useState } from "react";
import type { HTMLAttributes, ChangeEvent } from "react";

export interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
  onCheck?: (e: ChangeEvent<HTMLInputElement>) => void;
  size?: Size;
}

const Checkbox = (props: CheckboxProps) => {
  const { className, onCheck, size, ...rest } = props;

  const [checked, setChecked] = useState<boolean>(false);

  return (
    <input
      type="checkbox"
      checked={checked}
      onClick={() => setChecked(!checked)}
      onChange={onCheck}
      className={clsx("checkbox", size, className)}
      {...rest}
    />
  );
};

export default Checkbox;
