import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Radio from "./index";

const meta: Meta<typeof Radio> = {
  title: "Core/Radio",
  component: Radio,
  args: {
    name: "demo",
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Basic: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2">
        <Radio {...args} defaultChecked value="a" />
        <span>Opción A</span>
      </label>
      <label className="flex items-center gap-2">
        <Radio {...args} value="b" />
        <span>Opción B</span>
      </label>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        "neutral",
        "primary",
        "secondary",
        "accent",
        "info",
        "success",
        "warning",
        "error",
      ].map((tone) => (
        <label key={tone} className="flex items-center gap-2">
          <Radio name={`tones`} tone={tone as any} defaultChecked={tone === "primary"} />
          <span className="capitalize">{tone}</span>
        </label>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-5">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <label key={s} className="flex items-center gap-2">
          <Radio name={`sizes`} size={s} defaultChecked={s === "md"} />
          <span className="uppercase text-xs">.{`radio-${s}`}</span>
        </label>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 opacity-60">
        <Radio name="disabled" disabled defaultChecked />
        <span>Seleccionado (disabled)</span>
      </label>
      <label className="flex items-center gap-2 opacity-60">
        <Radio name="disabled" disabled />
        <span>No seleccionado (disabled)</span>
      </label>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = React.useState("b");
    return (
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium opacity-70 mb-1">
          Valor: <span className="font-semibold">{val}</span>
        </legend>
        <label className="flex items-center gap-2">
          <Radio
            name="controlled"
            checked={val === "a"}
            onChange={() => setVal("a")}
            tone="primary"
            value="a"
          />
          <span>Opción A</span>
        </label>
        <label className="flex items-center gap-2">
          <Radio
            name="controlled"
            checked={val === "b"}
            onChange={() => setVal("b")}
            tone="primary"
            value="b"
          />
          <span>Opción B</span>
        </label>
      </fieldset>
    );
  },
};
