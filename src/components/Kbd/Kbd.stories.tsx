import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Kbd, { type KbdProps } from "./index";

type Story = StoryObj<KbdProps>;

const meta: Meta<KbdProps> = {
  title: "Core/Kbd",
  component: Kbd,
  parameters: { layout: "padded" },
  args: {
    size: "md",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    keyLabel: { control: "text" },
    separator: { control: "text" },
  },
};
export default meta;

export const Single: Story = {
  args: {
    keyLabel: "Esc",
  },
};

export const Combo: Story = {
  args: {
    keys: ["Ctrl", "K"],
  },
};

export const WithSymbolAndSlash: Story = {
  args: {
    keys: ["⌘", "Shift", "P"],
    separator: "/",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd size="xs" keyLabel="A" />
      <Kbd size="sm" keyLabel="A" />
      <Kbd size="md" keyLabel="A" />
      <Kbd size="lg" keyLabel="A" />
      <Kbd size="xl" keyLabel="A" />
    </div>
  ),
};

export const Arrows: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd keyLabel="←" />
      <Kbd keyLabel="→" />
      <Kbd keyLabel="↑" />
      <Kbd keyLabel="↓" />
    </div>
  ),
};

export const CommonShortcuts: Story = {
  render: () => (
    <div className="grid gap-3">
      <Kbd keys={["⌘", "S"]} />
      <Kbd keys={["Ctrl", "C"]} />
      <Kbd keys={["Ctrl", "V"]} />
      <Kbd keys={["Ctrl", "Shift", "N"]} />
    </div>
  ),
};

export const InlineText: Story = {
  render: () => (
    <p className="text-sm leading-6">
      Press <Kbd keyLabel="Esc" /> to close, or open search with <Kbd keys={["Ctrl", "K"]} />.
    </p>
  ),
};
