// SmartTable.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";

import SmartTable from "./index";
import type { SmartColumn } from "./types";

interface Row {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  usage: number;
}

const data: Row[] = Array.from({ length: 42 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: (["Admin", "Editor", "Viewer"] as const)[i % 3],
  usage: Math.round(Math.random() * 100),
}));

const columns: SmartColumn<Row>[] = [
  { key: "id", header: "ID", align: "right", width: 72, sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email", className: "truncate", sortable: true },
  {
    key: "role",
    header: "Role",
    sortable: true,
    cell: (r) => <span className="badge badge-ghost secondary">{r.role}</span>,
  },
  {
    key: "usage",
    header: "Usage",
    align: "right",
    sortable: true,
    sortAccessor: (r) => r.usage,
    cell: (r) => (
      <div className="min-w-24">
        <progress className="progress progress-primary w-full" value={r.usage} max={100} />
      </div>
    ),
  },
];

const meta: Meta<typeof SmartTable<Row>> = {
  title: "Data/SmartTable",
  component: SmartTable<Row>,
  args: {
    data,
    columns,
    searchable: true,
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
    initialSortKey: "id",
    initialSortDir: "asc",
    size: "md",
    pinCols: true,
  },
};
export default meta;

export const Default: StoryObj<typeof SmartTable<Row>> = {
  render: (args) => <SmartTable<Row> {...args} />,
};

/**
 * El menú de acciones solo aparece si se le pasa `actions`.
 *
 * En `Default` no está, y por eso no hay tres puntos en la cabecera: una tabla
 * sin acciones no debe mostrar un botón que no lleva a ninguna parte.
 */
export const ConAcciones: StoryObj<typeof SmartTable<Row>> = {
  render: (args) => (
    <SmartTable<Row>
      {...args}
      actions={
        <>
          <li>
            <a onClick={() => alert("Exportar CSV")}>Exportar CSV</a>
          </li>
          <li>
            <a onClick={() => alert("Imprimir")}>Imprimir</a>
          </li>
        </>
      }
    />
  ),
};

/**
 * Una lista corta y completa no necesita paginado.
 *
 * Con `paginated={false}` desaparece el pie: con seis filas, «Página 1 de 1»
 * junto a dos flechas apagadas no informa de nada y ocupa el alto de tres filas.
 */
export const SinPaginado: StoryObj<typeof SmartTable<Row>> = {
  render: (args) => <SmartTable<Row> {...args} data={data.slice(0, 6)} paginated={false} />,
};
