import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Icon } from '../Icon/Icon';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

// States
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <Icon name="search" size="md" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Enter password',
    type: 'password',
    rightIcon: <Icon name="user" size="md" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search products...',
    leftIcon: <Icon name="search" size="md" />,
    rightIcon: <Icon name="close" size="sm" />,
  },
};

// Full width
export const FullWidth: Story = {
  args: {
    placeholder: 'Full width input',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <Input placeholder="email@example.com" type="email" fullWidth />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
        <Input placeholder="Enter password" type="password" fullWidth />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
        <Input
          placeholder="Search..."
          leftIcon={<Icon name="search" size="md" />}
          fullWidth
        />
      </div>
    </div>
  ),
};
