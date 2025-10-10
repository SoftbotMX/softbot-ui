import type { Meta, StoryObj } from "@storybook/react";

import Timeline from "./index";

const meta: Meta<typeof Timeline> = {
  title: "Components/Timeline",
  component: Timeline,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const HorizontalBasic: Story = {
  args: {
    orientation: "horizontal",
    items: [
      {
        startBox: true,
        start: (
          <>
            <h3 className="font-bold">Pedido creado</h3>
            <p className="text-sm opacity-70">2025-03-01 09:10</p>
          </>
        ),
        iconTone: "primary",
      },
      {
        startBox: true,
        start: (
          <>
            <h3 className="font-bold">Pagado</h3>
            <p className="text-sm opacity-70">2025-03-01 09:12</p>
          </>
        ),
        iconTone: "success",
      },
      {
        startBox: true,
        start: (
          <>
            <h3 className="font-bold">Enviado</h3>
            <p className="text-sm opacity-70">2025-03-01 14:33</p>
          </>
        ),
        iconTone: "info",
      },
    ],
  },
};

export const VerticalWithEnds: Story = {
  args: {
    orientation: "vertical",
    items: [
      {
        startBox: true,
        start: <p>Inicio del proceso</p>,
        iconTone: "neutral",
      },
      {
        middle: <span className="badge badge-primary">Build</span>,
        endBox: true,
        end: <p className="max-w-sm">Compilación en CI completada y artefactos publicados.</p>,
        iconTone: "primary",
      },
      {
        middle: <span className="badge badge-success">Deploy</span>,
        endBox: true,
        end: <p className="max-w-sm">Despliegue a producción exitoso.</p>,
        iconTone: "success",
      },
    ],
  },
};

export const CompactSnapIcon: Story = {
  args: {
    orientation: "horizontal",
    compact: true,
    snapIcon: true,
    items: [
      {
        start: <span className="text-sm opacity-70">07:45</span>,
        endBox: true,
        end: <p>Check-in</p>,
        iconTone: "accent",
        iconSize: "sm",
      },
      {
        start: <span className="text-sm opacity-70">08:00</span>,
        endBox: true,
        end: <p>Brief diario</p>,
        iconTone: "info",
        iconSize: "sm",
      },
      {
        start: <span className="text-sm opacity-70">10:30</span>,
        endBox: true,
        end: <p>Demo con cliente</p>,
        iconTone: "warning",
        iconSize: "sm",
      },
    ],
  },
};
