import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Input from "../Input";

const meta: Meta = {
  title: "Components/Validator",
  args: {
    hint: "Por favor revisa este campo",
  },
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj;

export const RequiredInput: Story = {
  name: "Input requerido (:user-invalid)",
  render: (args) => (
    <form className="space-y-4">
      <Input
        placeholder={"Email (required)"}
        type="email"
        containerClassName={"validator"}
        required
      />
      <p className="validator-hint">Must be correct email</p>
      <p className="text-sm opacity-70">
        Borra/abandona el campo para ver el estado inválido del navegador.
      </p>
    </form>
  ),
};
