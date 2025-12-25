import type { Meta, StoryObj } from '@storybook/react';
import { PriceDisplay } from './PriceDisplay';

const meta: Meta<typeof PriceDisplay> = {
  title: 'Molecules/PriceDisplay',
  component: PriceDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriceDisplay>;

export const Default: Story = {
  args: {
    price: { amount: 299.99, currency: 'TRY' },
    size: 'md',
  },
};

export const WithDiscount: Story = {
  args: {
    price: { amount: 199.99, currency: 'TRY' },
    originalPrice: { amount: 399.99, currency: 'TRY' },
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    price: { amount: 99.99, currency: 'TRY' },
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    price: { amount: 1299.99, currency: 'TRY' },
    size: 'lg',
  },
};

export const LargeWithDiscount: Story = {
  args: {
    price: { amount: 999.99, currency: 'TRY' },
    originalPrice: { amount: 1499.99, currency: 'TRY' },
    size: 'lg',
  },
};

export const SmallWithDiscount: Story = {
  args: {
    price: { amount: 49.99, currency: 'TRY' },
    originalPrice: { amount: 79.99, currency: 'TRY' },
    size: 'sm',
  },
};

export const HighValue: Story = {
  args: {
    price: { amount: 12999.99, currency: 'TRY' },
    originalPrice: { amount: 15999.99, currency: 'TRY' },
    size: 'lg',
  },
};

export const ZeroPrice: Story = {
  args: {
    price: { amount: 0, currency: 'TRY' },
    size: 'md',
  },
};
