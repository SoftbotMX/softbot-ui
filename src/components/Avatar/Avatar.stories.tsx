import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Avatar, { AvatarGroup, type AvatarProps } from "./index";

const meta: Meta<AvatarProps> = {
  title: "Core/Avatar",
  component: Avatar,
  args: {
    src: "https://i.pravatar.cc?img=2",
    alt: "User",
  },
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<AvatarProps>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar size={"xl"} src="https://i.pravatar.cc?img=2" alt="XL" />
      <Avatar size={"lg"} src="https://i.pravatar.cc?img=2" alt="LG" />
      <Avatar src="https://i.pravatar.cc?img=2" alt="MD" />
      <Avatar size={"sm"} src="https://i.pravatar.cc?img=2" alt="SM" />
      <Avatar size={"xs"} src="https://i.pravatar.cc?img=2" alt="XS" />
    </div>
  ),
};

export const Rounded: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar src="https://i.pravatar.cc/80?img=8" alt="Circle" />
      <Avatar rounded="xl" src="https://i.pravatar.cc/80?img=9" alt="xl" />
      <Avatar rounded="full" src="https://i.pravatar.cc/80?img=10" alt="full" />
    </div>
  ),
};

export const WithRing: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar ring src="https://i.pravatar.cc/80?img=11" alt="Ring default" />
      <Avatar ring toneRing="primary" src="https://i.pravatar.cc/80?img=12" alt="Ring primary" />
      <Avatar ring toneRing="success" src="https://i.pravatar.cc/80?img=13" alt="Ring success" />
      <Avatar ring toneRing="warning" src="https://i.pravatar.cc/80?img=14" alt="Ring warning" />
      <Avatar ring toneRing="error" src="https://i.pravatar.cc/80?img=15" alt="Ring error" />
    </div>
  ),
};

export const PresenceStatus: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Avatar presence="online" src="https://i.pravatar.cc/80?img=16" alt="Online" />
      <Avatar presence="away" src="https://i.pravatar.cc/80?img=17" alt="Away" />
      <Avatar presence="busy" src="https://i.pravatar.cc/80?img=18" alt="Busy" />
      <Avatar presence="offline" src="https://i.pravatar.cc/80?img=19" alt="Offline" />
    </div>
  ),
};

export const Fallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm" src="" alt="Fallback AB" />
      <Avatar placeholder={"RP"} />
      <Avatar size="lg" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4}>
      <Avatar src="https://i.pravatar.cc?img=20" alt="1" />
      <Avatar src="https://i.pravatar.cc?img=21" alt="2" />
      <Avatar src="https://i.pravatar.cc?img=22" alt="3" />
      <Avatar src="https://i.pravatar.cc?img=23" alt="4" />
      <Avatar src="https://i.pravatar.cc?img=24" alt="5" />
      <Avatar src="https://i.pravatar.cc?img=25" alt="6" />
    </AvatarGroup>
  ),
};
