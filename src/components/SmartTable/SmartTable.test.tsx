/** La identidad de las filas: la garantía que no se ve y no avisa cuando falla.
 *
 * QUÉ SE PRUEBA
 * ─────────────
 * Que un panel desplegado siga perteneciendo a SU registro cuando la tabla se
 * reordena o pasa de página. Suena obvio y ha fallado dos veces seguidas en este
 * mismo componente, de dos maneras distintas:
 *
 *   1. El estado de apertura se guardaba por posición: al ordenar, la fila que
 *      aparecía abierta era otra.
 *   2. Arreglado eso, React seguía identificando las filas por posición —
 *      `key={i}`— así que el panel quedaba bajo la fila correcta CON EL ESTADO
 *      DEL REGISTRO ANTERIOR.
 *
 * POR QUÉ LA PRUEBA VIVE AQUÍ Y NO EN QUIEN USA EL KIT
 * ───────────────────────────────────────────────────
 * La segunda se probó desde MDX contando peticiones: su panel vuelve a pedir
 * datos cuando le cambian la variante, así que migrar el estado se delataba con
 * peticiones de más. Es un centinela estrecho —lo señaló codex— porque un panel
 * cuyo estado NO venga de las props no pide nada y no se cura solo: se queda con
 * lo ajeno para siempre y sin síntoma.
 *
 * Eso es exactamente lo que hay aquí: cada panel escribe en un `<input>` con
 * estado local, que es lo que ningún consumidor puede recuperar si se mezcla.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import SmartTable from "./index";

interface Fila {
  id: string;
  nombre: string;
  costo: number;
}

const DATOS: Fila[] = [
  { id: "haiku", nombre: "Haiku", costo: 4 },
  { id: "opus", nombre: "Opus", costo: 127 },
];

/** Un panel con estado PROPIO, que no se puede reconstruir desde las props. */
function PanelConBorrador({ fila }: { fila: Fila }) {
  const [borrador, setBorrador] = React.useState("");
  return (
    <input
      aria-label={`borrador de ${fila.nombre}`}
      value={borrador}
      onChange={(e) => setBorrador(e.target.value)}
    />
  );
}

function montar() {
  return render(
    <SmartTable<Fila>
      data={DATOS}
      searchable={false}
      paginated={false}
      expandable={{
        rowKey: (f) => f.id,
        content: (f) => <PanelConBorrador fila={f} />,
      }}
      columns={[
        { key: "nombre", header: "Nombre", cell: (f) => f.nombre },
        { key: "costo", header: "Costo", sortable: true, sortAccessor: (f) => f.costo },
      ]}
    />,
  );
}

/** El panel que cuelga de la fila donde aparece ese nombre. */
function panelDe(nombre: string): HTMLElement {
  const fila = screen.getByText(nombre).closest("tr");
  if (!fila) throw new Error(`no hay fila para ${nombre}`);
  const panel = fila.nextElementSibling;
  if (!panel) throw new Error(`la fila de ${nombre} no tiene panel debajo`);
  const campo = panel.querySelector("input");
  if (!campo) throw new Error(`el panel de ${nombre} no tiene campo`);
  return campo;
}

/** Los nombres en el orden en que se ven, para comprobar que ordenar ORDENA. */
function ordenVisible(): string[] {
  return Array.from(document.querySelectorAll("tbody tr"))
    .map((tr) => tr.querySelector("td:nth-child(2)")?.textContent ?? "")
    .filter((t) => t === "Haiku" || t === "Opus");
}

/** Ordena por costo hasta que las filas CAMBIEN de sitio.
 *
 *  ESTO NO ES CEREMONIA. La primera versión de estas pruebas pulsaba «Costo»
 *  una vez: el primer clic ordena ASCENDENTE y los datos ya venían así, con lo
 *  que no se movía nada. Las cuatro pruebas pasaban en verde y sobrevivían las
 *  dos mutaciones que existen para cazar — o sea que no probaban nada.
 *
 *  Ahora el reordenado es una PRECONDICIÓN comprobada: si las filas no se
 *  mueven, la prueba revienta aquí en vez de dar por buena una comprobación que
 *  nunca ocurrió. */
async function reordenar(): Promise<void> {
  const antes = ordenVisible();
  await userEvent.click(screen.getByText("Costo"));
  if (ordenVisible().join() === antes.join()) {
    await userEvent.click(screen.getByText("Costo"));
  }
  expect(ordenVisible().join()).not.toBe(antes.join());
}

function flechaDe(nombre: string): HTMLElement {
  const fila = screen.getByText(nombre).closest("tr");
  const boton = fila?.querySelector("button");
  if (!boton) throw new Error(`la fila de ${nombre} no tiene flecha`);
  return boton;
}

describe("el detalle desplegable pertenece a su fila", () => {
  it("cada panel conserva LO SUYO cuando la tabla se reordena", async () => {
    montar();

    await userEvent.click(flechaDe("Haiku"));
    await userEvent.click(flechaDe("Opus"));
    await userEvent.type(panelDe("Haiku"), "lo de Haiku");
    await userEvent.type(panelDe("Opus"), "lo de Opus");

    await reordenar();

    expect((panelDe("Haiku") as HTMLInputElement).value).toBe("lo de Haiku");
    expect((panelDe("Opus") as HTMLInputElement).value).toBe("lo de Opus");
  });

  it("y la fila que queda abierta es la que se abrió, no la que ocupa su sitio", async () => {
    montar();

    await userEvent.click(flechaDe("Haiku"));
    await reordenar();

    expect(screen.getByLabelText("borrador de Haiku")).toBeTruthy();
    expect(screen.queryByLabelText("borrador de Opus")).toBeNull();
  });

  it("sin `expandable` no hay columna de flecha", () => {
    // Una tabla sin detalle no debe enseñar un botón que no lleva a ninguna
    // parte, que es la misma regla que ya seguía el menú de acciones.
    render(
      <SmartTable<Fila>
        data={DATOS}
        searchable={false}
        paginated={false}
        columns={[{ key: "nombre", header: "Nombre", cell: (f) => f.nombre }]}
      />,
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("al cerrar un panel, lo que se había escrito dentro no reaparece", async () => {
    // El panel se DESMONTA al cerrarse. Si volviera a salir con el texto de
    // antes, sería que el kit lo está guardando por su cuenta — y entonces
    // dejaría de ser cierto que el contenido lo gobierna quien usa el kit.
    montar();

    await userEvent.click(flechaDe("Haiku"));
    await userEvent.type(panelDe("Haiku"), "algo");
    await userEvent.click(flechaDe("Haiku"));
    await userEvent.click(flechaDe("Haiku"));

    expect((panelDe("Haiku") as HTMLInputElement).value).toBe("");
  });
});
