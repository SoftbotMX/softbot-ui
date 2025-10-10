import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Countdown from "./";

type Story = StoryObj<React.ComponentProps<typeof Countdown>>;

const meta: Meta<React.ComponentProps<typeof Countdown>> = {
  title: "Core/Countdown",
  component: Countdown,
  parameters: { layout: "padded" },
  argTypes: {
    separator: {
      control: "radio",
      options: ["colon", "dot", "slash", "space"],
      description: "Separador entre unidades (o pasa un ReactNode en la historia)",
    },
    size: {
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    units: {
      control: "check",
      options: ["days", "hours", "minutes", "seconds"],
    },
    boxed: { control: "boolean" },
    labeled: { control: "boolean" },
    padTwo: { control: "boolean" },
    padDays: { control: "boolean" },
    running: { control: "boolean" },
  },
  args: {
    size: "lg",
    separator: "colon",
    boxed: false,
    labeled: false,
    padTwo: true,
    padDays: false,
    running: true,
    tickMs: 1000,
  },
};
export default meta;

export const Minutes5: Story = {
  args: {
    minutes: 5,
  },
};

export const UntilDate: Story = {
  render: (args) => <Countdown {...args} until={new Date(Date.now() + 30_000)} labeled size="xl" />,
};

export const BoxedWithLabels: Story = {
  args: {
    minutes: 2,
    labeled: true,
    boxed: true,
    separator: "space",
    boxClassName: "rounded-box border border-base-300 bg-neutral text-center p-2!",
  },
};

export const Separators: Story = {
  render: () => (
    <div className="grid gap-4">
      <Countdown minutes={3} separator="colon" />
      <Countdown minutes={3} separator="dot" />
      <Countdown minutes={3} separator="slash" />
      <Countdown minutes={3} separator={<span className="mx-1 opacity-60">|</span>} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3 items-end">
      <Countdown minutes={1} size="xs" />
      <Countdown minutes={1} size="sm" />
      <Countdown minutes={1} size="md" />
      <Countdown minutes={1} size="lg" />
      <Countdown minutes={1} size="xl" />
    </div>
  ),
};

export const ForcedUnits: Story = {
  args: {
    minutes: 90,
    units: ["hours", "minutes", "seconds"],
  },
};

export const WithDays: Story = {
  args: {
    days: 2,
    labeled: true,
    padDays: true,
    className: "text-center",
  },
};

export const ControlledExternal: Story = {
  render: (args) => <ControlledDemo {...args} />,
  args: {
    units: ["minutes", "seconds"],
    size: "lg",
  },
};

function ControlledDemo(props: React.ComponentProps<typeof Countdown>) {
  const [left, setLeft] = React.useState(35); // segundos
  React.useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  return <Countdown {...props} value={left} />;
}
