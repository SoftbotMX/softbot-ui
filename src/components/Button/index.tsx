import clsx from "clsx";
import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  tone?: Tone;
  size?: Size;
};

export const Button = (props: ButtonProps) => {
  const { variant, tone, size, className, ...rest } = props;
  return <button className={clsx(variant, tone, size, className)} {...rest} />;
};

export default Button;
