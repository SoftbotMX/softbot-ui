import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import EditorClasico, { type EditorClasicoProps } from "./index";

const NOTA = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "CIUDAD VICTORIA, TAM.-" },
        { type: "text", text: " La Auditoría turnó ante la justicia nueve cuentas públicas." },
      ],
    },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "¿Qué sigue?" }] },
    {
      type: "blockquote",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "«Se revisarán los municipios con mayor presupuesto», dijo." }] },
      ],
    },
    {
      type: "bulletList",
      content: ["Reynosa", "Matamoros", "Nuevo Laredo"].map((t) => ({
        type: "listItem",
        content: [{ type: "paragraph", content: [{ type: "text", text: t }] }],
      })),
    },
    {
      type: "paragraph",
      attrs: { tamano: "0.875em" },
      content: [{ type: "text", text: "Con información de la ASE." }],
    },
  ],
};

const meta: Meta<EditorClasicoProps> = {
  title: "Forms/EditorClasico",
  component: EditorClasico,
  args: { etiqueta: "Cuerpo de la nota", contenido: NOTA },
  decorators: [(S) => <div className="max-w-3xl"><S /></div>],
};
export default meta;

type Story = StoryObj<EditorClasicoProps>;

export const Nota: Story = {};

export const Vacio: Story = { args: { contenido: undefined } };

export const SoloLectura: Story = { args: { soloLectura: true } };
