import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Loading, { type LoadingProps } from "./index";

const meta: Meta<LoadingProps> = {
  title: "Core/Loading",
  component: Loading,
  args: {
    variant: "spinner",
    size: "md",
    srOnlyLabel: true,
    label: "Loading…",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["spinner", "dots", "ring", "ball", "bars", "infinity"],
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    srOnlyLabel: { control: "boolean" },
    label: { control: "text" },
  },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<LoadingProps>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <Loading {...args} variant="spinner" />
      <Loading {...args} variant="dots" />
      <Loading {...args} variant="ring" />
      <Loading {...args} variant="ball" />
      <Loading {...args} variant="bars" />
      <Loading {...args} variant="infinity" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <Loading {...args} size="xs" />
      <Loading {...args} size="sm" />
      <Loading {...args} size="md" />
      <Loading {...args} size="lg" />
      <Loading {...args} size="xl" />
    </div>
  ),
};

export const WithLabelVisible: Story = {
  args: { srOnlyLabel: false, label: "Cargando datos…" },
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <Loading {...args} className="text-base-content/70" />
      <Loading {...args} className="text-primary" />
      <Loading {...args} className="text-secondary" />
      <Loading {...args} className="text-accent" />
      <Loading {...args} className="text-info" />
      <Loading {...args} className="text-success" />
      <Loading {...args} className="text-warning" />
      <Loading {...args} className="text-error" />
    </div>
  ),
};
