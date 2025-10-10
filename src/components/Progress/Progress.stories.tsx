import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Progress from "./index";

const meta: Meta<typeof Progress> = {
  title: "Core/Progress",
  component: Progress,
  args: {
    max: 100,
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Progress>;

export const Determinate: Story = {
  render: (args) => {
    const [val, setVal] = React.useState(40);
    return (
      <div className="flex flex-col gap-3 w-80">
        <Progress {...args} value={val} />
        <input
          type="range"
          min={0}
          max={100}
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
        />
        <div className="text-sm opacity-70">{val}%</div>
      </div>
    );
  },
};

export const Indeterminate: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Progress tone="neutral" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Progress value={20} tone="neutral" />
      <Progress value={35} tone="primary" />
      <Progress value={50} tone="secondary" />
      <Progress value={65} tone="accent" />
      <Progress value={75} tone="info" />
      <Progress value={85} tone="success" />
      <Progress value={90} tone="warning" />
      <Progress value={95} tone="error" />
    </div>
  ),
};

export const CustomThickness: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Progress value={45} tone="primary" thickness={4} />
      <Progress value={60} tone="success" thickness="0.5rem" />
      <Progress value={80} tone="warning" thickness={14} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      <div className="flex justify-between text-sm opacity-70">
        <span>Uploading…</span>
        <span>62%</span>
      </div>
      <Progress value={62} tone="info" aria-label="Uploading progress" />
    </div>
  ),
};
