# Pazaryeri - Marketplace Frontend

[Türkçe](#türkçe) | [English](#english)

---

# Türkçe

Modern, ölçeklenebilir bir pazaryeri frontend uygulaması. Next.js 16+, TypeScript ve Clean Architecture prensipleri ile geliştirilmiştir.

## Kurulum & Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# http://localhost:3000 adresini aç

# Production build
npm run build
npm start

# Testleri çalıştır
npm test

# Storybook'u başlat
npm run storybook

# Lint kontrolü
npm run lint

# Kod formatlama
npm run format
```

## Teknoloji Stack'i

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| Next.js | 16.1.1 | App Router ile React framework |
| TypeScript | 5.x | Tip güvenliği (strict mode) |
| Tailwind CSS | 4.x | Utility-first styling |
| Zustand | 5.x | State yönetimi (Slice Pattern) |
| React Query | 5.x | Data fetching & caching |
| Framer Motion | 12.x | Animasyonlar |
| Axios | 1.x | HTTP client |
| Jest | 29.x | Unit testing |
| Storybook | 8.x | Component geliştirme |

## Proje Mimarisi

### Clean Architecture Katmanları

```
src/
├── core/                       # Domain Katmanı (İş Mantığı)
│   ├── domain/
│   │   ├── entities/           # İş varlıkları (Product, Category, Cart)
│   │   └── value-objects/      # Değişmez değerler (Money, Slug)
│   ├── ports/
│   │   ├── repositories/       # Repository arayüzleri (DIP)
│   │   └── services/           # Service arayüzleri
│   └── use-cases/              # Uygulama iş mantığı
│
├── infrastructure/             # Altyapı Katmanı (Adapter'lar)
│   ├── api/                    # API client & endpoint'ler
│   ├── adapters/               # DTO → Entity dönüştürücüler
│   └── repositories/           # Repository implementasyonları
│
├── presentation/               # Sunum Katmanı (UI)
│   ├── components/             # Atomic Design bileşenleri
│   │   ├── atoms/              # Button, Input, Badge, Icon, Typography
│   │   ├── molecules/          # ProductCard, PriceDisplay, SearchBar
│   │   ├── organisms/          # Header, Footer, ProductGrid
│   │   └── templates/          # MainLayout
│   ├── hooks/                  # Custom React hook'ları
│   └── providers/              # Context & DI provider'ları
│
├── store/                      # Zustand state yönetimi
│   └── slices/                 # Modüler slice'lar
│
├── app/                        # Next.js App Router
│   └── [lang]/                 # i18n routing (tr/en)
│
└── i18n/                       # Çoklu dil desteği
    └── locales/                # tr.json, en.json
```

### Uygulanan SOLID Prensipleri

| Prensip | Uygulama |
|---------|----------|
| **SRP** | Her modül tek bir sorumluluğa sahip (Repository, Adapter, UseCase) |
| **OCP** | Arayüzler üzerinden genişlemeye açık, değişime kapalı |
| **LSP** | Repository implementasyonları birbirinin yerine kullanılabilir |
| **ISP** | Küçük, odaklanmış arayüzler (IProductRepository, ICategoryRepository) |
| **DIP** | Üst seviye modüller soyutlamalara bağımlı |

### Kullanılan Design Pattern'lar

| Pattern | Kullanım Alanı |
|---------|----------------|
| **Repository** | Veri erişim soyutlaması |
| **Adapter** | DTO → Entity dönüşümü |
| **Factory** | Service container oluşturma |
| **Slice** | Modüler Zustand state |
| **Atomic Design** | Bileşen hiyerarşisi |

## Rendering Stratejileri

| Sayfa | Strateji | Revalidation | Neden |
|-------|----------|--------------|-------|
| Anasayfa | SSG + ISR | 60 saniye | Sık değişen kampanyalar, SEO kritik |
| Ürün Listesi | SSR | Gerçek zamanlı | Dinamik filtre/sıralama |
| Ürün Detay | SSG + ISR | 300 saniye | SEO kritik, nadiren değişir |
| Kategoriler | SSG + ISR | 600 saniye | Statik yapı |
| Sepet | CSR | - | Kullanıcıya özel, SEO gereksiz |
| Favoriler | CSR | - | Kullanıcıya özel |

## State Yönetimi

Zustand ile **Slice Pattern** kullanılarak modüler, test edilebilir state yapısı:

| Slice | Amaç | Persist |
|-------|------|---------|
| `favoritesSlice` | Favori ürünler | ✅ localStorage |
| `cartSlice` | Alışveriş sepeti | ✅ localStorage |
| `uiSlice` | Tema, modal, toast | ✅ Tema |
| `authSlice` | Kullanıcı kimlik doğrulama | ❌ |

## SEO & Erişilebilirlik

### SEO Özellikleri
- ✅ Dinamik metadata (sayfa bazlı)
- ✅ OpenGraph & Twitter Card
- ✅ JSON-LD schema (Product, WebSite)
- ✅ sitemap.xml (otomatik)
- ✅ robots.txt
- ✅ Canonical URL'ler
- ✅ Hreflang (tr/en)

### Erişilebilirlik (a11y)
- ✅ Semantik HTML
- ✅ ARIA etiketleri
- ✅ Klavye navigasyonu
- ✅ Focus yönetimi
- ✅ Renk kontrastı

## Varsayımlar & Trade-off'lar

### Mimari Kararlar

| Karar | Alternatif | Neden Bu Tercih |
|-------|------------|-----------------|
| Zustand | Redux, Jotai | Basit API, az boilerplate, bu ölçek için yeterli |
| React Query | SWR, RTK Query | Otomatik cache, background refetch, mutation desteği |
| Clean Architecture | Basit yapı | Başlangıç karmaşıklığı, uzun vadede bakım kolaylığı |
| Atomic Design | Düz yapı | Tutarlı, yeniden kullanılabilir bileşen kütüphanesi |
| URL-based i18n | Cookie/Header | SEO dostu, paylaşılabilir linkler |
| Tailwind CSS | CSS Modules, styled-components | Hızlı geliştirme, tutarlı tasarım sistemi |

### Bilinçli Trade-off'lar

1. **Karmaşıklık vs Ölçeklenebilirlik**: Clean Architecture başlangıçta daha fazla dosya ve katman gerektiriyor, ancak proje büyüdükçe bakım kolaylığı sağlıyor.

2. **Bundle Size vs DX**: Framer Motion ve bazı kütüphaneler bundle size'ı artırıyor, ancak geliştirici deneyimini iyileştiriyor.

3. **SSR vs CSR**: Sepet ve favoriler CSR olarak bırakıldı çünkü kullanıcıya özel veriler ve SEO gereksiz.

4. **API Proxy**: CORS sorunları için API proxy kullanılabilir, şu an direkt API çağrısı yapılıyor.

## Test Stratejisi

```bash
# Tüm testleri çalıştır
npm test

# Watch modunda
npm run test:watch

# Coverage raporu
npm run test:coverage
```

### Test Kapsamı
- ✅ Value Objects (Money)
- ✅ Store Slices (cartSlice)
- 📋 Components (Storybook ile görsel test)

## Storybook

```bash
npm run storybook
# http://localhost:6006
```

### Mevcut Story'ler
- **Atoms**: Button, Input, Badge, Icon, Typography, Spinner
- **Molecules**: ProductCard, PriceDisplay
- **Organisms**: Header

---

# English

A modern, scalable marketplace frontend application built with Next.js 16+, TypeScript, and Clean Architecture principles.

## Setup & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000

# Production build
npm run build
npm start

# Run tests
npm test

# Start Storybook
npm run storybook

# Lint check
npm run lint

# Format code
npm run format
```

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework with App Router |
| TypeScript | 5.x | Type safety (strict mode) |
| Tailwind CSS | 4.x | Utility-first styling |
| Zustand | 5.x | State management (Slice Pattern) |
| React Query | 5.x | Data fetching & caching |
| Framer Motion | 12.x | Animations |
| Axios | 1.x | HTTP client |
| Jest | 29.x | Unit testing |
| Storybook | 8.x | Component development |

## Project Architecture

### Clean Architecture Layers

```
src/
├── core/                       # Domain Layer (Business Logic)
│   ├── domain/
│   │   ├── entities/           # Business entities (Product, Category, Cart)
│   │   └── value-objects/      # Immutable values (Money, Slug)
│   ├── ports/
│   │   ├── repositories/       # Repository interfaces (DIP)
│   │   └── services/           # Service interfaces
│   └── use-cases/              # Application business logic
│
├── infrastructure/             # Infrastructure Layer (Adapters)
│   ├── api/                    # API client & endpoints
│   ├── adapters/               # DTO → Entity transformers
│   └── repositories/           # Repository implementations
│
├── presentation/               # Presentation Layer (UI)
│   ├── components/             # Atomic Design components
│   │   ├── atoms/              # Button, Input, Badge, Icon, Typography
│   │   ├── molecules/          # ProductCard, PriceDisplay, SearchBar
│   │   ├── organisms/          # Header, Footer, ProductGrid
│   │   └── templates/          # MainLayout
│   ├── hooks/                  # Custom React hooks
│   └── providers/              # Context & DI providers
│
├── store/                      # Zustand state management
│   └── slices/                 # Modular slices
│
├── app/                        # Next.js App Router
│   └── [lang]/                 # i18n routing (tr/en)
│
└── i18n/                       # Internationalization
    └── locales/                # tr.json, en.json
```

### Applied SOLID Principles

| Principle | Application |
|-----------|-------------|
| **SRP** | Each module has single responsibility (Repository, Adapter, UseCase) |
| **OCP** | Open for extension through interfaces, closed for modification |
| **LSP** | Repository implementations are interchangeable |
| **ISP** | Small, focused interfaces (IProductRepository, ICategoryRepository) |
| **DIP** | High-level modules depend on abstractions |

### Design Patterns Used

| Pattern | Usage Area |
|---------|------------|
| **Repository** | Data access abstraction |
| **Adapter** | DTO → Entity transformation |
| **Factory** | Service container creation |
| **Slice** | Modular Zustand state |
| **Atomic Design** | Component hierarchy |

## Rendering Strategies

| Page | Strategy | Revalidation | Reason |
|------|----------|--------------|--------|
| Homepage | SSG + ISR | 60 seconds | Frequently changing campaigns, SEO critical |
| Product List | SSR | Real-time | Dynamic filter/sort |
| Product Detail | SSG + ISR | 300 seconds | SEO critical, rarely changes |
| Categories | SSG + ISR | 600 seconds | Static structure |
| Cart | CSR | - | User-specific, no SEO needed |
| Favorites | CSR | - | User-specific |

## State Management

Modular, testable state structure using **Slice Pattern** with Zustand:

| Slice | Purpose | Persist |
|-------|---------|---------|
| `favoritesSlice` | Favorite products | ✅ localStorage |
| `cartSlice` | Shopping cart | ✅ localStorage |
| `uiSlice` | Theme, modal, toast | ✅ Theme only |
| `authSlice` | User authentication | ❌ |

## SEO & Accessibility

### SEO Features
- ✅ Dynamic metadata (page-based)
- ✅ OpenGraph & Twitter Card
- ✅ JSON-LD schema (Product, WebSite)
- ✅ sitemap.xml (automatic)
- ✅ robots.txt
- ✅ Canonical URLs
- ✅ Hreflang (tr/en)

### Accessibility (a11y)
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Color contrast

## Assumptions & Trade-offs

### Architectural Decisions

| Decision | Alternative | Why This Choice |
|----------|-------------|-----------------|
| Zustand | Redux, Jotai | Simple API, less boilerplate, sufficient for this scale |
| React Query | SWR, RTK Query | Auto caching, background refetch, mutation support |
| Clean Architecture | Simple structure | Initial complexity, long-term maintainability |
| Atomic Design | Flat structure | Consistent, reusable component library |
| URL-based i18n | Cookie/Header | SEO friendly, shareable links |
| Tailwind CSS | CSS Modules, styled-components | Fast development, consistent design system |

### Conscious Trade-offs

1. **Complexity vs Scalability**: Clean Architecture requires more files and layers initially, but provides maintainability as the project grows.

2. **Bundle Size vs DX**: Framer Motion and some libraries increase bundle size, but improve developer experience.

3. **SSR vs CSR**: Cart and favorites are left as CSR because they contain user-specific data and don't need SEO.

4. **API Proxy**: API proxy can be used for CORS issues, currently making direct API calls.

## Testing Strategy

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage
- ✅ Value Objects (Money)
- ✅ Store Slices (cartSlice)
- 📋 Components (Visual testing with Storybook)

## Storybook

```bash
npm run storybook
# http://localhost:6006
```

### Available Stories
- **Atoms**: Button, Input, Badge, Icon, Typography, Spinner
- **Molecules**: ProductCard, PriceDisplay
- **Organisms**: Header

---

## API Integration

Connected to Meshur API (`https://api.meshur.co/api`):

| Endpoint | Purpose |
|----------|---------|
| `GET /products` | Product list |
| `GET /products/slug/{slug}` | Product detail |
| `GET /categories` | Category list (tree) |
| `GET /categories/slug/{slug}` | Category detail |

---

## License / Lisans

MIT
