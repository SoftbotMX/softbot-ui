import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Tooltip, { type TooltipProps } from "./index";
import Button from "../Button";

const meta: Meta<TooltipProps> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    placement: "top",
    content: "Soy un tooltip ✨",
  },
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<TooltipProps>;

export const Basic: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <Tooltip {...args}>
        <Button>Hover</Button>
      </Tooltip>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Tooltip placement="top" content="Arriba">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip placement="bottom" content="Abajo">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip placement="left" content="Izquierda">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip placement="right" content="Derecha">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Tooltip content="Neutral" tone="neutral">
        <Button>Neutral</Button>
      </Tooltip>
      <Tooltip content="Primary" tone="primary">
        <Button>Primary</Button>
      </Tooltip>
      <Tooltip content="Secondary" tone="secondary">
        <Button>Secondary</Button>
      </Tooltip>
      <Tooltip content="Accent" tone="accent">
        <Button>Accent</Button>
      </Tooltip>
      <Tooltip content="Info" tone="info">
        <Button>Info</Button>
      </Tooltip>
      <Tooltip content="Success" tone="success">
        <Button>Success</Button>
      </Tooltip>
      <Tooltip content="Warning" tone="warning">
        <Button>Warning</Button>
      </Tooltip>
      <Tooltip content="Error" tone="error">
        <Button>Error</Button>
      </Tooltip>
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Tooltip
      placement="right"
      content={
        <div className="max-w-xs text-left">
          <strong className="block">Título</strong>
          <span className="opacity-90">
            Texto con <em>énfasis</em> y varias líneas para probar el tamaño máximo.
          </span>
        </div>
      }
    >
      <Button>Contenido rico</Button>
    </Tooltip>
  ),
};

export const ControlledOpen: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div className="flex items-center gap-4">
        <Tooltip open={open} content="Controlado (open=true)">
          <Button>Siempre visible</Button>
        </Tooltip>
        <Button look={"ghost"} onClick={() => setOpen((v) => !v)}>
          Toggle open
        </Button>
      </div>
    );
  },
};
