import type { Meta, StoryObj } from "@storybook/react";

import Badge, { type BadgeProps } from "./index";

const meta: Meta<BadgeProps> = {
  title: "Core/Badge",
  component: Badge,
  args: { children: "Badge" },
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
};
export default meta;
type Story = StoryObj<BadgeProps>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge size="xs" data-testid="badge-xs">
        XS
      </Badge>
      <Badge size="sm" data-testid="badge-sm">
        SM
      </Badge>
      <Badge size="md" data-testid="badge-md">
        MD
      </Badge>
      <Badge size="lg" data-testid="badge-lg">
        LG
      </Badge>
      <Badge size="xl" data-testid="badge-xl">
        XL
      </Badge>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge tone="primary" data-testid="badge-primary">
        Primary
      </Badge>
      <Badge tone="secondary" data-testid="badge-secondary">
        Secondary
      </Badge>
      <Badge tone="accent" data-testid="badge-accent">
        Accent
      </Badge>
      <Badge tone="neutral" data-testid="badge-neutral">
        Neutral
      </Badge>
      <Badge tone="info" data-testid="badge-info">
        Info
      </Badge>
      <Badge tone="success" data-testid="badge-success">
        Success
      </Badge>
      <Badge tone="warning" data-testid="badge-warning">
        Warning
      </Badge>
      <Badge tone="error" data-testid="badge-error">
        Error
      </Badge>
    </div>
  ),
};

export const Looks: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge data-testid="badge-solid">Solid</Badge>
      <Badge look="soft" data-testid="badge-soft">
        Soft
      </Badge>
      <Badge look="outline" data-testid="badge-outline">
        Outline
      </Badge>
      <Badge look="dash" data-testid="badge-dash">
        Dash
      </Badge>
      <Badge look="ghost" data-testid="badge-ghost">
        Ghost
      </Badge>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge empty tone="primary" size="lg" data-testid="badge-empty-lg" />
      <Badge empty tone="primary" size="md" data-testid="badge-empty-md" />
      <Badge empty tone="primary" size="sm" data-testid="badge-empty-sm" />
      <Badge empty tone="primary" size="xs" data-testid="badge-empty-xs" />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge
        tone="info"
        iconLeft={<span className="icon-symbols">info</span>}
        data-testid="badge-icon-left"
      >
        Info
      </Badge>
      <Badge
        tone="success"
        iconRight={<span className="icon-symbols">check</span>}
        data-testid="badge-icon-right"
      >
        Done
      </Badge>
    </div>
  ),
};
