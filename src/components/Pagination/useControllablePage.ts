import * as React from "react";

export const useControllablePage = (
  controlled: number | undefined,
  defaultValue: number | undefined,
  onChange?: (p: number) => void,
) => {
  const isControlled = typeof controlled === "number";
  const [inner, setInner] = React.useState<number>(defaultValue ?? 1);
  const value = isControlled ? (controlled as number) : inner;
  const setValue = (p: number) => {
    if (!isControlled) setInner(p);
    onChange?.(p);
  };
  return [value, setValue] as const;
};
