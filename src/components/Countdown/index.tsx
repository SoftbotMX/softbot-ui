import clsx from "clsx";
import * as React from "react";

type Unit = "days" | "hours" | "minutes" | "seconds";
type SepKind = "colon" | "dot" | "slash" | "space";

export interface CountdownProps extends React.HTMLAttributes<HTMLDivElement> {
  /* ---- FUENTE DE TIEMPO ---- */
  until?: Date | string | number; // fecha objetivo
  seconds?: number; // duración en segundos
  days?: number;
  hours?: number;
  minutes?: number;

  /* ---- CONTROL EXTERNO ---- */
  value?: number; // segundos restantes (controlado)
  running?: boolean; // sólo no controlado (default true)
  tickMs?: number; // default 1000
  onEnd?: () => void;
  onTick?: (p: {
    totalSeconds: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }) => void;

  /* ---- RENDER ---- */
  units?: Unit[]; // si no se pasa, se auto-deduce
  labeled?: boolean; // etiqueta “d/h/m/s” debajo
  padTwo?: boolean; // hh/mm/ss con 2 dígitos (default true)
  padDays?: boolean; // días con 2 dígitos (default false)

  /* Separador: elige tipo o pasa un ReactNode */
  separator?: SepKind | React.ReactNode;

  /* Tamaño tipográfico */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /* Boxes alrededor de cada dígito */
  boxed?: boolean;
  /** clases extra para cada box */
  boxClassName?: string;
  /** clases extra para cada dígito (el <span style="--value">) */
  digitClassName?: string;
}

/* ===== Utils ===== */
function toMsFromDuration(src: {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}) {
  const d = (src.days ?? 0) * 86400;
  const h = (src.hours ?? 0) * 3600;
  const m = (src.minutes ?? 0) * 60;
  const s = src.seconds ?? 0;
  const total = d + h + m + s;
  return Math.max(0, total * 1000);
}
function initialUnitsFrom(totalSec: number): Unit[] {
  if (totalSec >= 86400) return ["days", "hours", "minutes", "seconds"];
  if (totalSec >= 3600) return ["hours", "minutes", "seconds"];
  return ["minutes", "seconds"];
}
function split(totalSec: number) {
  const days = Math.floor(totalSec / 86400);
  let rest = totalSec % 86400;
  const hours = Math.floor(rest / 3600);
  rest %= 3600;
  const minutes = Math.floor(rest / 60);
  const seconds = rest % 60;
  return { days, hours, minutes, seconds };
}
const sizeToText: Record<NonNullable<CountdownProps["size"]>, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
  xl: "text-4xl",
};
function renderSep(sep: CountdownProps["separator"], key: string) {
  if (sep == null)
    return (
      <span key={key} className="px-1">
        :
      </span>
    );
  if (typeof sep !== "string")
    return (
      <span key={key} className="px-1">
        {sep}
      </span>
    );
  const map: Record<SepKind, React.ReactNode> = {
    colon: (
      <span key={key} className="px-1">
        :
      </span>
    ),
    dot: (
      <span key={key} className="px-1">
        ·
      </span>
    ),
    slash: (
      <span key={key} className="px-1">
        /
      </span>
    ),
    space: (
      <span key={key} className="px-1">
        {"\u00A0"}
      </span>
    ),
  };

  return (
    map[sep as SepKind] ?? (
      <span key={key} className="px-1">
        :
      </span>
    )
  );
}

/** Un dígito (00..99) dentro de su propio `.countdown` para que aplique tu CSS */
function Digit({
  v,
  label,
  padTwo = true,
  boxed,
  boxClassName,
  digitClassName,
}: {
  v: number;
  label?: React.ReactNode;
  padTwo?: boolean;
  boxed?: boolean;
  boxClassName?: string;
  digitClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(99, Math.floor(v)));
  const aria = padTwo ? String(clamped).padStart(2, "0") : String(clamped);
  const core = (
    <div>
      <div className="countdown">
        <span
          style={{ "--value": clamped } as React.CSSProperties}
          aria-label={aria}
          className={digitClassName}
        />
      </div>
      {label && <span className="text-[0.625rem] opacity-70 block text-center">{label}</span>}
    </div>
  );
  if (!boxed) return core;
  return (
    <span
      className={clsx(
        "countdown-box inline-flex items-end justify-center rounded-field border border-base-200 bg-base-100 px-2 py-1",
        boxClassName,
      )}
    >
      {core}
    </span>
  );
}

const Countdown: React.FC<CountdownProps> = ({
  until,
  seconds,
  days,
  hours,
  minutes,
  value,
  running = true,
  tickMs = 1000,
  onEnd,
  onTick,
  units,
  labeled = false,
  padTwo = true,
  padDays = false,
  separator = "colon",
  size = "lg",
  boxed = false,
  boxClassName,
  digitClassName,
  className,
  ...rest
}) => {
  // segundos iniciales
  const initialTotalSec = React.useMemo(() => {
    if (typeof value === "number") return Math.max(0, Math.floor(value));
    if (until != null) {
      const t = new Date(until).getTime();
      return Math.max(0, Math.floor((t - Date.now()) / 1000));
    }
    if (typeof seconds === "number") return Math.max(0, Math.floor(seconds));
    return Math.floor(toMsFromDuration({ days, hours, minutes, seconds }) / 1000);
  }, [value, until, days, hours, minutes, seconds]);

  const displayUnits = React.useMemo<Unit[]>(
    () => units ?? initialUnitsFrom(initialTotalSec),
    [units, initialTotalSec],
  );

  const isControlled = typeof value === "number";
  const [inner, setInner] = React.useState(initialTotalSec);
  React.useEffect(() => {
    if (!isControlled) setInner(initialTotalSec);
  }, [isControlled, initialTotalSec]);

  const remaining = isControlled ? Math.max(0, Math.floor(value!)) : inner;

  // timer interno
  React.useEffect(() => {
    if (isControlled) return;
    if (!running || remaining <= 0) return;
    const id = setInterval(() => setInner((s) => Math.max(0, s - 1)), Math.max(16, tickMs));
    return () => clearInterval(id);
  }, [isControlled, running, remaining, tickMs]);

  React.useEffect(() => {
    const p = split(remaining);
    onTick?.({ totalSeconds: remaining, ...p });
    if (remaining === 0) onEnd?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const p = split(remaining);

  const blocks: React.ReactNode[] = [];
  const pushSep = () => blocks.length && blocks.push(renderSep(separator, `sep-${blocks.length}`));

  if (displayUnits.includes("days")) {
    blocks.push(
      <Digit
        key="d"
        v={p.days}
        padTwo={padDays}
        label={labeled ? "dias" : undefined}
        boxed={boxed}
        boxClassName={boxClassName}
        digitClassName={digitClassName}
      />,
    );
  }
  if (displayUnits.includes("hours")) {
    pushSep();
    blocks.push(
      <Digit
        key="h"
        v={p.hours}
        padTwo={padTwo}
        label={labeled ? "horas" : undefined}
        boxed={boxed}
        boxClassName={boxClassName}
        digitClassName={digitClassName}
      />,
    );
  }
  if (displayUnits.includes("minutes")) {
    pushSep();
    blocks.push(
      <Digit
        key="m"
        v={p.minutes}
        padTwo={padTwo}
        label={labeled ? "minutos" : undefined}
        boxed={boxed}
        boxClassName={boxClassName}
        digitClassName={digitClassName}
      />,
    );
  }
  if (displayUnits.includes("seconds")) {
    pushSep();
    blocks.push(
      <Digit
        key="s"
        v={p.seconds}
        padTwo={padTwo}
        label={labeled ? "segundos" : undefined}
        boxed={boxed}
        boxClassName={boxClassName}
        digitClassName={digitClassName}
      />,
    );
  }
  if (!blocks.length)
    blocks.push(
      <Digit
        key="def"
        v={0}
        padTwo={padTwo}
        boxed={boxed}
        boxClassName={boxClassName}
        digitClassName={digitClassName}
      />,
    );

  return (
    <div
      className={clsx("inline-flex items-end gap-1", sizeToText[size], className)}
      aria-live="polite"
      {...rest}
    >
      {blocks}
    </div>
  );
};

export default Countdown;
