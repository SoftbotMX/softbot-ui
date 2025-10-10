import type { Meta, StoryObj } from "@storybook/react";
import clsx from "clsx";
import * as React from "react";

import Stack from "./index";

const Box = ({ label, className }: { label: string; className: string }) => (
  <div className={clsx("rounded-box border border-base-200 p-6 text-center", className)}>
    {label}
  </div>
);

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  args: {
    align: "bottom",
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Stack>;

export const Basic: Story = {
  render: (args) => (
    <Stack {...args} className="w-full h-full">
      <Box label="Top" className={"bg-primary"} />
      <Box label="Middle" className={"bg-secondary"} />
      <Box label="Bottom" className={"bg-accent"} />
    </Stack>
  ),
};

export const Top: Story = {
  args: { align: "top" },
  render: (args) => (
    <Stack {...args} className="w-[320px] h-[200px]">
      <Box label="A" className={"bg-primary"} />
      <Box label="B" className={"bg-secondary"} />
      <Box label="C" className={"bg-accent"} />
    </Stack>
  ),
};

export const Start: Story = {
  args: { align: "start" },
  render: (args) => (
    <Stack {...args} className="w-[320px] h-[200px]">
      <Box label="1" className={"bg-primary"} />
      <Box label="2" className={"bg-secondary"} />
      <Box label="3" className={"bg-accent"} />
    </Stack>
  ),
};

export const End: Story = {
  args: { align: "end" },
  render: (args) => (
    <Stack {...args} className="w-[320px] h-[200px]">
      <Box label="α" className={"bg-primary"} />
      <Box label="β" className={"bg-secondary"} />
      <Box label="γ" className={"bg-accent"} />
    </Stack>
  ),
};
