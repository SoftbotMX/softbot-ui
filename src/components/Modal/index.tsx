import clsx from "clsx";
import * as React from "react";

export type ModalPosition = "top" | "middle" | "bottom" | "start" | "end";

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: ModalPosition;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  boxClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const Modal = (props: ModalProps) => {
  const {
    open,
    defaultOpen,
    onOpenChange,
    position = "middle",
    closeOnBackdrop = true,
    closeOnEsc = true,
    className,
    boxClassName,
    title,
    actions,
    children,
    ...rest
  } = props;

  const isControlled = typeof open === "boolean";
  const [innerOpen, setInnerOpen] = React.useState<boolean>(!!defaultOpen);
  const effectiveOpen = isControlled ? (open as boolean) : innerOpen;

  const setOpen = (v: boolean) => {
    if (!isControlled) setInnerOpen(v);
    onOpenChange?.(v);
  };

  React.useEffect(() => {
    if (!closeOnEsc || !effectiveOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOnEsc, effectiveOpen]);

  const positionCls =
    position === "top"
      ? "modal-top"
      : position === "bottom"
        ? "modal-bottom"
        : position === "start"
          ? "modal-start"
          : position === "end"
            ? "modal-end"
            : "modal-middle";

  return (
    <div
      className={clsx("modal", positionCls, effectiveOpen && "modal-open", className)}
      aria-hidden={!effectiveOpen}
      {...rest}
    >
      <div
        className={clsx("modal-box", boxClassName)}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? <h3 className="font-semibold text-lg leading-6 mb-3">{title}</h3> : null}

        {children}

        {actions ? <div className="modal-action">{actions}</div> : null}
      </div>

      <div className="modal-backdrop col-start-1 row-start-1">
        <button
          type="button"
          aria-label="Close modal"
          onClick={() => closeOnBackdrop && setOpen(false)}
        ></button>
      </div>
    </div>
  );
};

export default Modal;
