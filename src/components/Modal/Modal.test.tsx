/** El foco y el nombre del diálogo: lo que no se ve con el ratón.
 *
 * QUÉ SE PRUEBA
 * ─────────────
 * `Modal` declaraba `role="dialog"` y `aria-modal="true"`, pero el foco se
 * quedaba en el botón que lo abrió, detrás del velo, y con Tab se seguía
 * operando la pantalla de fondo. `aria-modal` le dice al lector de pantalla que
 * el fondo no existe mientras el teclado sigue llegando ahí. Al cerrar, el foco
 * no volvía a quien lo abrió, y el diálogo no tenía nombre: se anunciaba
 * «diálogo» sin decir cuál (issue #9, visto en MDX por la revisión de codex).
 *
 * Con el ratón todo funciona igual con y sin esto. Por eso vive aquí.
 *
 * Las pruebas entran por el barril, que es por donde entran los consumidores.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { createPortal } from "react-dom";
import { describe, expect, it } from "vitest";

import { Modal } from "../index";
import type { ModalProps } from "../index";

/** Un disparador fuera del diálogo y otro botón de fondo, para ver a dónde va Tab. */
function Pantalla(props: Partial<ModalProps> & { cuerpo?: React.ReactNode }) {
  const { cuerpo, ...resto } = props;
  const [abierto, setAbierto] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setAbierto(true)}>
        Abrir
      </button>
      <button type="button">Fondo</button>
      <Modal
        title="Redes de la cabecera"
        open={abierto}
        onOpenChange={setAbierto}
        actions={
          <>
            <button type="button" onClick={() => setAbierto(false)}>
              Cancelar
            </button>
            <button type="button">Guardar</button>
          </>
        }
        {...resto}
      >
        {cuerpo ?? <input aria-label="Copy" />}
      </Modal>
    </>
  );
}

describe("Modal: foco", () => {
  it("al abrir, el foco entra al primer elemento enfocable de la caja", async () => {
    const user = userEvent.setup();
    render(<Pantalla />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Copy" }));
  });

  it("initialFocus elige a dónde va el foco", async () => {
    const user = userEvent.setup();
    function ConFoco() {
      const ref = React.useRef<HTMLButtonElement>(null);
      const [abierto, setAbierto] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setAbierto(true)}>
            Abrir
          </button>
          <Modal title="Confirmar" open={abierto} onOpenChange={setAbierto} initialFocus={ref}>
            <input aria-label="Copy" />
            <button type="button" ref={ref}>
              Reescribir
            </button>
          </Modal>
        </>
      );
    }
    render(<ConFoco />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Reescribir" }));
  });

  it("sin nada enfocable, el foco va a la caja", async () => {
    const user = userEvent.setup();
    render(<Pantalla cuerpo={<p>Solo texto</p>} actions={null} />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(document.activeElement).toBe(screen.getByRole("dialog"));
  });

  it("Tab y Shift+Tab dan la vuelta dentro de la caja y nunca llegan al fondo", async () => {
    const user = userEvent.setup();
    render(<Pantalla />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    const dialogo = screen.getByRole("dialog");

    // copy → cancelar → guardar → (vuelta) copy
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancelar" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Guardar" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Copy" }));

    // y hacia atrás desde el primero salta al último
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Guardar" }));

    for (let i = 0; i < 7; i++) {
      await user.tab();
      expect(dialogo.contains(document.activeElement)).toBe(true);
    }
  });

  it("al cerrar, el foco vuelve a quien abrió el diálogo", async () => {
    const user = userEvent.setup();
    render(<Pantalla />);
    const abrir = screen.getByRole("button", { name: "Abrir" });
    await user.click(abrir);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(document.activeElement).toBe(abrir);
  });

  it("también al cerrar con Escape", async () => {
    const user = userEvent.setup();
    render(<Pantalla />);
    const abrir = screen.getByRole("button", { name: "Abrir" });
    await user.click(abrir);
    await user.keyboard("{Escape}");
    expect(document.activeElement).toBe(abrir);
  });

  it("cerrado no toca el foco de nadie", async () => {
    const user = userEvent.setup();
    render(<Pantalla />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Fondo" }));
  });
});

describe("Modal: nombre accesible", () => {
  it("el título le da nombre al diálogo", async () => {
    const user = userEvent.setup();
    render(<Pantalla />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    screen.getByRole("dialog", { name: "Redes de la cabecera" });
  });

  it("aria-label, aria-labelledby y aria-describedby van a la caja, no al contenedor", async () => {
    const user = userEvent.setup();
    render(
      <>
        <p id="ayuda">Se publica en todas las redes</p>
        <Pantalla title={undefined} aria-label="Publicar" aria-describedby="ayuda" />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    const dialogo = screen.getByRole("dialog", { name: "Publicar" });
    expect(dialogo.getAttribute("aria-describedby")).toBe("ayuda");
    expect(dialogo.parentElement?.hasAttribute("aria-label")).toBe(false);
    expect(dialogo.parentElement?.hasAttribute("aria-describedby")).toBe(false);
  });

  it("un aria-labelledby explícito manda sobre el título", async () => {
    const user = userEvent.setup();
    render(
      <>
        <span id="otro">Nombre externo</span>
        <Pantalla aria-labelledby="otro" />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    screen.getByRole("dialog", { name: "Nombre externo" });
  });

  it("el botón del velo dice «Cerrar» y se puede cambiar con closeLabel", () => {
    const { rerender } = render(<Modal open title="A" />);
    screen.getByRole("button", { name: "Cerrar", hidden: true });
    rerender(<Modal open title="A" closeLabel="Close" />);
    screen.getByRole("button", { name: "Close", hidden: true });
  });
});

/* ─── Lo que encontró codex en la primera versión ─────────────────────────────
 * Cada caso de abajo dejaba salir el foco o lo devolvía a donde no era, y los
 * once de arriba seguían en verde. */

function Abierto(props: Partial<ModalProps> & { cuerpo: React.ReactNode }) {
  const { cuerpo, ...resto } = props;
  const [abierto, setAbierto] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setAbierto(true)}>
        Abrir
      </button>
      <button type="button">Fondo</button>
      <Modal title="Caja" open={abierto} onOpenChange={setAbierto} {...resto}>
        {cuerpo}
      </Modal>
    </>
  );
}

describe("Modal: el orden real del teclado", () => {
  it("lo que no se ve no cuenta como extremo de la trampa", async () => {
    const user = userEvent.setup();
    render(
      <Abierto
        cuerpo={
          <>
            <button type="button" style={{ visibility: "hidden" }}>
              Invisible
            </button>
            <button type="button">Uno</button>
            <button type="button">Dos</button>
            <details>
              <summary>Más</summary>
              <button type="button">Plegado</button>
            </details>
            <button type="button" style={{ display: "none" }}>
              Oculto
            </button>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Uno" }));
    // El último que Tab alcanza es el <summary>: lo plegado y lo oculto no cuentan.
    const resumen = screen.getByText("Más");
    resumen.focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Uno" }));
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(resumen);
  });

  it("de un grupo de radios solo cuenta el marcado", async () => {
    const user = userEvent.setup();
    render(
      <Abierto
        cuerpo={
          <>
            <input type="radio" name="red" aria-label="Facebook" />
            <input type="radio" name="red" aria-label="X" defaultChecked />
            <button type="button">Último</button>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "X" }));
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Último" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "X" }));
  });

  it("un tabIndex positivo va antes, como en el navegador", async () => {
    const user = userEvent.setup();
    render(
      <Abierto
        cuerpo={
          <>
            <button type="button" tabIndex={2}>
              Segundo
            </button>
            <button type="button" tabIndex={1}>
              Primero
            </button>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Primero" }));
    screen.getByRole("button", { name: "Segundo" }).focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Primero" }));
  });
});

describe("Modal: el foco no se escapa por otro lado", () => {
  it("clic en el velo que no cierra: el foco vuelve a la caja", async () => {
    const user = userEvent.setup();
    render(<Abierto closeOnBackdrop={false} cuerpo={<button type="button">Dentro</button>} />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(screen.getByRole("button", { name: "Cerrar", hidden: true }));
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    await user.tab();
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
  });

  it("si otro código lo mueve fuera, vuelve a la caja", async () => {
    const user = userEvent.setup();
    render(<Abierto cuerpo={<button type="button">Dentro</button>} />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    screen.getByRole("button", { name: "Fondo" }).focus();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Dentro" }));
  });

  it("autoFocus dentro de un Modal que se monta abierto no le roba el regreso al disparador", async () => {
    const user = userEvent.setup();
    function Montado() {
      const [abierto, setAbierto] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setAbierto(true)}>
            Abrir
          </button>
          {abierto ? (
            <Modal title="Confirmar" open onOpenChange={setAbierto}>
              <input aria-label="Copy" autoFocus />
              <button type="button" onClick={() => setAbierto(false)}>
                Cancelar
              </button>
            </Modal>
          ) : null}
        </>
      );
    }
    render(<Montado />);
    const abrir = screen.getByRole("button", { name: "Abrir" });
    await user.click(abrir);
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Copy" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(document.activeElement).toBe(abrir);
  });
});

describe("Modal: uno encima de otro", () => {
  function Apilados() {
    const [abajo, setAbajo] = React.useState(false);
    const [arriba, setArriba] = React.useState(false);
    return (
      <>
        <button type="button" onClick={() => setAbajo(true)}>
          Abrir
        </button>
        <button type="button" onClick={() => setAbajo(false)} data-testid="cerrar-abajo">
          Cerrar el de abajo desde fuera
        </button>
        <Modal title="Abajo" open={abajo} onOpenChange={setAbajo}>
          <button type="button" onClick={() => setArriba(true)}>
            Abrir otro
          </button>
        </Modal>
        <Modal title="Arriba" open={arriba} onOpenChange={setArriba}>
          <button type="button" onClick={() => setArriba(false)}>
            Listo
          </button>
        </Modal>
      </>
    );
  }

  it("Escape cierra solo el de arriba", async () => {
    const user = userEvent.setup();
    render(<Apilados />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(screen.getByRole("button", { name: "Abrir otro" }));
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { name: "Abajo" })).toBeTruthy();
    expect(screen.queryByRole("dialog", { name: "Arriba" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir otro" }));
  });

  it("cerrar el de abajo no le quita el foco al de arriba, y al cerrar éste vuelve al disparador", async () => {
    const user = userEvent.setup();
    render(<Apilados />);
    const abrir = screen.getByRole("button", { name: "Abrir" });
    await user.click(abrir);
    await user.click(screen.getByRole("button", { name: "Abrir otro" }));
    const listo = screen.getByRole("button", { name: "Listo" });
    // Lo cierra un efecto de la app, no el usuario: el foco sigue en el de arriba.
    React.act(() => screen.getByTestId("cerrar-abajo").click());
    expect(document.activeElement).toBe(listo);
    await user.click(listo);
    expect(document.activeElement).toBe(abrir);
  });
});

/* ─── Segunda ronda de codex ─────────────────────────────────────────────── */

describe("Modal: segunda ronda", () => {
  it("lo que está dentro de un fieldset deshabilitado no cuenta", async () => {
    const user = userEvent.setup();
    render(
      <Abierto
        cuerpo={
          <>
            <button type="button">Antes</button>
            <fieldset disabled>
              <legend>Bloqueado</legend>
              <button type="button">Apagado</button>
            </fieldset>
            <button type="button">Después</button>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    const antes = screen.getByRole("button", { name: "Antes" });
    expect(document.activeElement).toBe(antes);
    // Si el apagado contara, Tab intentaría enfocarlo, fallaría y el foco se quedaría aquí.
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Después" }));
  });

  it("desde un elemento con tabIndex -1, Tab sigue al de después y Shift+Tab al de antes", async () => {
    const user = userEvent.setup();
    render(
      <Abierto
        cuerpo={
          <>
            <button type="button">Uno</button>
            <div tabIndex={-1} data-testid="zona">
              Zona
            </div>
            <button type="button">Dos</button>
            <button type="button">Tres</button>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    screen.getByTestId("zona").focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Dos" }));
    screen.getByTestId("zona").focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Uno" }));
  });

  it("un popover en portal que pertenece al diálogo puede quedarse con el foco", async () => {
    const user = userEvent.setup();
    render(
      <Abierto
        cuerpo={
          <>
            <button type="button">Dentro</button>
            {createPortal(<input aria-label="Buscar" />, document.body)}
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    const buscar = screen.getByRole("textbox", { name: "Buscar" });
    buscar.focus();
    expect(document.activeElement).toBe(buscar);
    // y lo que no es del diálogo sigue sin poder
    screen.getByRole("button", { name: "Fondo" }).focus();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Dentro" }));
  });

  it("un fieldset deshabilitado por fuera apaga también la leyenda de uno de dentro", async () => {
    const user = userEvent.setup();
    render(
      <Abierto
        cuerpo={
          <>
            <button type="button">Antes</button>
            <fieldset disabled>
              <fieldset disabled>
                <legend>
                  <button type="button">En la leyenda</button>
                </legend>
              </fieldset>
            </fieldset>
            <button type="button">Después</button>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Después" }));
  });

  it("desde un tabIndex -1, el vecino es el del documento aunque haya tabIndex positivos", async () => {
    const user = userEvent.setup();
    render(
      <Abierto
        cuerpo={
          <>
            <button type="button">Antes</button>
            <div tabIndex={-1} data-testid="zona">
              Zona
            </div>
            <button type="button">Después</button>
            <button type="button" tabIndex={1}>
              Positivo
            </button>
          </>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    screen.getByTestId("zona").focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Después" }));
    screen.getByTestId("zona").focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Antes" }));
  });
});
