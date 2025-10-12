import clsx from "clsx";
import * as React from "react";

export type ToastVPos = "top" | "middle" | "bottom";
export type ToastHPos = "start" | "center" | "end";
export type ToastTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  content?: React.ReactNode;
  tone?: ToastTone;
  duration?: number;
  dismissible?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ToastItem[];
  defaultItems?: ToastItem[];
  onRemove?: (id: string) => void;
  vertical?: ToastVPos;
  horizontal?: ToastHPos;
  itemClassName?: string;
}

const toneClasses: Record<ToastTone | "default", string> = {
  default: "bg-base-200 text-base-content",
  neutral: "bg-neutral text-neutral-content",
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  accent: "bg-accent text-accent-content",
  info: "bg-info text-info-content",
  success: "bg-success text-success-content",
  warning: "bg-warning text-warning-content",
  error: "bg-error text-error-content",
};

const Toast: React.FC<ToastProps> = ({
  items,
  defaultItems = [],
  onRemove,
  vertical = "bottom",
  horizontal = "end",
  className,
  itemClassName,
  ...rest
}) => {
  const controlled = Array.isArray(items);
  const [local, setLocal] = React.useState<ToastItem[]>(defaultItems);
  const list = controlled ? (items as ToastItem[]) : local;

  const remove = React.useCallback(
    (id: string) => {
      if (controlled) onRemove?.(id);
      else setLocal((prev) => prev.filter((t) => t.id !== id));
    },
    [controlled, onRemove],
  );

  // auto-dismiss
  React.useEffect(() => {
    const timers = list
      .filter((t) => (t.duration ?? 0) > 0)
      .map((t) => window.setTimeout(() => remove(t.id), t.duration));
    return () => timers.forEach(clearTimeout);
  }, [list, remove]);

  return (
    <div className={clsx("toast", `toast-${horizontal}`, `toast-${vertical}`, className)} {...rest}>
      {list.map((t) => {
        const dismissible = t.dismissible ?? true;
        const tone = t.tone ?? "default";
        const body = t.content ?? (
          <div className="flex flex-col">
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm/5 opacity-90">{t.description}</div>}
          </div>
        );

        return (
          <div
            key={t.id}
            className={clsx(
              "rounded-box shadow-lg px-4! py-3! max-w-[calc(100vw-2rem)]",
              toneClasses[tone],
              itemClassName,
              t.className,
            )}
            role="status"
          >
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <div>{body}</div>

              <div className="flex items-center gap-2">
                {t.actionLabel && (
                  <button
                    type="button"
                    className="btn sm ghost bg-black/10 hover:bg-black/20"
                    onClick={t.onAction}
                  >
                    {t.actionLabel}
                  </button>
                )}
                {dismissible && (
                  <button
                    type="button"
                    aria-label="Close"
                    className="btn square ghost sm"
                    onClick={() => remove(t.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
