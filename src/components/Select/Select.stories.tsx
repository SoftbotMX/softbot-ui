import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Select from "./index";

const baseOptions = [
  { value: "mx", label: "México" },
  { value: "us", label: "Estados Unidos" },
  { value: "ca", label: "Canadá" },
  { value: "br", label: "Brasil" },
];

const meta: Meta<typeof Select> = {
  title: "Core/Select",
  component: Select,
  args: {
    options: baseOptions,
    size: "md",
    ghost: false,
    placeholder: "Selecciona una opción…",
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  args: { defaultValue: "mx" },
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = React.useState("us");
    return (
      <div className="flex flex-col gap-2 w-[22rem]">
        <Select options={baseOptions} value={val} onChange={setVal} />
        <div className="text-sm opacity-70">Seleccionado: {val || "—"}</div>
        <div className="flex gap-2">
          <button className="btn btn-sm" onClick={() => setVal("ca")}>
            Set CA
          </button>
          <button className="btn btn-sm" onClick={() => setVal("")}>
            Clear
          </button>
        </div>
      </div>
    );
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[22rem]">
      <Select options={baseOptions} defaultValue="us" tone="neutral" />
      <Select options={baseOptions} defaultValue="us" tone="primary" />
      <Select options={baseOptions} defaultValue="us" tone="secondary" />
      <Select options={baseOptions} defaultValue="us" tone="accent" />
      <Select options={baseOptions} defaultValue="us" tone="info" />
      <Select options={baseOptions} defaultValue="us" tone="success" />
      <Select options={baseOptions} defaultValue="us" tone="warning" />
      <Select options={baseOptions} defaultValue="us" tone="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[22rem]">
      <Select options={baseOptions} defaultValue="mx" size="xs" />
      <Select options={baseOptions} defaultValue="mx" size="sm" />
      <Select options={baseOptions} defaultValue="mx" size="md" />
      <Select options={baseOptions} defaultValue="mx" size="lg" />
      <Select options={baseOptions} defaultValue="mx" size="xl" />
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <div className="w-[22rem]">
      <Select
        groups={[
          {
            label: "Norteamérica",
            options: [
              { value: "mx", label: "México" },
              { value: "us", label: "Estados Unidos" },
              { value: "ca", label: "Canadá" },
            ],
          },
          {
            label: "Sudamérica",
            options: [
              { value: "br", label: "Brasil" },
              { value: "ar", label: "Argentina" },
            ],
          },
        ]}
        defaultValue="ca"
      />
    </div>
  ),
};

export const GhostAndPlaceholder: Story = {
  args: { options: baseOptions, ghost: true, placeholder: "Elige país…" },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[22rem]">
      <Select options={baseOptions} defaultValue="mx" disabled />
    </div>
  ),
};
