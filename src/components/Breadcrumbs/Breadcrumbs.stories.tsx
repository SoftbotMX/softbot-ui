import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Breadcrumbs, { type BreadcrumbsProps } from './index';

const meta: Meta<BreadcrumbsProps> = {
  title: 'Core/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    size: 'sm',
    items: [
      { label: 'Home', href: '#' },
      { label: 'Documents', href: '#' },
      { label: 'Add Document' },
    ],
  },
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<BreadcrumbsProps>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', href: '#', icon: 'home' },
      { label: 'Documents', href: '#', icon: 'folder' },
      { label: 'Add Document', icon: 'add' },
    ],
  },
};

export const MaxWidth: Story = {
  args: {
    maxWidthClass: 'max-w-xs',
    items: [
      { label: 'Long text 1', href: '#' },
      { label: 'Long text 2', href: '#' },
      { label: 'Long text 3', href: '#' },
      { label: 'Long text 4', href: '#' },
      { label: 'Long text 5' },
    ],
  },
};

export const OrderedList: Story = {
  args: {
    as: 'ol',
    items: [
      { label: 'Step 1', href: '#' },
      { label: 'Step 2', href: '#' },
      { label: 'Step 3' },
    ],
  },
};
