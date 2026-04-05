'use client'
import { useEffect } from 'react'

export default function SiteEffects() {
  useEffect(() => {
    // Fade-in on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))

    // Navbar scroll effect
    const nav = document.querySelector('.site-nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })

    // Mobile nav toggle
    const toggle = document.querySelector('.nav-toggle')
    const links = document.querySelector('.nav-links')
    const onToggle = () => links?.classList.toggle('open')
    const closeNav = () => links?.classList.remove('open')
    toggle?.addEventListener('click', onToggle)
    links?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav))

    // Sparkle canvas
    const canvas = document.getElementById('sparkle-canvas')
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let sparkles = []
    let counter = 0
    let rafId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Sparkle {
      constructor(x, y) {
        this.x = x; this.y = y
        this.size = Math.random() * 3 + 1
        this.life = 1
        this.decay = Math.random() * 0.02 + 0.015
        this.vx = (Math.random() - 0.5) * 1.5
        this.vy = (Math.random() - 0.5) * 1.5
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.1
        const colors = ['rgba(201,169,110,', 'rgba(224,207,166,', 'rgba(196,134,107,', 'rgba(255,255,255,']
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      update() {
        this.x += this.vx; this.y += this.vy
        this.life -= this.decay
        this.rotation += this.rotationSpeed
      }
      draw() {
        if (this.life <= 0) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.globalAlpha = this.life
        const s = this.size
        ctx.beginPath()
        ctx.moveTo(0, -s * 2); ctx.lineTo(s * 0.5, -s * 0.5)
        ctx.lineTo(s * 2, 0); ctx.lineTo(s * 0.5, s * 0.5)
        ctx.lineTo(0, s * 2); ctx.lineTo(-s * 0.5, s * 0.5)
        ctx.lineTo(-s * 2, 0); ctx.lineTo(-s * 0.5, -s * 0.5)
        ctx.closePath()
        ctx.fillStyle = this.color + this.life + ')'
        ctx.fill()
        ctx.restore()
      }
    }

    const onMouseMove = (e) => {
      counter++
      if (counter % 3 === 0) sparkles.push(new Sparkle(e.clientX, e.clientY))
    }
    document.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparkles = sparkles.filter(s => s.life > 0)
      sparkles.forEach(s => { s.update(); s.draw() })
      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMouseMove)
      toggle?.removeEventListener('click', onToggle)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas id="sparkle-canvas" aria-hidden="true" />
}
