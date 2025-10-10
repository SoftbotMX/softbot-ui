import type { Meta, StoryObj } from "@storybook/react";

import Button, { type ButtonProps } from "./index";

const meta: Meta<ButtonProps> = {
  title: "Core/Button",
  component: Button,
  args: { children: "Guardar" },
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
};
export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button>Neutral</Button>
      <Button tone="primary">Primary</Button>
      <Button tone="secondary">Secondary</Button>
      <Button tone="accent">Accent</Button>
      <Button tone="info">Info</Button>
      <Button tone="success">Success</Button>
      <Button tone="warning">Warning</Button>
      <Button tone="error">Error</Button>
    </div>
  ),
};
export const Looks: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button look="solid">Solid</Button>
      <Button look="ghost">Ghost</Button>
      <Button look="link">Link</Button>
      <Button look="outline">Outline</Button>
      <Button look="dash">Dash</Button>
      <Button look="soft">Soft</Button>
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
    </div>
  ),
};
