import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Label, { FloatingLabel } from "./index";
import Input from "../Input"; // ajusta la ruta si difiere

export default {
  title: "Core/Label",
} as Meta;

export const Basic: StoryObj = {
  render: () => (
    <div className="grid gap-3">
      <div className="grid gap-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="pwd">Password</Label>
        <Input id="pwd" type="password" placeholder="••••••••" />
      </div>
    </div>
  ),
};

export const InsideInputLeadingTrailing: StoryObj = {
  render: () => (
    <div className="grid gap-4">
      {/* Leading */}
      <div className="input input-md">
        <Label className="label" aria-hidden>
          +52
        </Label>
        <input className="grow" placeholder=" " />
      </div>

      {/* Trailing */}
      <div className="input input-md">
        <input className="grow" placeholder="Amount" type="number" />
        <Label className="label" aria-hidden>
          MXN
        </Label>
      </div>
    </div>
  ),
};

export const FloatingWithInputComponent: StoryObj = {
  render: () => (
    <div className="grid gap-6">
      <FloatingLabel
        label="Email"
        field={<Input type="email" size="md" /* placeholder se asegura automáticamente */ />}
      />

      <FloatingLabel label="Password" field={<Input type="password" size="md" />} />
    </div>
  ),
};

export const FloatingWithNativeInputs: StoryObj = {
  render: () => (
    <div className="grid gap-6">
      <FloatingLabel
        label="First name"
        field={<input className="input input-md grow bg-transparent" />}
      />

      <FloatingLabel
        label="Your message"
        field={<textarea className="textarea textarea-md w-full bg-transparent" />}
      />
    </div>
  ),
};

export const FloatingSizes: StoryObj = {
  render: () => (
    <div className="grid gap-6">
      <FloatingLabel label="XS" field={<Input size="xs" />} />
      <FloatingLabel label="SM" field={<Input size="sm" />} />
      <FloatingLabel label="MD" field={<Input size="md" />} />
      <FloatingLabel label="LG" field={<Input size="lg" />} />
      <FloatingLabel label="XL" field={<Input size="xl" placeholder={"XL"} />} />
    </div>
  ),
};

export const FloatingDisabled: StoryObj = {
  render: () => (
    <div className="grid gap-6">
      <FloatingLabel label="Disabled" field={<Input disabled />} />
    </div>
  ),
};
