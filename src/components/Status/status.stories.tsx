import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Status, { type StatusTone, type StatusSize } from "./index";

const meta: Meta<typeof Status> = {
  title: "Feedback/Status",
  component: Status,
  args: {
    tone: "success",
    size: "md",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral","primary","secondary","accent","info","success","warning","error"] satisfies StatusTone[],
    },
    size: {
      control: "select",
      options: ["xs","sm","md","lg","xl"] satisfies StatusSize[],
    },
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Status>;

export const Basic: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Status {...args} aria-label={`status-${args.tone ?? "neutral"}`} />
      <span>Server running</span>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Status size="xs" tone="success" />
        <span className="text-sm">xs</span>
      </div>
      <div className="flex items-center gap-2">
        <Status size="sm" tone="success" />
        <span className="text-sm">sm</span>
      </div>
      <div className="flex items-center gap-2">
        <Status size="md" tone="success" />
        <span className="text-sm">md</span>
      </div>
      <div className="flex items-center gap-2">
        <Status size="lg" tone="success" />
        <span className="text-sm">lg</span>
      </div>
      <div className="flex items-center gap-2">
        <Status size="xl" tone="success" />
        <span className="text-sm">xl</span>
      </div>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {(
        ["neutral","primary","secondary","accent","info","success","warning","error"] as StatusTone[]
      ).map((t) => (
        <div key={t} className="flex items-center gap-2">
          <Status tone={t} />
          <span className="capitalize">{t}</span>
        </div>
      ))}
    </div>
  ),
};
