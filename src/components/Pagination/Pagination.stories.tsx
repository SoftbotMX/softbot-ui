import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Pagination from "./index";

const meta: Meta<typeof Pagination> = {
  title: "Core/Pagination",
  component: Pagination,
  args: {
    total: 10,
    defaultPage: 1,
    siblingCount: 1,
    showEdges: true,
    showPrevNext: true,
    size: "md",
  },
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Basic: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [page, setPage] = React.useState(3);
    return (
      <div className="flex flex-col items-center gap-3">
        <Pagination {...args} page={page} onPageChange={setPage} />
        <div className="text-sm opacity-70">Current page: {page}</div>
      </div>
    );
  },
  args: { total: 15, siblingCount: 1 },
};

export const WithEllipsis: Story = {
  args: { total: 30, defaultPage: 10, siblingCount: 2 },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Pagination total={9} defaultPage={4} size="xs" />
      <Pagination total={9} defaultPage={4} size="sm" />
      <Pagination total={9} defaultPage={4} size="md" />
      <Pagination total={9} defaultPage={4} size="lg" />
      <Pagination total={9} defaultPage={4} size="xl" />
    </div>
  ),
};

export const NoEdgesNoPrevNext: Story = {
  args: { total: 12, defaultPage: 6, showEdges: false, showPrevNext: false },
};

export const DisabledAll: Story = {
  args: { total: 10, defaultPage: 5, disabled: true },
};
