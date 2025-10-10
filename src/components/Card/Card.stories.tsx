import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Card, { type CardProps } from "./index";

const meta: Meta<CardProps> = {
  title: "Core/Card",
  component: Card,
  args: {
    border: "solid",
    layout: "default",
    imageMode: "normal",
    className: "w-96",
  },
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<CardProps>;

export const Default: Story = {
  args: {
    title: "Card title",
    children: <p>Here is a simple card body with some content.</p>,
    actions: (
      <div className="flex gap-2">
        <button className="btn btn-primary">Accept</button>
        <button className="btn">Cancel</button>
      </div>
    ),
  },
};

export const WithImageTop: Story = {
  args: {
    title: "Shoes!",
    figure: <img src="https://picsum.photos/seed/shoes/600/300" alt="random" />,
    children: <p>If a dog chews shoes whose shoes does he choose?</p>,
    actions: <button className="btn btn-primary">Buy Now</button>,
  },
};

export const WithImageBottom: Story = {
  render: () => (
    <Card className="w-100 shadow-sm">
      <div className="card-body">
        <div className="card-title">Bottom Image</div>
        <p>Card content, then an image as the last figure.</p>
        <div className="card-actions">
          <button className="btn btn-outline">Details</button>
        </div>
      </div>
      <Card.Figure>
        <img src="https://picsum.photos/seed/bottom/600/280" alt="random" />
      </Card.Figure>
    </Card>
  ),
};

export const ImageFull: Story = {
  args: {
    imageMode: "full",
    figure: <img src="https://picsum.photos/seed/full/800/400" alt="full" />,
    title: "Image overlay",
    children: (
      <p>
        The image is darkened; text overlays with <code>.image-full</code> style.
      </p>
    ),
    actions: <button className="btn btn-primary">Explore</button>,
  },
};

export const SideLayout: Story = {
  args: {
    layout: "side",
    figure: <img src="https://picsum.photos/seed/side/320/220" alt="side" />,
    title: "Side layout",
    children: <p>Figure and body aligned horizontally.</p>,
    actions: <button className="btn btn-soft">More</button>,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <Card size="xs" title="XS">
        <p>Extra small card</p>
      </Card>
      <Card size="sm" title="SM">
        <p>Small card</p>
      </Card>
      <Card size="md" title="MD">
        <p>Medium card</p>
      </Card>
      <Card size="lg" title="LG">
        <p>Large card</p>
      </Card>
      <Card size="xl" title="XL">
        <p>Extra large card</p>
      </Card>
    </div>
  ),
};

export const Borders: Story = {
  render: () => (
    <div className="grid gap-4">
      <Card border="solid" title="Solid border">
        <p>Bordered card</p>
      </Card>
      <Card border="dash" title="Dashed border">
        <p>Dashed border</p>
      </Card>
    </div>
  ),
};
