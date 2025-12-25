import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';
import { ProductSummary } from '@/core/domain/entities/Product';

const mockProduct: ProductSummary = {
  id: 'product-1',
  slug: 'ornek-urun',
  name: 'Örnek Ürün - Premium Kalite Ürün Açıklaması',
  price: { amount: 299.99, currency: 'TRY' },
  originalPrice: { amount: 399.99, currency: 'TRY' },
  image: 'https://via.placeholder.com/400x400',
  rating: 4.5,
  reviewCount: 128,
  merchant: { id: 'merchant-1', name: 'Premium Mağaza' },
  stock: 50,
  isFeatured: false,
};

const meta: Meta<typeof ProductCard> = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
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
    onAddToCart: { action: 'addToCart' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    product: mockProduct,
    lang: 'tr',
  },
};

export const WithDiscount: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'İndirimli Ürün - Kaçırılmayacak Fırsat',
      price: { amount: 199.99, currency: 'TRY' },
      originalPrice: { amount: 399.99, currency: 'TRY' },
    },
    lang: 'tr',
  },
};

export const Featured: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Öne Çıkan Ürün',
      isFeatured: true,
    },
    lang: 'tr',
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Stokta Olmayan Ürün',
      stock: 0,
    },
    lang: 'tr',
  },
};

export const NoRating: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Yeni Ürün (Henüz Değerlendirilmemiş)',
      rating: 0,
      reviewCount: 0,
    },
    lang: 'tr',
  },
};

export const LongTitle: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Bu çok uzun bir ürün başlığı örneği - Premium kalite, yüksek performans, uygun fiyat garantisi ile sunulmaktadır',
    },
    lang: 'tr',
  },
};

export const English: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Sample Product - Premium Quality Item',
      merchant: { id: 'merchant-1', name: 'Premium Store' },
    },
    lang: 'en',
  },
};
