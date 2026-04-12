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
      })
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  return null
}
