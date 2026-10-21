import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Textarea from "../Textarea";
import SelectorDeEmoji, { type SelectorDeEmojiProps } from "./index";

const meta: Meta<SelectorDeEmojiProps> = {
  title: "Forms/SelectorDeEmoji",
  component: SelectorDeEmoji,
  args: { onElegir: () => {} },
};
export default meta;

type Story = StoryObj<SelectorDeEmojiProps>;

export const Basico: Story = {};

/** Junto a un copy: el emoji entra donde está el cursor. */
export const EnUnCopy: Story = {
  render: () => {
    const [texto, setTexto] = React.useState("Habrá agua en tres colonias del Mante ");
    return (
      <div className="flex max-w-xl items-start gap-2">
        <Textarea id="copy-de-ejemplo" rows={3} value={texto} onChange={(e) => setTexto(e.target.value)} />
        <SelectorDeEmoji
          onElegir={(emoji) => {
            // El `Textarea` del kit no pasa su `ref`: se busca por su id.
            const el = document.getElementById("copy-de-ejemplo") as HTMLTextAreaElement | null;
            const i = el?.selectionStart ?? texto.length;
            const f = el?.selectionEnd ?? texto.length;
            setTexto(texto.slice(0, i) + emoji + texto.slice(f));
          }}
        />
      </div>
    );
  },
};
