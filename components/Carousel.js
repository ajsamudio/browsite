'use client'
import { useState, useEffect } from 'react'

const B = process.env.NEXT_PUBLIC_BASE_PATH || ''

const slides = [
  { src: `${B}/img/brow12.jpg`, alt: 'Lash extensions full result' },
  { src: `${B}/img/brow9.jpg`,  alt: 'Lash and brow extensions result' },
  { src: `${B}/img/brow3.jpg`,  alt: 'Dramatic lash extensions close-up' },
  { src: `${B}/img/brow6.jpg`,  alt: 'Classic lashes and brow definition' },
  { src: `${B}/img/brow11.jpg`, alt: 'Studio lash extensions result' },
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.src} alt={slide.alt} />
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
