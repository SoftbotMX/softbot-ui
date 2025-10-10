import type { Meta, StoryObj } from "@storybook/react";

import Fab, { type FabProps, type FabActions } from "./index";

const meta: Meta<FabProps> = {
  title: "Core/FAB",
  component: Fab,
  parameters: { layout: "fullscreen" },
  argTypes: {
    withClose: { control: "boolean" },
    flower: { control: "boolean" },
    className: { control: "text" },
    actions: { control: false },
    buttonProps: { control: false },
    closeButtonProps: { control: false },
    mainButtonProps: { control: false },
  },
  args: {
    withClose: false,
    flower: false,
    className: "",
    buttonProps: {
      tone: "primary",
      size: "lg",
      iconLeft: "add",
    },
    closeButtonProps: {
      size: "lg",
      iconLeft: "close",
    },
  },
};
export default meta;

type Story = StoryObj<FabProps>;

export const Default: Story = {
  args: {
    actions: [
      { tooltip: "Email", iconLeft: "mail" } as FabActions,
      { tooltip: "Upload", iconLeft: "upload" } as FabActions,
      { tooltip: "Share", iconLeft: "share" } as FabActions,
    ],
  },
};

export const WithClose: Story = {
  args: {
    withClose: true,
    actions: [
      { tooltip: "Edit", iconLeft: "edit" },
      { tooltip: "Delete", iconLeft: "delete" },
    ],
  },
};

export const Flower: Story = {
  args: {
    flower: true,
    actions: [
      { tooltip: "Mail", iconLeft: "mail" },
      { tooltip: "Image", iconLeft: "image" },
      { tooltip: "Location", iconLeft: "pin_drop" },
      { tooltip: "Share", iconLeft: "share" },
    ],
  },
};

export const WithLabels: Story = {
  args: {
    actions: [
      { label: "Compose", iconLeft: "edit" },
      { label: "Attach", iconLeft: "attach_file" },
      { label: "Send", iconLeft: "send" },
    ],
  },
};

export const ManyActions: Story = {
  args: {
    actions: [
      { tooltip: "One", iconLeft: "looks_one" },
      { tooltip: "Two", iconLeft: "looks_two" },
      { tooltip: "Three", iconLeft: "looks_3" },
      { tooltip: "Four", iconLeft: "looks_4" },
      { tooltip: "Five", iconLeft: "looks_5" },
      { tooltip: "Six", iconLeft: "looks_6" },
    ],
    mainButton: true,
    mainButtonProps: { iconLeft: "person", size: "lg" },
  },
};

export const CustomStyling: Story = {
  args: {
    className: "end-8 bottom-8",
    buttonProps: {
      tone: "accent",
      size: "lg",
      iconLeft: "add",
    },
    actions: [
      { tooltip: "Star", iconLeft: "star" },
      { tooltip: "Bookmark", iconLeft: "bookmark" },
    ],
  },
};

export const TextTrigger: Story = {
  args: {
    buttonProps: {
      tone: "primary",
      size: "lg",
      iconLeft: "add",
    },
    actions: [{ tooltip: "Upload", iconLeft: "upload" }],
  },
};
