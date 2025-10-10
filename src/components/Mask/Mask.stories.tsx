import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Mask, { type MaskProps, type MaskShape } from "./index";

const meta: Meta<MaskProps> = {
  title: "Core/Mask",
  component: Mask,
  args: {
    shape: "squircle",
  },
  argTypes: {
    as: { control: "inline-radio", options: ["div", "img"] },
    shape: {
      control: "select",
      options: [
        "squircle",
        "decagon",
        "diamond",
        "heart",
        "hexagon",
        "hexagon-2",
        "circle",
        "pentagon",
        "star",
        "star-2",
        "triangle",
        "triangle-2",
        "triangle-3",
        "triangle-4",
      ] as MaskShape[],
    },
    half: { control: "inline-radio", options: [undefined, 1, 2] as never },
    width: { control: "text" },
    height: { control: "text" },
  },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<MaskProps>;

const DemoImg =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600&auto=format&fit=crop";

export const AsImg: Story = {
  args: {
    as: "img",
    src: DemoImg,
    alt: "avatar",
    shape: "circle",
    width: "8rem",
    height: "8rem",
  },
};

export const AsDivWithChild: Story = {
  render: (args: MaskProps) => (
    <Mask {...args} as="div" shape="squircle" width="12rem" height="8rem" className="bg-base-200">
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
        alt="cover"
        className="h-full w-full object-cover"
      />
    </Mask>
  ),
};

export const ShapesGrid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      {[
        "squircle",
        "decagon",
        "diamond",
        "heart",
        "hexagon",
        "hexagon-2",
        "circle",
        "pentagon",
        "star",
        "star-2",
        "triangle",
        "triangle-2",
        "triangle-3",
        "triangle-4",
      ].map((shape) => (
        <div key={shape} className="flex flex-col items-center gap-2">
          <Mask
            as="img"
            src={DemoImg}
            alt={shape}
            shape={shape as MaskShape}
            width="6rem"
            height="6rem"
          />
          <span className="text-xs opacity-70">{shape}</span>
        </div>
      ))}
    </div>
  ),
};

export const Halves: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Mask
        as="img"
        src={DemoImg}
        alt="half-1"
        shape="circle"
        half={1}
        width="8rem"
        height="8rem"
      />
      <Mask
        as="img"
        src={DemoImg}
        alt="half-2"
        shape="circle"
        half={2}
        width="8rem"
        height="8rem"
      />
    </div>
  ),
};

export const InlineText: Story = {
  render: () => (
    <p className="text-sm leading-6">
      Avatar:
      <Mask
        as="img"
        src={DemoImg}
        alt="inline"
        shape="squircle"
        width="1.5rem"
        height="1.5rem"
        className="mx-2"
      />
      aparece en línea con el texto.
    </p>
  ),
};
