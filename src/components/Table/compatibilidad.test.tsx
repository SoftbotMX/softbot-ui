/** Que las llamadas de siempre sigan funcionando. Cuatro repos dependen de ello.
 *
 * POR QUÉ ESTE ARCHIVO
 * ────────────────────
 * `expandable` es opcional y `TableProps` pasó a ser una unión. Las dos cosas
 * son invisibles hasta que alguien actualiza el kit en Conduit, en EncuestaApp o
 * en tpv-landing y le deja de compilar algo que llevaba un año escrito.
 *
 * Se comprobaron sus llamadas reales una por una el 2026-08-22 y ninguna se
 * rompía. Esto es lo que impide que la siguiente vuelta lo rompa en silencio: si
 * una de estas formas deja de compilar o de renderizar, revienta AQUÍ y no en el
 * repo de otro.
 *
 * LAS FORMAS SON LAS DE VERDAD, copiadas de sus llamadas, no inventadas.
 *
 * Y OJO CON QUIÉN USA QUÉ, que no es lo que parece: `certibot_front`,
 * `confer_front` y `kiosk_front` NO usan el `SmartTable` del kit — tienen el
 * suyo bifurcado en `src/shared/ui/SmartTable/`— pero los tres importan el
 * `Table` del kit y lo llaman con la misma línea exacta. O sea que la superficie
 * que hay que no romper para ellos es `Table`, no `SmartTable`.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SmartTable from "../SmartTable";
import Table, { type Column, type TableBaseProps, type TableProps } from "./index";

interface Client {
  id: number;
  name: string;
  status: string;
}

const clients: Client[] = [
  { id: 1, name: "Expreso", status: "ok" },
  { id: 2, name: "La Razón", status: "malo" },
];

describe("las llamadas que ya existen ahí fuera", () => {
  it("SmartTable sin nada más que columnas y datos, como en Conduit", () => {
    render(<SmartTable columns={[{ key: "name", header: "Negocio" }]} data={clients} />);
    expect(screen.getByText("Expreso")).toBeTruthy();
  });

  it("SmartTable con todo lo que ya se le pasaba, y SIN columna de flecha", () => {
    render(
      <SmartTable<Client>
        data={clients}
        columns={[
          { key: "status_dot", header: "", width: 36, cell: (r) => <span>{r.status}</span> },
          { key: "name", header: "Negocio", sortable: true, cell: (r) => <span>{r.name}</span> },
        ]}
        searchable
        paginated={false}
        initialSortKey="name"
        initialSortDir="desc"
        size="sm"
        pinCols
        className="mt-4"
      />,
    );
    // Una tabla sin detalle no enseña un botón que no lleva a ninguna parte, y
    // con la flecha metida a la fuerza habría uno por fila.
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(document.querySelectorAll("thead th")).toHaveLength(2);
  });

  it("Table a pelo, con sus props de siempre y sin desplegable", () => {
    render(
      <Table<Client>
        columns={[{ key: "name" }]}
        data={clients}
        zebra
        rowHover
        pinRows="header"
        size="lg"
        caption="Clientes"
        rowClassName={(r) => (r.status === "malo" ? "text-error" : undefined)}
        onRowClick={(r) => void r.id}
        valueGetter={(r, k) => String((r as unknown as Record<string, unknown>)[k])}
      />,
    );
    expect(screen.getByText("Clientes")).toBeTruthy();
    expect(document.querySelectorAll("tbody tr")).toHaveLength(2);
  });

  it("la línea EXACTA con que la llaman certibot, confer y kiosk", () => {
    // Copiada de `src/shared/ui/SmartTable/index.tsx:185` de los tres, que
    // tienen el SmartTable bifurcado y envuelven este `Table`. Es la llamada
    // que más veces se hace al kit fuera de este repositorio.
    const columnas: Column<Client>[] = [{ key: "name", header: "Nombre" }];
    render(<Table<Client> pinCols={true} size="md" columns={columnas} data={clients} />);
    expect(document.querySelectorAll("tbody tr")).toHaveLength(2);
  });

  it("los tipos exportados se siguen pudiendo usar y extender", () => {
    const columnas: Column<Client>[] = [{ key: "name" }];
    const props: TableProps<Client> = { columns: columnas, data: clients };
    // `TableProps` es una unión y de una unión no se puede `extends`; para eso
    // está `TableBaseProps`, y esta línea es lo que lo mantiene cierto.
    type Envuelta = TableBaseProps<Client> & { titulo: string };
    const envuelta: Envuelta = { columns: columnas, data: clients, titulo: "Clientes" };

    render(<Table<Client> {...props} />);
    expect(envuelta.titulo).toBe("Clientes");
    expect(screen.getByText("Expreso")).toBeTruthy();
  });
});
