import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Alert, { type AlertProps } from "./index";

const meta: Meta<AlertProps> = {
  title: "Core/Alert",
  component: Alert,
  args: {
    tone: "info",
    children: "This is an alert message.",
  },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<AlertProps>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="grid gap-3">
      <Alert tone="info">Info message</Alert>
      <Alert tone="success">Success message</Alert>
      <Alert tone="warning">Warning message</Alert>
      <Alert tone="error">Error message</Alert>
    </div>
  ),
};

export const Looks: Story = {
  render: () => (
    <div className="grid gap-3">
      <Alert tone="info">Solid</Alert>
      <Alert look="soft" tone="info">
        Soft
      </Alert>
      <Alert look="outline" tone="info">
        Outline
      </Alert>
      <Alert look="dash" tone="info">
        Dash
      </Alert>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="grid gap-3">
      <Alert tone="warning" icon={<span className="icon-symbols">warning</span>} title="Heads up!">
        Something might need your attention.
      </Alert>
      <Alert tone="success" icon={<span className="icon-symbols">check</span>} title="All good">
        Your changes have been saved.
      </Alert>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="grid gap-3">
      <Alert
        direction="vertical"
        tone="info"
        icon={<span className="icon-symbols">info</span>}
        title="Information"
      >
        Vertical layout stacks icon, content and actions.
      </Alert>
      <Alert
        direction="vertical"
        tone="error"
        icon={<span className="icon-symbols">error</span>}
        title="Something went wrong"
        actions={
          <div className="flex gap-2">
            <button className="btn btn-soft">Details</button>
            <button className="btn btn-primary">Retry</button>
          </div>
        }
      >
        Please try again later.
      </Alert>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Alert
      tone="success"
      icon={<span className="icon-symbols">check</span>}
      title="Saved"
      actions={
        <div className="flex items-center gap-2">
          <a className="btn btn-link">Undo</a>
          <button className="btn btn-primary">View</button>
        </div>
      }
    >
      Your settings have been updated successfully.
    </Alert>
  ),
};
