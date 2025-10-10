import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Indicator, { type IndicatorProps } from "./index";
import Avatar from "../Avatar";
import Button from "../Button";

const meta: Meta<IndicatorProps> = {
  title: "Core/Indicator",
  component: Indicator,
  parameters: { layout: "padded" },
  args: {
    horizontal: "end",
    vertical: "top",
    label: undefined,
    icon: undefined,
    itemClassName: "",
  },
  argTypes: {
    horizontal: { control: "inline-radio", options: ["start", "center", "end"] },
    vertical: { control: "inline-radio", options: ["top", "middle", "bottom"] },
    icon: { control: "text" },
    label: { control: "text" },
    hidden: { control: "boolean" },
    offsetX: { control: "text" },
    offsetY: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<IndicatorProps>;

/** Badge numérico simple sobre un avatar */
export const OnAvatar: Story = {
  args: {
    label: <span className="badge error xs">9+</span>,
    children: <Avatar alt="user" />,
  },
};

/** Punto (dot) con solo ícono/forma */
export const Dot: Story = {
  args: {
    label: <span className="badge success xs p-1 rounded-full leading-none">&nbsp;</span>,
    horizontal: "end",
    vertical: "bottom",
    children: <Avatar alt="status" />,
  },
};

/** Usando icono por nombre (tu fuente Icons-Font) */
export const WithIconGlyph: Story = {
  args: {
    icon: "notifications",
    itemClassName: "rounded-full bg-warning text-warning-content p-1! text-xs",
    children: <Button>Inbox</Button>,
  },
};

/** Diferentes posiciones alrededor de un botón */
export const PositionsGrid: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6">
      <Indicator
        {...args}
        horizontal="start"
        vertical="top"
        label={<span className="badge info xs">1</span>}
      >
        <Button>start/top</Button>
      </Indicator>
      <Indicator
        {...args}
        horizontal="center"
        vertical="top"
        label={<span className="badge info xs">2</span>}
      >
        <Button>center/top</Button>
      </Indicator>
      <Indicator
        {...args}
        horizontal="end"
        vertical="top"
        label={<span className="badge info xs">3</span>}
      >
        <Button>end/top</Button>
      </Indicator>

      <Indicator
        {...args}
        horizontal="start"
        vertical="middle"
        label={<span className="badge info xs">4</span>}
      >
        <Button>start/middle</Button>
      </Indicator>
      <Indicator
        {...args}
        horizontal="center"
        vertical="middle"
        label={<span className="badge info xs">5</span>}
      >
        <Button>center/middle</Button>
      </Indicator>
      <Indicator
        {...args}
        horizontal="end"
        vertical="middle"
        label={<span className="badge info xs">6</span>}
      >
        <Button>end/middle</Button>
      </Indicator>

      <Indicator
        {...args}
        horizontal="start"
        vertical="bottom"
        label={<span className="badge info xs">7</span>}
      >
        <Button>start/bottom</Button>
      </Indicator>
      <Indicator
        {...args}
        horizontal="center"
        vertical="bottom"
        label={<span className="badge info xs">8</span>}
      >
        <Button>center/bottom</Button>
      </Indicator>
      <Indicator
        {...args}
        horizontal="end"
        vertical="bottom"
        label={<span className="badge info xs">9</span>}
      >
        <Button>end/bottom</Button>
      </Indicator>
    </div>
  ),
};

/** Ajuste fino con offsets (usa las CSS vars --indicator-x / --indicator-y) */
export const WithOffsets: Story = {
  args: {
    label: <span className="badge accent xs">!</span>,
    offsetX: "calc(50% + 4px)",
    offsetY: "calc(-50% - 4px)",
    children: <Button>Offset +4/-4</Button>,
  },
};

/** Oculto/mostrado (útil para condicionales sin desmontar) */
export const ToggleHidden: Story = {
  render: () => {
    const [hidden, setHidden] = React.useState(false);
    return (
      <div className="flex items-center gap-4">
        <Indicator
          hidden={hidden}
          icon="mail"
          itemClassName="bg-primary text-primary-content p-1! rounded-full text-xs"
        >
          <Button>Inbox</Button>
        </Indicator>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
          />
          Hidden
        </label>
      </div>
    );
  },
};
