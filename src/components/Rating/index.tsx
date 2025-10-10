import clsx from "clsx";
import * as React from "react";

export type RatingSize = "xs" | "sm" | "md" | "lg" | "xl";
export type RatingTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  max?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  allowHalf?: boolean;
  size?: RatingSize;
  tone?: RatingTone;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  itemClassName?: string;
  showClear?: boolean;
  itemLabels?: string[];
  ref?: React.ForwardedRef<HTMLDivElement>;
}

const Rating = (props: RatingProps) => {
  const {
    max = 5,
    value,
    defaultValue = 0,
    onChange,
    allowHalf = false,
    size = "md",
    tone,
    disabled = false,
    readOnly = false,
    name,
    className,
    itemClassName = "mask mask-star",
    showClear = false,
    itemLabels,
    ...rest
  } = props;
  const autoName = React.useId();
  const groupName = name ?? `rating-${autoName}`;

  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState<number>(defaultValue);

  const current = isControlled ? (value as number) : inner;

  const commit = (v: number) => {
    if (!isControlled) setInner(v);
    onChange?.(v);
  };

  const items: { v: number; label?: string }[] = React.useMemo(() => {
    const list: { v: number; label?: string }[] = [];
    for (let i = 1; i <= max; i++) {
      if (allowHalf) {
        list.push({ v: i - 0.5, label: itemLabels?.[i - 1] ?? `Calificación ${i - 0.5}` });
        list.push({ v: i, label: itemLabels?.[i - 1] ?? `Calificación ${i}` });
      } else {
        list.push({ v: i, label: itemLabels?.[i - 1] ?? `Calificación ${i}` });
      }
    }
    return list;
  }, [max, allowHalf, itemLabels]);

  const isChecked = (v: number) => current >= v && current < v + (allowHalf ? 0.5 : 1);

  return (
    <div
      className={clsx("rating", size && `rating-${size}`, allowHalf && "rating-half", className)}
      role="radiogroup"
      aria-label="Rating"
      {...rest}
    >
      {showClear && (
        <input
          type="radio"
          className="rating-hidden"
          name={groupName}
          aria-label="Sin puntuación"
          checked={current === 0}
          onChange={() => commit(0)}
          disabled={disabled || readOnly}
        />
      )}

      {items.map(({ v, label }, idx) => {
        const checked = isChecked(v) || (!items.some((it) => isChecked(it.v)) && v === 0);
        return (
          <input
            key={idx}
            type="radio"
            name={groupName}
            className={clsx(itemClassName, tone && `text-${tone}`)}
            aria-label={label}
            value={v}
            checked={checked}
            onChange={() => commit(v)}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      })}
    </div>
  );
};

export default Rating;
