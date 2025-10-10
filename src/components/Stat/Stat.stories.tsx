import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Stats, {
  Stat as StatItem,
  StatFigure,
  StatTitle,
  StatValue,
  StatDesc,
  StatActions,
} from "./index";
import Button from "../Button";

const meta: Meta<typeof Stats> = {
  title: "Data Display/Stat",
  component: Stats,
  args: {
    orientation: "horizontal",
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Stats>;

export const Horizontal: Story = {
  render: (args) => (
    <Stats {...args} className="w-[720px] bg-base-200 border-base-300 border">
      <StatItem>
        <StatFigure icon={"trending_up"} />
        <StatTitle>Revenue</StatTitle>
        <StatValue>$42,150</StatValue>
        <StatActions>
          <Button size={"sm"}>Details</Button>
        </StatActions>
      </StatItem>

      <StatItem>
        <StatFigure icon={"people"} />
        <StatTitle>New Users</StatTitle>
        <StatValue>1,248</StatValue>
        <StatDesc>+4.2% week over week</StatDesc>
      </StatItem>

      <StatItem>
        <StatFigure icon={"shopping_cart"} />
        <StatTitle>Orders</StatTitle>
        <StatValue>326</StatValue>
        <StatDesc>-3.1% week over week</StatDesc>
      </StatItem>
    </Stats>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Stats {...args} className="w-[360px]">
      <StatItem>
        <StatTitle>CPU usage</StatTitle>
        <StatValue>58%</StatValue>
        <StatDesc>Last 5 min average</StatDesc>
      </StatItem>

      <StatItem>
        <StatTitle>Latency</StatTitle>
        <StatValue>112ms</StatValue>
        <StatDesc>P95 • us-east-1</StatDesc>
      </StatItem>

      <StatItem>
        <StatTitle>Uptime</StatTitle>
        <StatValue>99.98%</StatValue>
        <StatDesc>30 days</StatDesc>
        <StatActions>
          <Button size={"sm"}>Status page</Button>
        </StatActions>
      </StatItem>
    </Stats>
  ),
};
