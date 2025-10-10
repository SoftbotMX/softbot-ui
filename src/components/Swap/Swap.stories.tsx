import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Swap from "./index";

const meta: Meta<typeof Swap> = {
  title: "Display/Swap",
  component: Swap,
  parameters: { layout: "centered" },
  args: {
    "aria-label": "Theme toggle",
  },
  argTypes: {
    rotate: { control: "boolean" },
    flip: { control: "boolean" },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Swap>;

export const IconsSunMoon: Story = {
  args: {
    iconOff: "light_mode",
    iconOn: "dark_mode",
    rotate: true,
  },
};

export const WithText: Story = {
  args: {
    off: <span className="px-3 py-1 rounded-field bg-base-200">Off</span>,
    on: <span className="px-3 py-1 rounded-field bg-primary text-primary-content">On</span>,
    flip: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const ControlledExample = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <div className="flex flex-col items-center gap-4">
          <Swap
            iconOff="visibility_off"
            iconOn="visibility"
            checked={checked}
            onCheckedChange={setChecked}
            rotate
          />
          <button className="btn primary" onClick={() => setChecked((c) => !c)}>
            Toggle from outside ({checked ? "ON" : "OFF"})
          </button>
        </div>
      );
    };
    return <ControlledExample />;
  },
};

export const Indeterminate: Story = {
  args: {
    iconOff: "check_box_outline_blank",
    iconOn: "check_box",
    iconIndeterminate: "indeterminate_check_box",
  },
  render: (args) => {
    const Demo = () => {
      const [state, setState] = React.useState<"off" | "indeterminate" | "on">("indeterminate");

      const toChecked = state === "on" ? true : state === "off" ? false : false;
      const toInd = state === "indeterminate";

      return (
        <div className="flex flex-col items-center gap-4">
          <Swap
            {...args}
            checked={toChecked}
            indeterminate={toInd}
            onCheckedChange={(c) => setState(c ? "on" : "off")}
          />
          <div className="flex gap-2">
            <button className="btn" onClick={() => setState("off")}>
              Off
            </button>
            <button className="btn" onClick={() => setState("indeterminate")}>
              Indeterminate
            </button>
            <button className="btn" onClick={() => setState("on")}>
              On
            </button>
          </div>
        </div>
      );
    };
    return <Demo />;
  },
};

export const ClassActiveOnly: Story = {
  args: {
    iconOff: "toggle_off",
    iconOn: "toggle_on",
    rotate: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Usa `.swap-active` para forzar el estado visual sin input (útil para maquetas).",
      },
    },
  },
};
