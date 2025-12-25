# Frontend Test Case – Pazaryeri

Bu çalışma, **Frontend Developer** pozisyonu için hazırlanmış teknik değerlendirme case’idir.  
Adaydan, **1 iş günü içerisinde**, üretim ortamı düşünülerek tasarlanmış, ölçeklenebilir ve okunabilir bir **pazaryeri frontend uygulaması** geliştirmesi beklenmektedir.

---

## 1. Genel Beklentiler

* Uygulama **Next.js 16 veya üzeri** sürüm ile geliştirilmelidir.
* Kod tabanı tamamen **TypeScript** olmalı, `strict` kurallar aktif edilmelidir.
* Backend tarafında **REST tabanlı bir API** bulunduğu varsayılmalıdır.
* API veri yapıları **https://api.meshur.co/docs** referans alınarak modellenmelidir.
* Kullanıcı deneyimi ve arayüz kararlarında **https://meshur.co/** referans alınmalıdır.

> Beklenti, yalnızca çalışan bir arayüz değil; **ileride büyüyebilecek, maintain edilebilir bir mimari** ortaya konulmasıdır.

---

## 2. Rendering, Data Fetching & Performans

* Sayfa bazında **SSR / SSG / ISR** stratejileri bilinçli şekilde seçilmelidir.
* Data fetching yaklaşımları ve tercih sebepleri net olmalıdır.
* Aşağıdaki performans iyileştirmeleri beklenmektedir:
  - `next/image` kullanımı
  - Route & component bazlı code splitting
  - Lazy loading
  - Memoization

---

## 3. Internationalization (i18n)

* Uygulama iki dili desteklemelidir:
  - Türkçe (`/tr`)
  - İngilizce (`/en`)
* Dil yönetimi URL tabanlı olmalıdır.
* Metinler merkezi bir i18n yapısı üzerinden yönetilmelidir.

---

## 4. State Management & Business Logic

* Global state yönetimi için **Zustand** kullanılmalıdır.
* Örnek işlevsellik:
  - Ürünleri favorilere ekleme / çıkarma
  - Favori listesinin global state üzerinden yönetilmesi
* State yapısı:
  - Normalize edilmiş
  - Ölçeklenebilir
  - Test edilebilir
olmalıdır.

---

## 5. UI, Stil & Component Mimarisi

* Stil altyapısı olarak **Tailwind CSS** tercih edilmelidir.
* UI bileşenleri **Storybook** kullanılarak oluşturulmalıdır.
* Component yapısı **Atomic Design prensiplerine** uygun olmalıdır.
* Dark mode desteği zorunludur.
* Animasyonlar için **Framer Motion** kullanımı artı değer olarak değerlendirilir.

---

## 6. Veri Yönetimi

* Gerçek bir CMS veya API varmış gibi:
  - Mock JSON dosyaları oluşturulmalı
  - Veri dönüşümleri (mapping, formatting) ayrı katmanlarda ele alınmalıdır
* Component’ler yalnızca ihtiyaç duydukları veriyi `props` aracılığıyla almalıdır.

---

## 7. SEO & Accessibility

* Sayfa bazlı:
  - Dynamic metadata
  - OpenGraph & Twitter Card
  - `schema.org` uyumlu JSON-LD
* Teknik SEO kapsamında:
  - `404` ve `500` hata sayfaları
  - `sitemap.xml`
  - `robots.txt`
* Temel erişilebilirlik (a11y) best practice’leri uygulanmalıdır.

---

## 8. Kod Kalitesi & Standartlar

* Proje aşağıdaki araçlarla uyumlu olmalıdır:
  - ESLint
  - Prettier
  - TypeScript `strict`
* Naming, dosya organizasyonu ve separation of concerns kritik değerlendirme kriterleridir.

---

## 9. Test (Artı Değer)

* Kritik bileşenler ve business logic için:
  - **Jest**
  - **React Testing Library**
kullanılarak test yazılması artı değer olarak değerlendirilir.

---

## 10. Teslimat

* Proje **GitHub** üzerinde public bir repository olarak paylaşılmalıdır.
* Repository içerisinde detaylı bir **README.md** veya **README.mdx** bulunmalıdır:
  - Kurulum & çalıştırma
  - Proje mimarisi
  - Rendering & state kararları
  - Varsayımlar ve trade-off’lar

---

## 11. Değerlendirme Kriterleri

Bu case’te görsel mükemmeliyet değil, aşağıdaki konular önceliklidir:

* Mimari kararlar
* Kod kalitesi
* Ölçeklenebilirlik
* Problem çözme yaklaşımı

_Not: Ayrıca Vercel’de deploy edip canlıya alıp link paylaşırsanız, yazılım ekibinin dışında yönetim de görebilir._