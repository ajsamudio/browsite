'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  { src: '/img/brow.jpg', alt: 'Lash extensions transformation' },
  { src: '/img/brow2.jpg', alt: 'Volume lash set before and after' },
  { src: '/img/brow3.jpg', alt: 'Brow lamination results' },
  { src: '/img/brow4.jpg', alt: 'Classic lash extensions' },
  { src: '/img/brow5.jpg', alt: 'Hybrid lash set' },
]

export default function Carousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="carousel">
      {slides.map((slide, i) => (
        <div key={slide.src} className={`carousel-slide${i === active ? ' active' : ''}`}>
          <Image src={slide.src} alt={slide.alt} fill sizes="500px" priority={i === 0} />
        </div>
      ))}
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === active ? 'active' : ''}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
