'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export default function GSAPProvider() {
  useEffect(() => {
    /* ── Lenis smooth scroll ───────────────────────────────────────── */
    const lenis = new Lenis({
      lerp: 0.04,        // extremely velvety smooth
      duration: 1.8,     // long ease out
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expoOut
      smoothWheel: true,
      wheelMultiplier: 0.8, // subtle resistance
      touchMultiplier: 1.5,
    })

    // Tie Lenis RAF to GSAP ticker so ScrollTrigger stays in sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    /* ── Mouse tracking for body::before glow ─────────────────────── */
    const onMouse = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMouse)

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        e.preventDefault()
        lenis.scrollTo(anchor.hash, { offset: -84 }) // Offset for navbar
      }
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  return null
}
