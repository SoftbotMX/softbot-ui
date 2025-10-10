import type { Meta, StoryObj } from "@storybook/react";

import Steps, { type StepItem } from "./index";

const baseItems: StepItem[] = [
  { label: "Start" },
  { label: "Details" },
  { label: "Confirm" },
  { label: "Done" },
];

const meta: Meta<typeof Steps> = {
  title: "Navigation/Steps",
  component: Steps,
  parameters: { layout: "centered" },
  args: {
    items: baseItems,
    orientation: "horizontal",
    currentIndex: 2,
    activeTone: "primary",
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    activeTone: {
      control: "select",
      options: ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
    currentIndex: { control: { type: "number", min: 0, step: 1 } },
    completedCount: { control: { type: "number", min: 0, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof Steps>;

export const Basic: Story = {};

export const WithIcons: Story = {
  args: {
    items: [
      { label: "Cart", icon: "shopping_cart" },
      { label: "Address", icon: "home_pin" },
      { label: "Payment", icon: "credit_card" },
      { label: "Review", icon: "fact_check" },
    ],
    currentIndex: 3,
  },
};

export const CustomContentInCircle: Story = {
  args: {
    items: [
      { label: "Init", content: "A" },
      { label: "Build", content: "B" },
      { label: "Ship", content: "C" },
    ],
    currentIndex: 2,
  },
};

export const Vertical: Story = {
  args: {
    items: baseItems,
    orientation: "vertical",
    currentIndex: 1,
  },
};

export const MixedTones: Story = {
  args: {
    items: [
      { label: "One", tone: "success" },
      { label: "Two", tone: "info" },
      { label: "Three", tone: "warning" },
      { label: "Four", tone: "error" },
    ],
    currentIndex: undefined,
    completedCount: undefined,
  },
};
