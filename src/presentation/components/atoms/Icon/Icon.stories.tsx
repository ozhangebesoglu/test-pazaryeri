import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconName } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'heart',
        'heartFilled',
        'cart',
        'search',
        'menu',
        'close',
        'home',
        'user',
        'chevronDown',
        'chevronRight',
        'chevronLeft',
        'star',
        'starFilled',
        'plus',
        'minus',
        'trash',
        'sun',
        'moon',
        'check',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'heart',
    size: 'md',
  },
};

export const AllIcons: Story = {
  render: () => {
    const iconNames: IconName[] = [
      'heart',
      'heartFilled',
      'cart',
      'search',
      'menu',
      'close',
      'home',
      'user',
      'chevronDown',
      'chevronRight',
      'chevronLeft',
      'star',
      'starFilled',
      'plus',
      'minus',
      'trash',
      'sun',
      'moon',
      'check',
    ];

    return (
      <div className="grid grid-cols-5 gap-4">
        {iconNames.map((name) => (
          <div key={name} className="flex flex-col items-center gap-2 p-4">
            <Icon name={name} size="lg" />
            <span className="text-xs text-gray-500">{name}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon name="heart" size="sm" />
        <span className="text-xs text-gray-500">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="heart" size="md" />
        <span className="text-xs text-gray-500">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="heart" size="lg" />
        <span className="text-xs text-gray-500">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="heart" size="xl" />
        <span className="text-xs text-gray-500">xl</span>
      </div>
    </div>
  ),
};

export const Colored: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon name="heart" size="lg" className="text-red-500" />
      <Icon name="star" size="lg" className="text-yellow-500" />
      <Icon name="check" size="lg" className="text-green-500" />
      <Icon name="cart" size="lg" className="text-blue-500" />
    </div>
  ),
};
