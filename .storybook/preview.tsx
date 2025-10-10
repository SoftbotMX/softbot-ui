import type { Preview } from "@storybook/react";
import "../src/main.css";
import { ThemeProvider, type Theme } from "../src/components/Theme";

export const globalTypes = {
  theme: {
    name: "Softbot UI",
    description: "Softbot UI theme & components",
    defaultValue: "light",
    toolbar: {
      icon: "mirror",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const current = (context.globals.theme ?? "light") as Theme;
      return (
        <ThemeProvider value={current}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    layout: "centered",
    a11y: {
      context: "body",
      config: {},
      options: {},
    },
    globals: {
      a11y: {
        manual: true,
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
