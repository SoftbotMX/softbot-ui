import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Divider from "./index";

type Props = React.ComponentProps<typeof Divider>;
type Story = StoryObj<Props>;

const meta: Meta<Props> = {
  title: "Core/Divider",
  component: Divider,
  parameters: { layout: "padded" },
  args: {
    orientation: "horizontal",
    align: "center",
    tone: undefined,
    children: "Divider",
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    align: {
      control: "inline-radio",
      options: ["center", "start", "end"],
    },
    tone: {
      control: "radio",
      options: [
        undefined,
        "neutral",
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "info",
        "error",
      ] as never,
    },
    as: {
      control: "text",
      table: { category: "DOM" },
      description: "Elemento HTML (div, li, etc.)",
    },
    children: {
      control: "text",
    },
  },
};
export default meta;

export const Default: Story = {};

export const NoContent: Story = {
  args: { children: undefined },
};

export const Alignment: Story = {
  render: (args) => (
    <div className="grid gap-6">
      <Divider {...args} align="start">
        Start
      </Divider>
      <Divider {...args} align="center">
        Center
      </Divider>
      <Divider {...args} align="end">
        End
      </Divider>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical", children: undefined },
  render: (args) => (
    <div className="flex gap-5">
      <span>A</span>
      <Divider {...args}></Divider>
      <span>B</span>
      <Divider {...args}></Divider>
      <span>C</span>
    </div>
  ),
};

export const Tones: Story = {
  args: { children: "Tone" },
  render: (args) => (
    <div className="grid gap-6">
      <Divider {...args} tone="neutral">
        Neutral
      </Divider>
      <Divider {...args} tone="primary">
        Primary
      </Divider>
      <Divider {...args} tone="secondary">
        Secondary
      </Divider>
      <Divider {...args} tone="accent">
        Accent
      </Divider>
      <Divider {...args} tone="success">
        Success
      </Divider>
      <Divider {...args} tone="warning">
        Warning
      </Divider>
      <Divider {...args} tone="info">
        Info
      </Divider>
      <Divider {...args} tone="error">
        Error
      </Divider>
    </div>
  ),
};

export const CustomElement: Story = {
  render: (args) => (
    <ul className="grid gap-4">
      <li>Item 1</li>
      <li>
        <Divider {...args} as="div" />
      </li>
      <li>Item 2</li>
    </ul>
  ),
};
