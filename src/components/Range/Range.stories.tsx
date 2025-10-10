import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Range from "./index";

const meta: Meta<typeof Range> = {
  title: "Core/Range",
  component: Range,
  args: {
    min: 0,
    max: 100,
    step: 1,
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Range>;

export const Basic: Story = {
  args: { defaultValue: 40 },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Range defaultValue={20} tone="neutral" />
      <Range defaultValue={35} tone="primary" />
      <Range defaultValue={50} tone="secondary" />
      <Range defaultValue={65} tone="accent" />
      <Range defaultValue={50} tone="info" />
      <Range defaultValue={70} tone="success" />
      <Range defaultValue={80} tone="warning" />
      <Range defaultValue={90} tone="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Range defaultValue={40} size="xs" />
      <Range defaultValue={40} size="sm" />
      <Range defaultValue={40} size="md" />
      <Range defaultValue={40} size="lg" />
      <Range defaultValue={40} size="xl" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = React.useState(25);
    return (
      <div className="flex w-96 flex-col gap-3">
        <Range value={val} onChange={(e) => setVal(Number(e.target.value))} tone="primary" />
        <div className="text-sm opacity-70">Valor: {val}</div>
        <div className="flex gap-2">
          <button className="btn btn-sm" onClick={() => setVal((v) => Math.max(0, v - 10))}>
            -10
          </button>
          <button className="btn btn-sm" onClick={() => setVal((v) => Math.min(100, v + 10))}>
            +10
          </button>
        </div>
      </div>
    );
  },
};

export const StepsAndBounds: Story = {
  render: () => (
    <div className="w-full max-w-xs">
      <Range min={0} max={100} defaultValue={25} step={25} />
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80 opacity-70">
      <Range defaultValue={30} disabled />
      <Range defaultValue={70} tone="primary" disabled />
    </div>
  ),
};
