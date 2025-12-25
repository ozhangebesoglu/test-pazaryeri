import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const mockCategories = [
  { id: '1', name: 'Elektronik', slug: 'elektronik' },
  { id: '2', name: 'Moda', slug: 'moda' },
  { id: '3', name: 'Ev & Yaşam', slug: 'ev-yasam' },
  { id: '4', name: 'Kozmetik', slug: 'kozmetik' },
  { id: '5', name: 'Spor', slug: 'spor' },
  { id: '6', name: 'Kitap', slug: 'kitap' },
];

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    lang: {
      control: 'select',
      options: ['tr', 'en'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    lang: 'tr',
    categories: mockCategories,
  },
};

export const Turkish: Story = {
  args: {
    lang: 'tr',
    categories: mockCategories,
  },
};

export const English: Story = {
  args: {
    lang: 'en',
    categories: [
      { id: '1', name: 'Electronics', slug: 'electronics' },
      { id: '2', name: 'Fashion', slug: 'fashion' },
      { id: '3', name: 'Home & Living', slug: 'home-living' },
      { id: '4', name: 'Beauty', slug: 'beauty' },
      { id: '5', name: 'Sports', slug: 'sports' },
      { id: '6', name: 'Books', slug: 'books' },
    ],
  },
};

export const NoCategories: Story = {
  args: {
    lang: 'tr',
    categories: [],
  },
};

export const FewCategories: Story = {
  args: {
    lang: 'tr',
    categories: [
      { id: '1', name: 'Elektronik', slug: 'elektronik' },
      { id: '2', name: 'Moda', slug: 'moda' },
    ],
  },
};

export const ManyCategories: Story = {
  args: {
    lang: 'tr',
    categories: [
      { id: '1', name: 'Elektronik', slug: 'elektronik' },
      { id: '2', name: 'Moda', slug: 'moda' },
      { id: '3', name: 'Ev & Yaşam', slug: 'ev-yasam' },
      { id: '4', name: 'Kozmetik', slug: 'kozmetik' },
      { id: '5', name: 'Spor', slug: 'spor' },
      { id: '6', name: 'Kitap', slug: 'kitap' },
      { id: '7', name: 'Oyuncak', slug: 'oyuncak' },
      { id: '8', name: 'Otomotiv', slug: 'otomotiv' },
      { id: '9', name: 'Bahçe', slug: 'bahce' },
      { id: '10', name: 'Gıda', slug: 'gida' },
    ],
  },
};
