import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import RadialProgress from "./index";

const meta: Meta<typeof RadialProgress> = {
  title: "Core/RadialProgress",
  component: RadialProgress,
  args: { value: 65 },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof RadialProgress>;

export const Basic: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <RadialProgress value={30} tone="neutral" />
      <RadialProgress value={45} tone="primary" />
      <RadialProgress value={60} tone="secondary" />
      <RadialProgress value={72} tone="accent" />
      <RadialProgress value={80} tone="info" />
      <RadialProgress value={88} tone="success" />
      <RadialProgress value={92} tone="warning" />
      <RadialProgress value={96} tone="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <RadialProgress value={50} size={48} />
      <RadialProgress value={50} size={80} />
      <RadialProgress value={50} size="7rem" />
      <RadialProgress value={50} size="10rem" />
    </div>
  ),
};

export const CustomThickness: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <RadialProgress value={65} size={96} thickness={6} tone="primary" />
      <RadialProgress value={65} size={96} thickness="1rem" tone="success" />
      <RadialProgress value={65} size={96} thickness="14px" tone="warning" />
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <RadialProgress value={73} tone="info" size={120}>
      <div className="text-center leading-tight">
        <div className="text-xs opacity-60">Progress</div>
        <div className="text-base font-semibold">73%</div>
      </div>
    </RadialProgress>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = React.useState(40);
    return (
      <div className="flex flex-col items-center gap-4 w-80">
        <RadialProgress value={v} tone="primary" size={120} />
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm opacity-70">{v}%</div>
      </div>
    );
  },
};
