import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'Dragonflybar Studio | Lash Extensions & Brow Services — La Palma, CA',
  description:
    'Premium eyelash extensions, brow lamination, lash lifts, and henna tints at Dragonflybar Studio in La Palma, CA. Book your appointment today.',
  keywords:
    'lash extensions La Palma CA, brow lamination, lash lift, henna tint, eyelash extensions, beauty studio La Palma',
  openGraph: {
    title: 'Dragonflybar Studio | Lash Extensions & Brow Services',
    description:
      'Premium lash and brow services in La Palma, CA. Classic, Hybrid & Volume lashes. Brow lamination & henna tints.',
    type: 'website',
    locale: 'en_US',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'Dragonflybar Studio',
  description:
    'Home-based lash and eyebrow beauty studio specializing in eyelash extensions, brow lamination, lash lifts, and henna tints in La Palma, CA.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'La Palma',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  email: 'Miaj.k.04@gmail.com',
  sameAs: ['https://www.instagram.com/dragonflyybar/'],
  priceRange: '$$',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Beauty Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Classic Lash Extensions' }, price: '50', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hybrid Lash Extensions' }, price: '55', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Volume Lash Extensions' }, price: '60', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Lash Lift' }, price: '50', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brow Lamination' }, price: '70', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Henna Brow Tint' }, price: '40', priceCurrency: 'USD' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
