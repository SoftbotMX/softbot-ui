import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Input, { type InputProps } from "./index";

type Story = StoryObj<InputProps>;

const meta: Meta<InputProps> = {
  title: "Core/Input",
  component: Input,
  parameters: { layout: "padded" },
  args: {
    placeholder: "Type here…",
    size: "md",
  },
  argTypes: {
    tone: {
      control: "radio",
      options: [
        undefined,
        "neutral",
        "primary",
        "secondary",
        "accent",
        "info",
        "success",
        "warning",
        "error",
      ] as never,
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    ghost: { control: "boolean" },
    as: { control: "inline-radio", options: ["div", "label"] },
    left: { control: false },
    right: { control: false },
    containerClassName: { control: "text" },
  },
};
export default meta;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    left: "search",
    right: "clear",
    placeholder: "Search…",
  },
};

export const Tones: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} tone="neutral" placeholder="Neutral" />
      <Input {...args} tone="primary" placeholder="Primary" />
      <Input {...args} tone="secondary" placeholder="Secondary" />
      <Input {...args} tone="accent" placeholder="Accent" />
      <Input {...args} tone="info" placeholder="Info" />
      <Input {...args} tone="success" placeholder="Success" />
      <Input {...args} tone="warning" placeholder="Warning" />
      <Input {...args} tone="error" placeholder="Error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} size="xs" placeholder="XS" />
      <Input {...args} size="sm" placeholder="SM" />
      <Input {...args} size="md" placeholder="MD" />
      <Input {...args} size="lg" placeholder="LG" />
      <Input {...args} size="xl" placeholder="XL" />
    </div>
  ),
};

export const Ghost: Story = {
  args: {
    ghost: true,
    placeholder: "Ghost input",
  },
};

export const StatesAndTypes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} placeholder="Disabled" disabled />
      <Input {...args} type="number" placeholder="Amount" />
      <Input {...args} type="date" />
      <Input {...args} type="password" placeholder="••••••••" />
    </div>
  ),
};

export const AsLabel: Story = {
  args: {
    as: "label",
    left: "mail",
    placeholder: "Email",
    type: "email",
  },
};

export const CustomWidth: Story = {
  render: (args) => (
    <div className="w-80">
      <Input {...args} placeholder="Custom width (w-80)" />
    </div>
  ),
};
