import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Textarea, { type TextareaProps } from "./index";

const meta: Meta<TextareaProps> = {
  title: "Forms/Textarea",
  component: Textarea,
  args: {
    placeholder: "Escribe tu mensaje…",
    size: "md",
    rows: 4,
  },
};
export default meta;

type Story = StoryObj<TextareaProps>;

export const Basic: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-xl">
      <Textarea size="xs" placeholder="XS" />
      <Textarea size="sm" placeholder="SM" />
      <Textarea size="md" placeholder="MD" />
      <Textarea size="lg" placeholder="LG" />
      <Textarea size="xl" placeholder="XL" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
      <Textarea tone="neutral" placeholder="Neutral" />
      <Textarea tone="primary" placeholder="Primary" />
      <Textarea tone="secondary" placeholder="Secondary" />
      <Textarea tone="accent" placeholder="Accent" />
      <Textarea tone="info" placeholder="Info" />
      <Textarea tone="success" placeholder="Success" />
      <Textarea tone="warning" placeholder="Warning" />
      <Textarea tone="error" placeholder="Error" />
    </div>
  ),
};

export const Ghost: Story = {
  args: {
    ghost: true,
    placeholder: "Ghost textarea",
  },
  render: (args) => (
    <div className="bg-base-200 p-6 rounded-box max-w-xl">
      <Textarea {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Textarea deshabilitado",
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("Valor controlado");
    return (
      <div className="space-y-2 max-w-xl">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          tone="primary"
          aria-label="controlled-textarea"
        />
        <div className="text-sm opacity-70">Longitud: {value.length}</div>
      </div>
    );
  },
};
