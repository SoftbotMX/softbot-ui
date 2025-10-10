import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Skeleton from "./index";

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  args: {
    width: "12rem",
    height: "1rem",
    shape: "box",
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Basic: Story = {};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton width="8rem" height="1rem" shape="box" />
      <Skeleton width="8rem" height="1rem" shape="field" />
      <Skeleton width={48} height={48} shape="full" />
    </div>
  ),
};

export const Lines: Story = {
  render: () => (
    <div className="w-[22rem] space-y-2">
      <Skeleton width="60%" height="1rem" />
      <Skeleton width="90%" height="1rem" />
      <Skeleton width="75%" height="1rem" />
    </div>
  ),
};

export const MediaCard: Story = {
  render: () => (
    <div className="w-[22rem] rounded-box border border-base-200 p-4 space-y-3">
      <Skeleton width="100%" height="10rem" className="rounded-box" />
      <div className="flex items-center gap-3">
        <Skeleton width={48} height={48} shape="full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height="0.9rem" />
          <Skeleton width="50%" height="0.9rem" />
        </div>
      </div>
      <Skeleton width="100%" height="0.9rem" />
      <Skeleton width="85%" height="0.9rem" />
    </div>
  ),
};

export const TableRow: Story = {
  render: () => (
    <div className="w-[48rem] grid grid-cols-5 gap-4">
      <Skeleton height="1rem" />
      <Skeleton height="1rem" />
      <Skeleton height="1rem" />
      <Skeleton height="1rem" />
      <Skeleton height="1rem" />
    </div>
  ),
};
