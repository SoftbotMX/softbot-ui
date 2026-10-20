import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent, within } from "storybook/test";

import Modal, { type ModalProps } from "./index";

const meta: Meta<ModalProps> = {
  title: "Core/Modal",
  component: Modal,
  args: {
    position: "middle",
    defaultOpen: false,
    closeOnBackdrop: true,
    closeOnEsc: true,
    title: "Dialog title",
    children: (
      <p className="text-sm">
        Contenido del modal. Usa <code>.modal-box</code> por estilo base.
      </p>
    ),
    actions: (
      <>
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Confirm</button>
      </>
    ),
  },
  argTypes: {
    position: {
      control: "inline-radio",
      options: ["top", "middle", "bottom", "start", "end"],
    },
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<ModalProps>;

export const Uncontrolled: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <button className="btn" onClick={() => setOpen(true)}>
          Abrir modal
        </button>
        <Modal {...args} open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};

export const Positions: Story = {
  render: () => {
    const Demo = ({ position }: { position: ModalProps["position"] }) => {
      const [open, setOpen] = React.useState(false);
      return (
        <div className="flex items-center gap-3">
          <button className="btn btn-outline" onClick={() => setOpen(true)}>
            {position}
          </button>
          <Modal
            open={open}
            onOpenChange={setOpen}
            position={position}
            title={`Modal ${position}`}
            actions={
              <>
                <button className="btn btn-ghost" onClick={() => setOpen(false)}>
                  Close
                </button>
                <button className="btn btn-primary">Do it</button>
              </>
            }
          >
            <p className="text-sm">Ejemplo en posición <b>{position}</b>.</p>
          </Modal>
        </div>
      );
    };

    return (
      <div className="flex flex-wrap gap-6">
        <Demo position="top" />
        <Demo position="middle" />
        <Demo position="bottom" />
        <Demo position="start" />
        <Demo position="end" />
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={open}
            onChange={(e) => setOpen(e.target.checked)}
          />
          <span>open</span>
        </label>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Controlado desde fuera"
          actions={
            <button className="btn btn-primary" onClick={() => setOpen(false)}>
              Cerrar
            </button>
          }
        >
          <p className="text-sm">Este modal está controlado por el checkbox.</p>
        </Modal>
      </div>
    );
  },
};

export const NoBackdropCloseOrEsc: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <button className="btn" onClick={() => setOpen(true)}>
          Abrir
        </button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          closeOnBackdrop={false}
          closeOnEsc={false}
          title="Sin cerrar con backdrop ni Esc"
          actions={
            <button className="btn btn-primary" onClick={() => setOpen(false)}>
              Cerrar
            </button>
          }
        >
          <p className="text-sm">
            Aquí sólo puedes cerrar con el botón de acción.
          </p>
        </Modal>
      </div>
    );
  },
};

export const CustomBoxSize: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <button className="btn" onClick={() => setOpen(true)}>
          Abrir ancho custom
        </button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          position="middle"
          boxClassName="w-[48rem] max-w-[90vw]"
          title="Caja ancha"
          actions={<button className="btn" onClick={() => setOpen(false)}>Ok</button>}
        >
          <p>
            Puedes pasar <code>boxClassName</code> para controlar el tamaño de <code>.modal-box</code>.
          </p>
        </Modal>
      </div>
    );
  },
};

function TecladoDemo(args: ModalProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <button className="btn" onClick={() => setOpen(true)}>
        Abrir modal
      </button>
      <button className="btn btn-ghost">Botón de fondo</button>
      <Modal
        {...args}
        title="Redes de la cabecera"
        open={open}
        onOpenChange={setOpen}
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary">Guardar</button>
          </>
        }
      >
        <input className="input" aria-label="Copy" placeholder="Copy de la publicación" />
      </Modal>
    </div>
  );
}

/** Teclado: el foco entra al abrir, Tab no sale de la caja y al cerrar vuelve al disparador (issue #9). */
export const Teclado: Story = {
  render: (args) => <TecladoDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const abrir = canvas.getByRole("button", { name: "Abrir modal" });
    await userEvent.click(abrir);
    const dialogo = canvas.getByRole("dialog", { name: "Redes de la cabecera" });
    await expect(canvas.getByRole("textbox", { name: "Copy" })).toHaveFocus();
    for (let i = 0; i < 4; i++) await userEvent.tab();
    await expect(dialogo).toContainElement(canvasElement.ownerDocument.activeElement as HTMLElement);
    await userEvent.keyboard("{Escape}");
    await expect(abrir).toHaveFocus();
  },
};
