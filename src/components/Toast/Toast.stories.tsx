import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Toast, { type ToastItem } from "./index";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Basic: Story = {
  render: () => {
    const [items, setItems] = React.useState<ToastItem[]>([
      {
        id: "t1",
        title: "Guardado",
        description: "Se guardó correctamente",
        tone: "success",
        duration: 3000,
      },
      {
        id: "t2",
        title: "Atención",
        description: "Revisa los campos pendientes",
        tone: "warning",
      },
    ]);

    const push = (tone: ToastItem["tone"]) => {
      const id = Math.random().toString(36).slice(2);
      setItems((prev) => [
        ...prev,
        {
          id,
          title: tone?.toUpperCase(),
          description: "Mensaje de prueba",
          tone,
          duration: 2500,
        },
      ]);
    };

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <button className="btn btn-success" onClick={() => push("success")}>
            + Success
          </button>
          <button className="btn btn-info" onClick={() => push("info")}>
            + Info
          </button>
          <button className="btn btn-warning" onClick={() => push("warning")}>
            + Warning
          </button>
          <button className="btn btn-error" onClick={() => push("error")}>
            + Error
          </button>
        </div>

        <Toast
          items={items}
          onRemove={(id) => setItems((prev) => prev.filter((t) => t.id !== id))}
        />
      </div>
    );
  },
};

export const Positions: Story = {
  render: () => {
    const now = Date.now();
    const base: ToastItem = {
      id: "x",
      title: "Posición",
      description: "Puedes ubicarlo en 9 cuadrantes",
      tone: "neutral",
    };

    return (
      <>
        <Toast defaultItems={[{ ...base, id: "tl" }]} vertical="top" horizontal="start" />
        <Toast defaultItems={[{ ...base, id: "tc" }]} vertical="top" horizontal="center" />
        <Toast defaultItems={[{ ...base, id: "tr" }]} vertical="top" horizontal="end" />
        <Toast defaultItems={[{ ...base, id: "ml" }]} vertical="middle" horizontal="start" />
        <Toast defaultItems={[{ ...base, id: "mc" }]} vertical="middle" horizontal="center" />
        <Toast defaultItems={[{ ...base, id: "mr" }]} vertical="middle" horizontal="end" />
        <Toast defaultItems={[{ ...base, id: "bl" }]} vertical="bottom" horizontal="start" />
        <Toast defaultItems={[{ ...base, id: "bc" }]} vertical="bottom" horizontal="center" />
        <Toast defaultItems={[{ ...base, id: "br" }]} vertical="bottom" horizontal="end" />
      </>
    );
  },
};

export const CustomContent: Story = {
  args: {
    vertical: "top",
    horizontal: "end",
    defaultItems: [
      {
        id: "c1",
        content: (
          <div className="flex items-center gap-3">
            <span className="status status-success" />
            <div>
              <div className="font-semibold">Mensaje con icono</div>
              <div className="text-sm opacity-80">Contenido personalizado</div>
            </div>
          </div>
        ),
        tone: "success",
        duration: 4000,
      },
    ],
  },
};
