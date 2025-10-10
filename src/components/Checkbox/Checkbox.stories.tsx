import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Checkbox, { type CheckboxProps } from './index';

const meta: Meta<CheckboxProps> = {
  title: 'Core/Checkbox',
  component: Checkbox,
  args: {
    size: 'md',
  },
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<CheckboxProps>;

export const Default: Story = {
  args: { label: 'Accept terms' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Checkbox size="xs" label="XS" />
      <Checkbox size="sm" label="SM" />
      <Checkbox size="md" label="MD" />
      <Checkbox size="lg" label="LG" />
      <Checkbox size="xl" label="XL" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid gap-3">
      <Checkbox tone="primary"   label="Primary" />
      <Checkbox tone="secondary" label="Secondary" />
      <Checkbox tone="accent"    label="Accent" />
      <Checkbox tone="neutral"   label="Neutral" />
      <Checkbox tone="info"      label="Info" />
      <Checkbox tone="success"   label="Success" />
      <Checkbox tone="warning"   label="Warning" />
      <Checkbox tone="error"     label="Error" />
    </div>
  ),
};

export const IndeterminateControlled: Story = {
  render: () => <TriStateDemo />,
};

function TriStateDemo() {
  const [state, setState] = React.useState<boolean | 'indeterminate'>('indeterminate');
  const cycle = () => setState((s) => (s === 'indeterminate' ? true : s ? false : 'indeterminate'));

  return (
    <div className="flex items-center gap-4">
      <Checkbox
        checked={state}
        onCheckedChange={setState}
        label={<span>State: <code>{String(state)}</code></span>}
      />
      <button className="btn btn-soft" onClick={cycle}>Cycle state</button>
    </div>
  );
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled defaultChecked label="Checked disabled" />
    </div>
  ),
};
