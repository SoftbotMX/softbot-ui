import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Fieldset, { type FieldsetProps } from "./index";
import Input from "../Input";

type Story = StoryObj<FieldsetProps>;

const Icon = ({ name }: { name: string }) => <span className="icon-symbols">{name}</span>;

const meta: Meta<FieldsetProps> = {
  title: "Core/Fieldset",
  component: Fieldset,
  parameters: { layout: "padded" },
  args: {
    legend: "Account",
    legendActions: undefined,
    label: undefined,
    disabled: false,
  },
  argTypes: {
    legend: { control: "text" },
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
};
export default meta;

export const Default: Story = {
  render: (args) => (
    <Fieldset {...args}>
      <Input placeholder="Email" type="email" left={"mail"} />
      <Input placeholder="Password" type="password" left={"lock"} />
    </Fieldset>
  ),
};

export const WithBorder: Story = {
  render: (args) => (
    <Fieldset {...args} className={"bg-base-200 border-base-300 rounded-box w-xs border p-4!"}>
      <Input placeholder="Email" type="email" left={"mail"} />
      <Input placeholder="Password" type="password" left={"lock"} />
    </Fieldset>
  ),
};

export const WithLegendActions: Story = {
  args: {
    legend: "Profile",
    legendActions: (
      <button className="btn btn-xs btn-ghost">
        <Icon name="edit" /> Edit
      </button>
    ),
  },
  render: (args) => (
    <Fieldset {...args}>
      <Input placeholder="First name" />
      <Input placeholder="Last name" />
    </Fieldset>
  ),
};

export const WithLabel: Story = {
  args: {
    legend: "Security",
    label: "Use a strong password with numbers and symbols.",
  },
  render: (args) => (
    <Fieldset {...args}>
      <Input type="password" placeholder="New password" />
      <Input type="password" placeholder="Repeat password" />
    </Fieldset>
  ),
};

export const Disabled: Story = {
  args: { legend: "Billing", disabled: true },
  render: (args) => (
    <Fieldset {...args}>
      <Input placeholder="Card holder" />
      <Input placeholder="Card number" />
    </Fieldset>
  ),
};

export const MultipleGroups: Story = {
  render: () => (
    <div className="grid gap-6">
      <Fieldset legend="Contact">
        <Input placeholder="Phone" type="tel" left={"call"} />
        <Input placeholder="Email" type="email" left={"mail"} />
      </Fieldset>

      <Fieldset legend="Address" label="We use this for shipping.">
        <Input placeholder="Street" />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="City" />
          <Input placeholder="ZIP" />
        </div>
      </Fieldset>
    </div>
  ),
};
