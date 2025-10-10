import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import FileInput, { type FileInputProps } from "./index";

type Story = StoryObj<FileInputProps>;

const meta: Meta<FileInputProps> = {
  title: "Core/FileInput",
  component: FileInput,
  parameters: { layout: "padded" },
  args: {
    size: "md",
    showNames: true,
    clearable: true,
    nameSeparator: ", ",
    multiple: false,
    placeholder: undefined,
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
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    showNames: { control: "boolean" },
    clearable: { control: "boolean" },
    nameSeparator: { control: "text" },
    onFilesChange: { action: "filesChanged" },
  },
};
export default meta;

export const Default: Story = {
  args: {
    accept: undefined,
  },
};

export const MultipleWithNames: Story = {
  args: {
    multiple: true,
    showNames: true,
    clearable: true,
  },
};

export const Tones: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <FileInput {...args} tone="neutral" />
      <FileInput {...args} tone="primary" />
      <FileInput {...args} tone="secondary" />
      <FileInput {...args} tone="accent" />
      <FileInput {...args} tone="info" />
      <FileInput {...args} tone="success" />
      <FileInput {...args} tone="warning" />
      <FileInput {...args} tone="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <FileInput {...args} size="xs" />
      <FileInput {...args} size="sm" />
      <FileInput {...args} size="md" />
      <FileInput {...args} size="lg" />
      <FileInput {...args} size="xl" />
    </div>
  ),
};

export const Ghost: Story = {
  args: {
    ghost: true,
  },
};

export const ImagesOnly: Story = {
  args: {
    accept: "image/*",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
