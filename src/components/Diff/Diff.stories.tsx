import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Diff from "./index";

const Panel = ({ label, bg }: { label: string; bg: string }) => (
  <div
    className="w-full h-64 flex items-center justify-center text-white text-xl font-semibold"
    style={{ background: bg }}
  >
    {label}
  </div>
);

const Before = <Panel label="Before" bg="linear-gradient(135deg,#0ea5e9,#0369a1)" />;
const After = <Panel label="After" bg="linear-gradient(135deg,#22c55e,#065f46)" />;

const meta: Meta<React.ComponentProps<typeof Diff>> = {
  title: "Core/Diff",
  component: Diff,
  parameters: { layout: "padded" },
  args: {
    before: Before,
    after: After,
    className: "max-w-3xl",
  },
};
export default meta;

type Story = StoryObj<React.ComponentProps<typeof Diff>>;

export const Default: Story = {};

export const WithImages: Story = {
  args: {
    before: (
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
        alt="Before coast"
      />
    ),
    after: (
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop&blur=80"
        alt="After coast"
      />
    ),
  },
};

export const CustomHeightAndContent: Story = {
  render: (args) => (
    <Diff
      {...args}
      before={
        <div className="w-full h-80 grid place-items-center bg-base-200">
          <code className="text-sm">JSON v1</code>
        </div>
      }
      after={
        <div className="w-full h-80 grid place-items-center bg-base-300">
          <code className="text-sm">JSON v2</code>
        </div>
      }
    />
  ),
};
