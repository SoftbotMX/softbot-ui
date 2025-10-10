import type { Meta, StoryObj } from "@storybook/react";

import Table, { type TableProps, type Column } from "./index";

interface Row { id: number; name: string; email: string; role: string; usage: number }

const columns: Column<Row>[] = [
  { key: "id", header: "ID", width: 72, align: "right" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email", className: "truncate" },
  {
    key: "role",
    header: "Role",
    cell: (r) => <span className="badge badge-ghost">{r.role}</span>,
  },
  {
    key: "usage",
    header: "Usage",
    align: "right",
    cell: (r) => (
      <div className="min-w-24">
        <progress className="progress progress-primary w-full" value={r.usage} max={100} />
      </div>
    ),
    footer: "Totals",
  },
];

const data: Row[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
  usage: Math.round(Math.random() * 100),
}));

const meta: Meta<TableProps<Row>> = {
  title: "Data Display/Table",
  component: Table<Row>,
  args: {
    columns,
    data,
    zebra: false,
    rowHover: true,
    size: "md",
    caption: "Users",
  },
  render: (args) => <Table<Row> {...args} />,
};
export default meta;

type Story = StoryObj<TableProps<Row>>;

export const Basic: Story = {};

export const Zebra: Story = {
  args: { zebra: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <Table<Row> columns={columns} data={data} size="xs" caption="XS" />
      <Table<Row> columns={columns} data={data} size="sm" caption="SM" />
      <Table<Row> columns={columns} data={data} size="md" caption="MD" />
      <Table<Row> columns={columns} data={data} size="lg" caption="LG" />
      <Table<Row> columns={columns} data={data} size="xl" caption="XL" />
    </div>
  ),
};

export const PinnedHeaderFooter: Story = {
  args: { pinRows: "both", caption: "Pinned header & footer (scroll container)" },
  render: (args) => (
    <div className="h-64 overflow-auto rounded-box border border-base-300 p-2">
      <Table<Row> {...args} />
    </div>
  ),
};

export const PinColumns: Story = {
  args: { pinCols: true },
};

export const RowClick: Story = {
  args: {
    onRowClick: (row) => alert(`Clicked row: ${JSON.stringify(row, null, 2)}`),
    rowHover: true,
  },
};

export const CustomAlign: Story = {
  args: {
    columns: [
      { key: "name", header: "Name", align: "left" },
      { key: "email", header: "Email", align: "center" },
      { key: "role", header: "Role", align: "right", cell: (r) => r.role },
    ],
  },
};
