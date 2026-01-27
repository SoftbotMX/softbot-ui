import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Autocomplete from "./index";

const baseOptions = [
  { value: "mx", label: "México" },
  { value: "us", label: "Estados Unidos" },
  { value: "ca", label: "Canadá" },
  { value: "br", label: "Brasil" },
  { value: "ar", label: "Argentina" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "pe", label: "Perú" },
];

const meta: Meta<typeof Autocomplete> = {
  title: "Core/Autocomplete",
  component: Autocomplete,
  args: {
    options: baseOptions,
    size: "md",
    placeholder: "Buscar país…",
    clearable: true,
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Autocomplete>;

export const Basic: Story = {
  args: {
    defaultValue: "mx",
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ["mx", "us"],
    placeholder: "Selecciona varios…",
  },
};

export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<string | null>("us");

    return (
      <div className="flex w-[24rem] flex-col gap-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error */}
        <Autocomplete options={baseOptions} value={value} onChange={setValue} />
        <div className="text-sm opacity-70">Seleccionado: {value || "—"}</div>
        <div className="flex gap-2">
          <button className="btn btn-sm" onClick={() => setValue("ca")}>
            Set CA
          </button>
          <button className="btn btn-sm" onClick={() => setValue(null)}>
            Clear
          </button>
        </div>
      </div>
    );
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex w-[24rem] flex-col gap-3">
      <Autocomplete options={baseOptions} defaultValue="mx" tone="neutral" />
      <Autocomplete options={baseOptions} defaultValue="mx" tone="primary" />
      <Autocomplete options={baseOptions} defaultValue="mx" tone="secondary" />
      <Autocomplete options={baseOptions} defaultValue="mx" tone="accent" />
      <Autocomplete options={baseOptions} defaultValue="mx" tone="info" />
      <Autocomplete options={baseOptions} defaultValue="mx" tone="success" />
      <Autocomplete options={baseOptions} defaultValue="mx" tone="warning" />
      <Autocomplete options={baseOptions} defaultValue="mx" tone="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-[24rem] flex-col gap-3">
      <Autocomplete options={baseOptions} defaultValue="mx" size="xs" />
      <Autocomplete options={baseOptions} defaultValue="mx" size="sm" />
      <Autocomplete options={baseOptions} defaultValue="mx" size="md" />
      <Autocomplete options={baseOptions} defaultValue="mx" size="lg" />
      <Autocomplete options={baseOptions} defaultValue="mx" size="xl" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: "us",
    disabled: true,
  },
};

export const NoOptions: Story = {
  args: {
    options: [],
    placeholder: "Sin opciones…",
    noOptionsText: "No hay resultados",
  },
};
