import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Toggle, { type ToggleProps } from "./index";

const meta: Meta<ToggleProps> = {
  title: "Components/Toggle",
  component: Toggle,
  args: {
    size: "md",
  },
};
export default meta;

type Story = StoryObj<ToggleProps>;

export const Basic: Story = {
  args: {
    defaultChecked: false,
    iconOff: "bedtime",
    iconOn: "sunny",
  },
};

export const WithIcons: Story = {
  args: {
    defaultChecked: false,
    iconOff: "bedtime",
    iconOn: "sunny",
    size: "xl",
  },
};

export const ControlledPrimary: Story = {
  render: (args) => {
    const [on, setOn] = React.useState(false);
    return (
      <div className="flex items-center gap-3">
        <Toggle {...args} checked={on} onChange={setOn} tone="primary" />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Toggle size="xs" defaultChecked />
      <Toggle size="sm" defaultChecked />
      <Toggle size="md" defaultChecked />
      <Toggle size="lg" defaultChecked />
      <Toggle size="xl" defaultChecked />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Toggle defaultChecked tone="neutral" />
      <Toggle defaultChecked tone="primary" />
      <Toggle defaultChecked tone="secondary" />
      <Toggle defaultChecked tone="accent" />
      <Toggle defaultChecked tone="info" />
      <Toggle defaultChecked tone="success" />
      <Toggle defaultChecked tone="warning" />
      <Toggle defaultChecked tone="error" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Toggle disabled defaultChecked />
      <Toggle disabled />
    </div>
  ),
};
