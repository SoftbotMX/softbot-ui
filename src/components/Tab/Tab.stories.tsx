import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Tabs, { type TabsProps } from "./index";

const meta: Meta<TabsProps> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  args: {
    size: "md",
    position: "top",
    variant: "default",
    withPanels: true,
    items: [
      { id: "t1", label: "General", content: <div className="p-4">Contenido General</div> },
      { id: "t2", label: "Detalles", content: <div className="p-4">Contenido Detalles</div> },
      {
        id: "t3",
        label: "Avanzado",
        content: <div className="p-4">Contenido Avanzado</div>,
        disabled: false,
      },
    ],
    defaultValue: "t1",
  },
};
export default meta;

type Story = StoryObj<TabsProps>;

export const Default: Story = {};

export const Border: Story = {
  args: { variant: "border" },
};

export const Lift: Story = {
  args: { variant: "lift" },
};

export const Box: Story = {
  args: { variant: "box" },
};

export const Bottom: Story = {
  args: { position: "bottom" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-6">
      <Tabs {...args} size="xs" />
      <Tabs {...args} size="sm" />
      <Tabs {...args} size="md" />
      <Tabs {...args} size="lg" />
      <Tabs {...args} size="xl" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [val, setVal] = React.useState("t2");
    return (
      <div className="space-y-4">
        <Tabs
          {...args}
          value={val}
          onChange={setVal}
          items={[
            { id: "t1", label: "Uno", content: <div className="p-4">Panel 1</div> },
            { id: "t2", label: "Dos", content: <div className="p-4">Panel 2</div> },
            { id: "t3", label: "Tres", content: <div className="p-4">Panel 3</div> },
          ]}
        />
        <div>
          Seleccionado: <b>{val}</b>
        </div>
      </div>
    );
  },
};

export const WithoutPanels: Story = {
  args: {
    withPanels: false,
    items: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C", disabled: true },
      { id: "d", label: "D" },
    ],
  },
};
