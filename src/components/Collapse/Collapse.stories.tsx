import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Collapse, { type CollapseProps } from "./index";

const meta: Meta<CollapseProps> = {
  title: "Core/Collapse",
  component: Collapse,
  args: {
    title: "Click me to toggle",
    children: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
        Sed cursus ante dapibus diam.
      </p>
    ),
    indicator: "arrow",
    markup: "input",
    type: "checkbox",
  },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<CollapseProps>;

export const Default: Story = {};

export const WithPlusIndicator: Story = {
  args: {
    indicator: "plus",
  },
};

export const DetailsMarkup: Story = {
  args: {
    markup: "details",
    indicator: "arrow",
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

function ControlledDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <button className="btn btn-soft" onClick={() => setOpen(false)}>
          Close
        </button>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Open
        </button>
        <button className="btn" onClick={() => setOpen((v) => !v)}>
          Toggle
        </button>
      </div>
      <Collapse
        open={open}
        onOpenChange={setOpen}
        title={<span className="font-medium">Controlled collapse</span>}
      >
        <p>This collapse is controlled from the buttons above.</p>
      </Collapse>
    </div>
  );
}

export const RadioGroup: Story = {
  render: () => (
    <div className="grid gap-2">
      <Collapse
        title="Section A"
        markup="input"
        type="radio"
        name="group1"
        indicator="arrow"
        defaultOpen
      >
        <p>Content A</p>
      </Collapse>
      <Collapse title="Section B" markup="input" type="radio" name="group1" indicator="arrow">
        <p>Content B</p>
      </Collapse>
      <Collapse title="Section C" markup="input" type="radio" name="group1" indicator="arrow">
        <p>Content C</p>
      </Collapse>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    title: "Disabled collapse",
    children: <p>It should not toggle.</p>,
    markup: "input",
    type: "checkbox",
    indicator: "arrow",
    disabled: true,
  },
};
