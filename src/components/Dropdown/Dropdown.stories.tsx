import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Dropdown from "./index";

type Props = React.ComponentProps<typeof Dropdown>;
type Story = StoryObj<Props>;

const meta: Meta<Props> = {
  title: "Core/Dropdown",
  component: Dropdown,
  parameters: { layout: "padded" },
  args: {
    placement: "start",
    side: "bottom",
    hover: false,
    popover: false,
    contentClassName: "p-3",
    trigger: (
      <button className="btn btn-sm rounded-field border border-base-200 bg-base-100">Open</button>
    ),
    content: (
      <ul className="dropdown-content menu menu-sm">
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
        <li>
          <a>Item 3</a>
        </li>
      </ul>
    ),
  },
  argTypes: {
    placement: { control: "inline-radio", options: ["start", "center", "end"] },
    side: { control: "inline-radio", options: ["bottom", "top", "left", "right"] },
    hover: { control: "boolean" },
    popover: { control: "boolean" },
    open: { control: "boolean" },
  },
};
export default meta;

export const Default: Story = {};

export const Hover: Story = {
  args: { hover: true, trigger: <button className="btn btn-sm">Hover me</button> },
};

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
function ControlledDemo(props: Props) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="grid gap-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={open}
          onChange={(e) => setOpen(e.target.checked)}
        />
        Force open
      </label>
      <Dropdown
        {...props}
        open={open}
        onOpenChange={setOpen}
        trigger={<button className="btn btn-sm">Toggle</button>}
      />
      <p className="text-xs opacity-70">open: {String(open)}</p>
    </div>
  );
}

export const PlacementsGrid: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-8">
      <Dropdown
        {...args}
        placement="start"
        side="bottom"
        trigger={<button className="btn btn-xs">bottom-start</button>}
        content={<div className="dropdown-content p-2">bottom-start</div>}
      />
      <Dropdown
        {...args}
        placement="center"
        side="bottom"
        trigger={<button className="btn btn-xs">bottom-center</button>}
        content={<div className="dropdown-content p-2">bottom-center</div>}
      />
      <Dropdown
        {...args}
        placement="end"
        side="bottom"
        trigger={<button className="btn btn-xs">bottom-end</button>}
        content={<div className="dropdown-content p-2">bottom-end</div>}
      />

      <Dropdown
        {...args}
        placement="start"
        side="top"
        trigger={<button className="btn btn-xs">top-start</button>}
        content={<div className="dropdown-content p-2">top-start</div>}
      />
      <Dropdown
        {...args}
        placement="center"
        side="top"
        trigger={<button className="btn btn-xs">top-center</button>}
        content={<div className="dropdown-content p-2">top-center</div>}
      />
      <Dropdown
        {...args}
        placement="end"
        side="top"
        trigger={<button className="btn btn-xs">top-end</button>}
        content={<div className="dropdown-content p-2">top-end</div>}
      />

      <Dropdown
        {...args}
        placement="start"
        side="left"
        trigger={<button className="btn btn-xs">left-start</button>}
        content={<div className="dropdown-content p-2">left-start</div>}
      />
      <Dropdown
        {...args}
        placement="center"
        side="right"
        trigger={<button className="btn btn-xs">right-center</button>}
        content={<div className="dropdown-content p-2">right-center</div>}
      />
      <Dropdown
        {...args}
        placement="end"
        side="left"
        trigger={<button className="btn btn-xs">left-end</button>}
        content={<div className="dropdown-content p-2">left-end</div>}
      />
    </div>
  ),
};

export const WithCard: Story = {
  args: {
    content: (
      <div className="dropdown-content w-72 rounded-box border border-base-200 bg-base-100 shadow">
        <figure className="h-24 w-full overflow-hidden rounded-t-box bg-base-200" />
        <div className="p-3">
          <h3 className="mb-1 font-semibold">Card title</h3>
          <p className="mb-3 text-sm opacity-80">Some helpful description inside the dropdown.</p>
          <div className="flex justify-end gap-2">
            <button className="btn btn-xs btn-ghost">Cancel</button>
            <button className="btn btn-xs btn-primary">Confirm</button>
          </div>
        </div>
      </div>
    ),
  },
};

export const PopoverAttribute: Story = {
  render: (args) => <PopoverDemo {...args} />,
};
function PopoverDemo(props: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid gap-3">
      <button className="btn btn-sm" onClick={() => setOpen((v) => !v)}>
        {open ? "Close" : "Open"} popover
      </button>
      <Dropdown
        {...props}
        popover
        open={open}
        onOpenChange={setOpen}
        placement="center"
        trigger={<button className="btn btn-sm">Anchor</button>}
        content={
          <div className="dropdown-content p-2 text-sm">
            Rendered with <code>[popover]</code>
          </div>
        }
      />
    </div>
  );
}

export const InNarrowContainer: Story = {
  render: (args) => (
    <div className="w-56 border border-dashed border-base-300 p-4">
      <Dropdown
        {...args}
        placement="center"
        trigger={<button className="btn btn-sm w-full justify-center">Open</button>}
        content={
          <ul className="dropdown-content menu menu-sm">
            <li>
              <a>Item A</a>
            </li>
            <li>
              <a>Item B</a>
            </li>
            <li>
              <a>Item C</a>
            </li>
          </ul>
        }
      />
    </div>
  ),
};
