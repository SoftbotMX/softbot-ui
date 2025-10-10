import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Menu from "./index";

const meta: Meta<typeof Menu> = {
  title: "Core/Menu",
  component: Menu,
  args: {
    position: "left",
    menu: [
      {
        options: [
          {
            icon: "home",
            link: "/",
            title: "Pleno",
          },
          {
            icon: "event_seat",
            link: "/seats",
            title: "Asientos",
          },
        ],
        section: "Dashboard",
      },
      {
        options: {
          title: "Configuración inicial",
          options: [
            {
              icon: "smart_card_reader",
              link: "/terminals",
              title: "Terminales",
            },
            {
              icon: "network_node",
              link: "/switches",
              title: "Switches",
            },
            {
              icon: "event_seat",
              link: "/audio_interfaces",
              title: "Interfaz Audio",
            },
          ],
        },
        isSubmenu: true,
        section: "Catálogos",
      },
    ],
    navigation: () => undefined,
  },
  argTypes: {
    position: { control: "inline-radio", options: ["left", "right"] },
  },
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const VerticalBasic: Story = {
  render: (args) => <Menu {...args} />,
};
