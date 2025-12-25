import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'lead', 'body', 'bodySmall', 'caption'],
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'success', 'warning', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Headings
export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Heading 3',
  },
};

export const Heading4: Story = {
  args: {
    variant: 'h4',
    children: 'Heading 4',
  },
};

export const Heading5: Story = {
  args: {
    variant: 'h5',
    children: 'Heading 5',
  },
};

export const Heading6: Story = {
  args: {
    variant: 'h6',
    children: 'Heading 6',
  },
};

// Body text
export const Lead: Story = {
  args: {
    variant: 'lead',
    children:
      'Lead text is larger and used for introductory content. It stands out from regular body text.',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children:
      'Body text is the default text style used throughout the application for regular content.',
  },
};

export const BodySmall: Story = {
  args: {
    variant: 'bodySmall',
    children: 'Body small text is used for less important information or fine print.',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'Caption text is the smallest and used for labels or metadata.',
  },
};

// Colors
export const ColorDefault: Story = {
  args: {
    variant: 'body',
    color: 'default',
    children: 'Default color text',
  },
};

export const ColorMuted: Story = {
  args: {
    variant: 'body',
    color: 'muted',
    children: 'Muted color text',
  },
};

export const ColorPrimary: Story = {
  args: {
    variant: 'body',
    color: 'primary',
    children: 'Primary color text',
  },
};

// Hierarchy
export const Hierarchy: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
      <Typography variant="lead">Lead paragraph text</Typography>
      <Typography variant="body">Body text for content</Typography>
      <Typography variant="bodySmall">Body small text</Typography>
      <Typography variant="caption">Caption text</Typography>
    </div>
  ),
};
