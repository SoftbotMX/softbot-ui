import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Filter, { type FilterProps } from "./index";

type Story = StoryObj<FilterProps>;

const baseOptions = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photos" },
  { value: "video", label: "Videos" },
  { value: "doc", label: "Docs" },
];

const meta: Meta<FilterProps> = {
  title: "Core/Filter",
  component: Filter,
  parameters: { layout: "padded" },
  args: {
    options: baseOptions,
    showReset: "left",
    size: "sm",
    tone: undefined,
    ghost: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
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
    ghost: { control: "boolean" },
    showReset: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onChange: { action: "change" },
  },
};
export default meta;

export const Default: Story = {
  args: {
    defaultValue: null,
  },
};

export const WithInitial: Story = {
  args: {
    defaultValue: "photo",
  },
};

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
function ControlledDemo(props: FilterProps) {
  const [val, setVal] = React.useState<string[] | string | null>("video");
  return (
    <div className="grid gap-3">
      <Filter {...props} value={val} onChange={setVal} />
      <div className="text-sm opacity-70">selected: {String(val)}</div>
      <div className="flex gap-2">
        <button className="btn btn-xs" onClick={() => setVal("doc")}>
          Pick “Docs”
        </button>
        <button className="btn btn-xs" onClick={() => setVal(null)}>
          Reset
        </button>
      </div>
    </div>
  );
}

/** Tones & Ghost */
export const TonesGhost: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <Filter {...args} tone="neutral" />
      <Filter {...args} tone="primary" />
      <Filter {...args} tone="secondary" />
      <Filter {...args} tone="accent" />
      <Filter {...args} tone="info" />
      <Filter {...args} tone="success" />
      <Filter {...args} tone="warning" />
      <Filter {...args} tone="error" />
      <Filter {...args} ghost />
    </div>
  ),
  args: {
    defaultValue: "all",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Filter {...args} size="xs" />
      <Filter {...args} size="sm" />
      <Filter {...args} size="md" />
      <Filter {...args} size="lg" />
      <Filter {...args} size="xl" />
    </div>
  ),
  args: {
    defaultValue: "photo",
  },
};

export const ManyAndDisabled: Story = {
  args: {
    options: [
      ...baseOptions,
      { value: "zip", label: "Archives" },
      { value: "code", label: "Code", disabled: true },
      { value: "audio", label: "Audio" },
    ],
    defaultValue: "doc",
  },
};

export const CheckboxAndRightReset: Story = {
  render: (args) => <CheckBoxDemo {...args} />,
  args: {
    options: [
      { value: "photo", label: "Photos" },
      { value: "video", label: "Videos" },
      { value: "doc", label: "Docs" },
      { value: "zip", label: "Archives" },
      { value: "audio", label: "Audio" },
    ],
    showReset: "right",
    type: "checkbox",
  },
};

function CheckBoxDemo(props: FilterProps) {
  const [val, setVal] = React.useState<string[] | string | null>([]);
  return (
    <div className="grid gap-3">
      <Filter {...props} value={val} onChange={setVal} />
      <div className="text-sm opacity-70">selected: {String(val)}</div>
    </div>
  );
}
