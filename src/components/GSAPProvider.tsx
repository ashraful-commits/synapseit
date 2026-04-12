'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function GSAPProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('h2:not([data-no-gsap]), h3:not([data-no-gsap]), p:not([data-no-gsap]), li:not([data-no-gsap])')

      elements.forEach((el) => {
        const hasGSAPParent = el.closest('.gsap-service-item, [data-step], #home')
        if (hasGSAPParent || el.tagName === 'H1') return

        gsap.fromTo(el,
          {
            y: 40,
            opacity: 0,
            filter: 'blur(10px)',
            transformOrigin: 'left top'
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play reverse play reverse"
            }
          }
        )

        // Aggressive GSAP Hover Effect for all text (Monogrid style jump/zoom)
        el.addEventListener('mouseenter', () => {
          gsap.to(el, { scale: 1.04, x: 8, color: 'var(--text)', textShadow: '0 0 16px var(--accent)', duration: 0.3, ease: 'back.out(2)' })
        })
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { scale: 1, x: 0, color: '', textShadow: 'none', duration: 0.4, ease: 'power2.out' })
        })
      })
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  return null
}
