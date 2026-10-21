/** Un `Dropdown` controlado que se comporta como un panel: se cierra al hacer
 *  clic fuera y con Escape desde cualquier parte, y devuelve el foco al botón
 *  que lo abrió.
 *
 * EL `Dropdown` DEL KIT NO LO HACE SOLO. Controlado con `open`, un clic en el
 * documento dejaba el panel abierto; y al cerrarlo con Escape desde su campo,
 * el foco caía en `body` y quien navega con teclado perdía el sitio (codex).
 * Va aparte para no cambiar el comportamiento del `Dropdown` en quien ya lo usa.
 */
import * as React from "react";

export function usePanel(desactivado = false) {
  const [abierto, setAbiertoCrudo] = React.useState(false);
  const raiz = React.useRef<HTMLDivElement>(null);

  const cerrar = React.useCallback((devolverFoco: boolean) => {
    setAbiertoCrudo(false);
    if (devolverFoco) {
      // El `Button` del kit no pasa su `ref`: se busca dentro del disparador.
      queueMicrotask(() => raiz.current?.querySelector<HTMLElement>("button")?.focus());
    }
  }, []);

  // APAGADO SE CIERRA DE VERDAD: ocultarlo sin más lo hacía reaparecer, con
  // el foco, al volver a encenderlo (codex).
  React.useEffect(() => {
    if (desactivado) setAbiertoCrudo(false);
  }, [desactivado]);

  React.useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) cerrar(false);
    };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto, cerrar]);

  return {
    /** Va en el `className` del `Dropdown` (ver `styles.css`). */
    clase: "panel-controlado",
    abierto: abierto && !desactivado,
    raiz,
    setAbierto: (v: boolean) => setAbiertoCrudo(v && !desactivado),
    cerrar,
    /** Para el `onKeyDown` del panel entero, no sólo de su campo. */
    alTeclear: (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        cerrar(true);
      }
    },
  };
}
