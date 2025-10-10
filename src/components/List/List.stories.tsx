import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import List from "./index";
import Avatar from "../Avatar";
import Badge from "../Badge";

const meta: Meta<typeof List> = {
  title: "Core/List",
  component: List,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof List>;

const Muted = ({ children }: { children: React.ReactNode }) => (
  <span className="opacity-70 text-sm">{children}</span>
);

export const Basic: Story = {
  render: () => (
    <List>
      <List.Row>
        <List.Col>
          <Avatar />
        </List.Col>
        <List.Col grow>
          <div className="font-semibold">Jane Cooper</div>
          <Muted>Product Manager · NYC</Muted>
        </List.Col>
      </List.Row>

      <List.Row>
        <List.Col>
          <Avatar placeholder="JS" />
        </List.Col>
        <List.Col grow>
          <div className="font-semibold">John Smith</div>
          <Muted>Engineering · Remote</Muted>
        </List.Col>
      </List.Row>
    </List>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <List>
      <List.Row>
        <List.Col>
          <span className="icon-symbols">folder</span>
        </List.Col>
        <List.Col grow>
          <div className="font-medium">Quarterly Report.pdf</div>
          <Muted>Updated 2 days ago · 1.2 MB</Muted>
        </List.Col>
        <List.Col>
          <div className="flex items-center gap-2">
            <button className="btn btn-xs">Open</button>
            <button className="btn btn-xs btn-ghost">More</button>
          </div>
        </List.Col>
      </List.Row>

      <List.Row>
        <List.Col>
          <span className="icon-symbols">image</span>
        </List.Col>
        <List.Col grow>
          <div className="font-medium">Team Portrait.png</div>
          <Muted>Updated 1 hour ago · 640 KB</Muted>
        </List.Col>
        <List.Col>
          <Badge children="public" tone={"neutral"} />
        </List.Col>
      </List.Row>
    </List>
  ),
};

export const WithWrap: Story = {
  render: () => (
    <List className="max-w-2xl">
      <List.Row>
        <List.Col>
          <span className="icon-symbols">assignment</span>
        </List.Col>
        <List.Col grow>
          <div className="font-semibold">Design Guidelines v3</div>
        </List.Col>
        <List.Col>
          <Badge children="draft" tone={"neutral"} />
        </List.Col>
        <List.Col wrap className="col-span-full">
          <Muted>
            This document describes component states, spacing rules, color ramps and token usage
            across themes.
          </Muted>
        </List.Col>
      </List.Row>
    </List>
  ),
};

export const ManyRows: Story = {
  render: () => (
    <List>
      {Array.from({ length: 6 }).map((_, i) => (
        <List.Row key={i}>
          <List.Col>
            <span className="icon-symbols">article</span>
          </List.Col>
          <List.Col grow>
            <div className="font-medium">Post #{i + 1}</div>
            <Muted>Subtitle or metadata here</Muted>
          </List.Col>
          <List.Col>
            <button className="btn btn-xs btn-ghost">Edit</button>
          </List.Col>
        </List.Row>
      ))}
    </List>
  ),
};
