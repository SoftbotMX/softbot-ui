import clsx from "clsx";
import * as React from "react";

export type ModalPosition = "top" | "middle" | "bottom" | "start" | "end";

/** Lo que puede recibir foco dentro de la caja. Luego `tabulables` deja solo lo que Tab alcanza. */
const ENFOCABLES = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "details > summary:first-of-type",
  "[contenteditable]:not([contenteditable=false])",
  "[tabindex]",
].join(",");

/** Si el elemento se ve y se puede usar: ni `display:none` en él o en un ancestro dentro
 * de la caja, ni `visibility:hidden`, ni dentro de un `<fieldset disabled>` o de un
 * `<details>` cerrado (salvo su `<summary>`). */
function seVe(el: HTMLElement, caja: HTMLElement): boolean {
  for (let n: HTMLElement | null = el; n && n !== caja; n = n.parentElement) {
    if (getComputedStyle(n).display === "none") return false;
  }
  if (getComputedStyle(el).visibility === "hidden") return false;
  if (el.matches("button, input, select, textarea")) {
    // Cada fieldset deshabilitado de arriba apaga lo que tiene dentro, salvo lo de su
    // primer <legend>; y basta con que uno lo apague.
    for (let f = el.closest("fieldset[disabled]"); f && caja.contains(f); ) {
      const leyenda = f.querySelector(":scope > legend");
      if (!leyenda || !leyenda.contains(el)) return false;
      f = f.parentElement?.closest("fieldset[disabled]") ?? null;
    }
  }
  const plegado = el.closest("details:not([open])");
  if (plegado && caja.contains(plegado)) {
    const resumen = el.closest("summary");
    if (!resumen || resumen.parentElement !== plegado) return false;
  }
  return true;
}

/** Lo que Tab alcanza dentro de la caja, en el orden en que lo recorre el navegador:
 * primero los `tabIndex` positivos de menor a mayor y luego los demás en orden de
 * documento; de cada grupo de radios, solo el marcado (o el primero si no hay). */
function tabulables(caja: HTMLElement): HTMLElement[] {
  const lista = Array.from(caja.querySelectorAll<HTMLElement>(ENFOCABLES)).filter(
    (el) => el.tabIndex >= 0 && !el.closest("[inert]") && seVe(el, caja),
  );
  const radios = lista.filter(
    (el): el is HTMLInputElement =>
      el instanceof HTMLInputElement && el.type === "radio" && !!el.name,
  );
  const fuera = new Set<HTMLElement>();
  for (const r of radios) {
    const grupo = radios.filter((o) => o.name === r.name && o.form === r.form);
    const elegido = grupo.find((o) => o.checked) ?? grupo[0];
    if (r !== elegido) fuera.add(r);
  }
  const quedan = lista.filter((el) => !fuera.has(el));
  const positivos = quedan.filter((el) => el.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex);
  return [...positivos, ...quedan.filter((el) => el.tabIndex === 0)];
}

/** Los diálogos abiertos, el de arriba al final. Solo el de arriba atrapa el foco y
 * atiende Escape; al cerrarse, el foco vuelve a quien lo tenía antes de abrirlo. */
interface Abierto {
  caja: HTMLElement;
  previo: HTMLElement | null;
}
const pila: Abierto[] = [];
const esCima = (a: Abierto | null) => !!a && pila[pila.length - 1] === a;
const enfocarDentro = (caja: HTMLElement) => (tabulables(caja)[0] ?? caja).focus();

/** Los últimos elementos que tuvieron el foco, el más reciente al final. De aquí sale a
 * quién devolverlo al cerrar: no se puede leer al pintar (un render que se descarta lo
 * pisaría) ni en el efecto (un `autoFocus` de dentro ya se lo quedó). */
const historial: HTMLElement[] = [];
if (typeof document !== "undefined") {
  document.addEventListener(
    "focusin",
    (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      const i = historial.indexOf(e.target);
      if (i >= 0) historial.splice(i, 1);
      historial.push(e.target);
      if (historial.length > 20) historial.shift();
    },
    true,
  );
}
const ultimoFueraDe = (caja: HTMLElement) => {
  for (let i = historial.length - 1; i >= 0; i--) {
    const el = historial[i];
    if (el.isConnected && !caja.contains(el)) return el;
  }
  return null;
};

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
  /** A dónde va el foco al abrir. Si no se da, al primer enfocable de la caja, y si no hay, a la caja. */
  initialFocus?: React.RefObject<HTMLElement | null>;
  /** Texto del botón invisible del velo, para lectores de pantalla. */
  closeLabel?: string;
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
    initialFocus,
    closeLabel = "Cerrar",
    // El nombre y la descripción son del diálogo, no del contenedor: van a la caja.
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = props;

  const tituloId = React.useId();
  const cajaRef = React.useRef<HTMLDivElement>(null);

  const isControlled = typeof open === "boolean";
  const [innerOpen, setInnerOpen] = React.useState<boolean>(!!defaultOpen);
  const effectiveOpen = isControlled ? (open as boolean) : innerOpen;

  const setOpen = (v: boolean) => {
    if (!isControlled) setInnerOpen(v);
    onOpenChange?.(v);
  };

  const abiertoRef = React.useRef<Abierto | null>(null);
  // El último focusin que React entregó a la caja. Un portal (un popover que se pinta
  // en <body>) es de la caja para React aunque no lo sea en el DOM.
  const focoPropioRef = React.useRef<Event | null>(null);

  React.useEffect(() => {
    if (!closeOnEsc || !effectiveOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && esCima(abiertoRef.current)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOnEsc, effectiveOpen]);

  // Al abrir, el foco entra y no sale; al cerrar (o desmontar abierto), vuelve.
  // Sin esto el foco se queda detrás del velo y `aria-modal` miente.
  React.useEffect(() => {
    if (!effectiveOpen) return;
    const caja = cajaRef.current;
    if (!caja) return;
    const abierto: Abierto = { caja, previo: ultimoFueraDe(caja) };
    pila.push(abierto);
    abiertoRef.current = abierto;

    const activo = document.activeElement as HTMLElement | null;
    const destino = initialFocus?.current ?? (activo && caja.contains(activo) ? activo : null);
    if (destino) destino.focus();
    else enfocarDentro(caja);

    // Lo que Tab no ve: un clic en el velo, o código que mueve el foco fuera.
    const onFocusIn = (e: FocusEvent) => {
      if (!esCima(abierto) || caja.contains(e.target as Node) || e === focoPropioRef.current)
        return;
      enfocarDentro(caja);
    };
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      abiertoRef.current = null;
      const i = pila.indexOf(abierto);
      if (i < 0) return;
      const eraCima = i === pila.length - 1;
      pila.splice(i, 1);
      if (!eraCima) {
        // Se cerró uno de abajo: el de arriba se queda con el foco, y si lo habían
        // abierto desde éste, hereda a quién devolverlo.
        const encima = pila[i];
        if (encima?.previo && caja.contains(encima.previo)) encima.previo = abierto.previo;
        return;
      }
      const nuevaCima = pila[pila.length - 1];
      if (nuevaCima && !(abierto.previo && nuevaCima.caja.contains(abierto.previo))) {
        enfocarDentro(nuevaCima.caja);
      } else if (abierto.previo?.isConnected) {
        abierto.previo.focus();
      }
    };
    // Solo al abrir y cerrar: `initialFocus` es un ref y no cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveOpen]);

  // Tab y Shift+Tab dan la vuelta dentro de la caja, en el orden real del teclado.
  const onKeyDownCaja = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || e.defaultPrevented || !esCima(abiertoRef.current)) return;
    const caja = cajaRef.current;
    if (!caja) return;
    const lista = tabulables(caja);
    const activo = document.activeElement as HTMLElement | null;
    if (lista.length === 0) {
      e.preventDefault();
      caja.focus();
      return;
    }
    const i = activo ? lista.indexOf(activo) : -1;
    if (i < 0 && activo && activo !== caja && caja.contains(activo)) {
      // Algo enfocable que Tab no recorre (tabIndex -1): se sigue desde donde está.
      // Aquí manda el orden del documento, no el de Tab con sus positivos delante.
      const enDocumento = [...lista].sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
      const despues = enDocumento.findIndex(
        (el) => !!(activo.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
      );
      const siguiente = e.shiftKey
        ? (enDocumento[(despues < 0 ? enDocumento.length : despues) - 1] ??
          enDocumento[enDocumento.length - 1])
        : (enDocumento[despues] ?? enDocumento[0]);
      e.preventDefault();
      siguiente.focus();
      return;
    }
    const siguiente = e.shiftKey
      ? i <= 0
        ? lista[lista.length - 1]
        : lista[i - 1]
      : i < 0 || i === lista.length - 1
        ? lista[0]
        : lista[i + 1];
    e.preventDefault();
    siguiente.focus();
  };

  const nombradoPor = ariaLabelledBy ?? (ariaLabel || !title ? undefined : tituloId);

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
        ref={cajaRef}
        className={clsx("modal-box", boxClassName)}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={nombradoPor}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        onKeyDown={onKeyDownCaja}
        onFocus={(e) => {
          focoPropioRef.current = e.nativeEvent;
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <h3 id={tituloId} className="font-semibold text-lg leading-6 mb-3">
            {title}
          </h3>
        ) : null}

        {children}

        {actions ? <div className="modal-action">{actions}</div> : null}
      </div>

      <div className="modal-backdrop col-start-1 row-start-1">
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => closeOnBackdrop && setOpen(false)}
        ></button>
      </div>
    </div>
  );
};

export default Modal;
