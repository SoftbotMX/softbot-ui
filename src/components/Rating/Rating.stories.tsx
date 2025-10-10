import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Rating from "./index";

const meta: Meta<typeof Rating> = {
  title: "Core/Rating",
  component: Rating,
  args: {
    max: 5,
    allowHalf: false,
    showClear: false,
    itemClassName: "mask mask-star",
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Rating>;

export const Basic: Story = {
  args: {
    defaultValue: 3,
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      <Rating defaultValue={3} tone="neutral" />
      <Rating defaultValue={3} tone="primary" />
      <Rating defaultValue={3} tone="secondary" />
      <Rating defaultValue={3} tone="accent" />
      <Rating defaultValue={3} tone="info" />
      <Rating defaultValue={3} tone="success" />
      <Rating defaultValue={3} tone="warning" />
      <Rating defaultValue={3} tone="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      <Rating defaultValue={3} size="xs" />
      <Rating defaultValue={3} size="sm" />
      <Rating defaultValue={3} size="md" />
      <Rating defaultValue={3} size="lg" />
      <Rating defaultValue={3} size="xl" />
    </div>
  ),
};

export const HalfSteps: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Rating allowHalf defaultValue={3.5} />
      <Rating allowHalf defaultValue={2.5} tone="primary" />
      <Rating allowHalf defaultValue={4.5} itemClassName="mask mask-heart" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = React.useState(2.5);
    return (
      <div className="flex flex-col gap-3 items-start">
        <div className="text-sm opacity-70">Valor: {v}</div>
        <Rating
          value={v}
          onChange={(nv) => setV(nv)}
          allowHalf
          tone="warning"
          itemClassName="mask mask-star"
        />
        <div className="flex gap-2">
          <button className="btn sm" onClick={() => setV((x) => Math.max(0, x - 0.5))}>
            -0.5
          </button>
          <button className="btn sm" onClick={() => setV((x) => Math.min(5, x + 0.5))}>
            +0.5
          </button>
          <button className="btn sm" onClick={() => setV(0)}>
            Clear
          </button>
        </div>
      </div>
    );
  },
};

export const WithClear: Story = {
  args: {
    defaultValue: 4,
    showClear: true,
  },
};

export const CustomMasks: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex items-center gap-2">
        <span className="w-28 text-sm opacity-70">Star</span>
        <Rating defaultValue={4} itemClassName="mask mask-star" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-28 text-sm opacity-70">Heart</span>
        <Rating defaultValue={3} tone="error" itemClassName="mask mask-heart" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-28 text-sm opacity-70">Diamond</span>
        <Rating defaultValue={3} tone="accent" itemClassName="mask mask-diamond" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-28 text-sm opacity-70">Circle</span>
        <Rating defaultValue={2} tone="info" itemClassName="mask mask-circle" />
      </div>
    </div>
  ),
};

export const ReadOnlyDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start opacity-80">
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm opacity-70">ReadOnly</span>
        <Rating value={4} readOnly />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm opacity-70">Disabled</span>
        <Rating defaultValue={3} disabled />
      </div>
    </div>
  ),
};
