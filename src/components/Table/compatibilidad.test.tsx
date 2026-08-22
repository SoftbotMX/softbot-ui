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

// SE IMPORTA POR EL BARRIL, no por la ruta interna, y eso es la mitad del
// valor de este archivo: los consumidores escriben `from "@softbotmx/softbot-ui"`
// y lo que les llega es lo que `src/index.ts` reexporta. Importando
// `./index` la prueba seguía verde después de borrar un tipo del barril, o sea
// que no vigilaba el contrato público sino la implementación.
import { SmartTable, Table } from "../../index";
import type { Column, TableBaseProps, TableProps } from "../../index";

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
        // `initialPageSize` lo usa Conduit en varias pantallas y la versión
        // anterior de esta prueba decía cubrir «todo» y no lo incluía.
        initialPageSize={20}
        pageSizeOptions={[5, 10, 20, 50]}
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

    // Y LAS PROPS HACEN ALGO, que es lo que la versión anterior no miraba: se
    // podían ignorar todas y la prueba seguía verde.
    const tabla = document.querySelector("table");
    expect(tabla?.className).toContain("table-sm");
    expect(tabla?.className).toContain("table-pin-cols");
    // `initialSortDir="desc"` sobre `name`: La Razón antes que Expreso.
    const nombres = Array.from(document.querySelectorAll("tbody td:nth-child(2)")).map(
      (c) => c.textContent,
    );
    expect(nombres).toEqual(["La Razón", "Expreso"]);
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

describe("expandir sin identidad de fila", () => {
  it("revienta en vez de pintar mal", () => {
    // EL TIPO NO BASTA, y por eso hay guarda en ejecución. `TableProps` es una
    // unión que exige `rowKey` con detalle, pero ensanchar el objeto a
    // `TableBaseProps` —o escribir `<P extends TableBaseProps<T>>`, que es el
    // envoltorio que uno escribe sin pensar— borra la comprobación de
    // propiedades sobrantes y las props llegan igual. Lo encontró codex.
    //
    // Se reproduce el rodeo EXACTO: nada de `as any`.
    const crudo = {
      columns: [{ key: "name" }] as Column<Client>[],
      data: clients,
      expandedContent: () => <div>detalle</div>,
      isExpanded: () => true,
    };
    const ensanchado: TableBaseProps<Client> = crudo;

    expect(() => render(<Table<Client> {...ensanchado} />)).toThrow(/rowKey/);
  });

  it("y salta aunque la tabla venga vacía, que es como empieza siempre", () => {
    // Dentro del bucle de filas no serviría: mientras carga no hay filas, así
    // que el aviso no llegaría hasta que hubiera datos. Es decir, tarde.
    const crudo = {
      columns: [{ key: "name" }] as Column<Client>[],
      data: [] as Client[],
      expandedContent: () => <div>detalle</div>,
      isExpanded: () => true,
    };
    const ensanchado: TableBaseProps<Client> = crudo;

    expect(() => render(<Table<Client> {...ensanchado} />)).toThrow(/rowKey/);
  });

  it("sin detalle, no exige nada: las tablas de siempre siguen igual", () => {
    expect(() =>
      render(<Table<Client> columns={[{ key: "name" }]} data={clients} />),
    ).not.toThrow();
  });
});
