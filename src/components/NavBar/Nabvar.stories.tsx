import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import Navbar from "./index";

// Si ya tienes Button/Input, úsalos.
// Aquí asumo que existen: Button (btn), Input (input)
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: string }) => (
  <button className={`btn ${props.tone ? `btn-${props.tone}` : ""}`} {...props} />
);

const Input = (
  props: React.InputHTMLAttributes<HTMLInputElement> & { tone?: string; size?: string },
) => (
  <label className="input">
    <input {...props} className="w-full bg-transparent outline-hidden" />
  </label>
);

const meta: Meta<typeof Navbar> = {
  title: "Core/Navbar",
  component: Navbar,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Navbar>;

export const Basic: Story = {
  render: () => (
    <Navbar className="bg-base-100 rounded-box shadow">
      <Navbar.Start>
        <Button className="btn-ghost">☰</Button>
        <span className="font-semibold ms-2">Acme</span>
      </Navbar.Start>

      <Navbar.Center>
        <span className="text-sm opacity-70">Center content</span>
      </Navbar.Center>

      <Navbar.End>
        <Button className="btn-ghost">Login</Button>
        <Button className="ms-2 btn-primary">Sign up</Button>
      </Navbar.End>
    </Navbar>
  ),
};

export const WithSearch: Story = {
  render: () => (
    <Navbar className="bg-base-100 rounded-box shadow">
      <Navbar.Start className={"w-full"}>
        <span className="icon-symbols">menu</span>
        <span className="font-semibold ms-2">Softbot UI</span>
      </Navbar.Start>

      <Navbar.Center className="mx-4">
        <Input placeholder="Search…" />
      </Navbar.Center>

      <Navbar.End>
        <button className="btn btn-ghost">
          <span className="icon-symbols">notifications</span>
        </button>
        <button className="btn btn-ghost">
          <span className="icon-symbols">account_circle</span>
        </button>
      </Navbar.End>
    </Navbar>
  ),
};

export const StickyTop: Story = {
  render: () => (
    <div className="h-[200vh]">
      <Navbar className="bg-base-100 shadow fixed top-0 inset-x-0 z-50">
        <Navbar.Start>
          <span className="font-semibold">Sticky</span>
        </Navbar.Start>
        <Navbar.Center>
          <span className="opacity-70">Scroll down</span>
        </Navbar.Center>
        <Navbar.End>
          <button className="btn btn-primary">Action</button>
        </Navbar.End>
      </Navbar>
      {/* Placeholder para ver el sticky */}
      <div className="pt-24 p-4">
        <p>
          Contenido de página para probar el comportamiento fijo (usa <code>fixed top-0</code> en la
          navbar).
        </p>
      </div>
    </div>
  ),
};

export const Dense: Story = {
  render: () => (
    <Navbar className="bg-base-100 rounded-box shadow min-h-12 px-2">
      <Navbar.Start>
        <span className="font-semibold">Dense</span>
      </Navbar.Start>
      <Navbar.Center>
        <nav className="menu menu-horizontal">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Docs</a>
          </li>
          <li>
            <a>Blog</a>
          </li>
        </nav>
      </Navbar.Center>
      <Navbar.End>
        <button className="btn btn-sm btn-ghost">Theme</button>
      </Navbar.End>
    </Navbar>
  ),
};
