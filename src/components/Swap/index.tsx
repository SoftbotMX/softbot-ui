// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import clsx from "clsx";
import * as React from "react";

export interface SwapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  active?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  rotate?: boolean;
  flip?: boolean;
  name?: string;
  value?: string;
  "aria-label"?: string;
  off?: React.ReactNode;
  on?: React.ReactNode;
  indeterminateNode?: React.ReactNode;
  iconOff?: string;
  iconOn?: string;
  iconIndeterminate?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  ref?: React.Ref<HTMLDivElement>;
}

const Swap = (props: SwapProps) => {
  const {
    active,
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate,
    disabled,
    rotate,
    flip,
    name,
    value,
    off,
    on,
    indeterminateNode,
    iconOff,
    iconOn,
    iconIndeterminate,
    className,
    inputProps,
    ...rest
  } = props;

  // Controlado vs no controlado
  const isControlled = typeof checked === "boolean";
  const [innerChecked, setInnerChecked] = React.useState<boolean>(defaultChecked ?? false);
  const resolvedChecked = isControlled ? checked! : innerChecked;

  // id para asociar label/input
  const autoId = React.useId();
  const inputId = inputProps?.id ?? `swap-${autoId}`;

  // indeterminate (visual) en el input
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) setInnerChecked(next);
    onCheckedChange?.(next);
  };

  const renderNode = (
    kind: "off" | "on" | "indeterminate",
    node?: React.ReactNode,
    icon?: string,
  ) => {
    if (node != null) return node;
    if (icon) return <span className="icon-symbols">{icon}</span>;
    if (kind === "off") return <span>Off</span>;
    if (kind === "on") return <span>On</span>;
    return <span>—</span>;
  };

  const Wrapper: React.ElementType = active ? "div" : "label";
  const wrapperProps = active
    ? {
        className: clsx(
          "swap",
          rotate && "swap-rotate",
          flip && "swap-flip",
          "swap-active",
          className,
        ),
        ...rest,
      }
    : {
        htmlFor: inputId,
        className: clsx("swap", rotate && "swap-rotate", flip && "swap-flip", className),
        ...rest,
      };

  return (
    <Wrapper {...(wrapperProps as any)}>
      {!active && (
        <input
          ref={inputRef}
          id={inputId}
          type="checkbox"
          className="sr-only"
          name={name}
          value={value}
          checked={resolvedChecked}
          onChange={handleChange}
          disabled={disabled}
          aria-label={props["aria-label"] ?? "toggle"}
          {...inputProps}
        />
      )}

      <div className="swap-off" aria-hidden="true">
        {renderNode("off", off, iconOff)}
      </div>

      <div className="swap-on" aria-hidden="true">
        {renderNode("on", on, iconOn)}
      </div>

      <div className="swap-indeterminate" aria-hidden="true">
        {renderNode("indeterminate", indeterminateNode, iconIndeterminate)}
      </div>
    </Wrapper>
  );
};

export default Swap;
