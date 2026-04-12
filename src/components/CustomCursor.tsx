'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'

const Outer = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1px solid var(--green);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
  will-change: transform, width, height, border-radius;
  overflow: hidden;
  background-size: cover;
  background-position: center;
`

const Inner = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 5px; height: 5px;
  background: var(--green);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: transform;
`

const TextLabel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg);
  font-family: var(--font-display);
  font-size: 16px;
  font-style: italic;
  opacity: 0;
`

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    const textLabel = textRef.current
    if (!outer || !inner || !textLabel) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    const move = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      document.body.style.setProperty('--mouse-x', `${mouseX}px`)
      document.body.style.setProperty('--mouse-y', `${mouseY}px`)

      gsap.to(inner, {
        x: mouseX, y: mouseY,
        duration: 0.08,
        ease: 'none',
      })
      gsap.to(outer, {
        x: mouseX, y: mouseY,
        duration: 0.18,
        ease: 'power2.out',
      })
    }

    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const imgUrl = target.getAttribute('data-cursor-img')

      if (imgUrl) {
        outer.style.backgroundImage = `url(${imgUrl})`
        gsap.to(outer, {
          width: 320,
          height: 200,
          borderRadius: 4,
          borderColor: 'transparent',
          opacity: 1,
          duration: 0.35,
          ease: 'power3.out',
        })
        gsap.to(inner, { opacity: 0, duration: 0.15 })
      } else {
        const isBtn = target.tagName === 'BUTTON' || target.tagName === 'A'

        if (target.hasAttribute('data-cursor-lens')) {
          gsap.to(outer, {
            width: 160, height: 160,
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            opacity: 1,
            backdropFilter: 'blur(4px) brightness(1.2) contrast(1.2)',
            duration: 0.35,
            ease: 'back.out(1.5)',
          })
          gsap.to(inner, { opacity: 0, duration: 0.15 })
        } else if (target.hasAttribute('data-cursor-video')) {
          textLabel.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="var(--bg)"/></svg>`
          gsap.to(textLabel, { opacity: 1, duration: 0.2 })
          gsap.to(outer, {
            width: 90, height: 90,
            background: 'var(--accent)',
            borderColor: 'var(--accent)',
            backdropFilter: 'none',
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.5)',
          })
          gsap.to(inner, { opacity: 0, duration: 0.15 })
        } else if (target.hasAttribute('data-cursor-text')) {
          textLabel.innerText = target.getAttribute('data-cursor-text') || 'VIEW'
          gsap.to(textLabel, { opacity: 1, duration: 0.2 })
          gsap.to(outer, {
            width: 80, height: 80,
            background: 'var(--accent)',
            borderColor: 'var(--accent)',
            backdropFilter: 'none',
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.5)',
          })
          gsap.to(inner, { opacity: 0, duration: 0.15 })
        } else {
          gsap.to(outer, {
            width: isBtn ? 64 : 54,
            height: isBtn ? 64 : 54,
            borderColor: 'var(--accent-bright)',
            background: 'transparent',
            backdropFilter: 'none',
            opacity: 0.7,
            duration: 0.25,
            ease: 'power2.out',
          })
          gsap.to(inner, { opacity: 0, duration: 0.15 })
        }
      }
    }

    const onLeave = () => {
      outer.style.backgroundImage = 'none'
      gsap.to(textLabel, { opacity: 0, duration: 0.1, onComplete: () => { textLabel.innerHTML = '' } })
      gsap.to(outer, {
        width: 40, height: 40,
        borderRadius: '50%',
        background: 'transparent',
        backdropFilter: 'none',
        borderColor: 'var(--accent)',
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      })
      gsap.to(inner, { opacity: 1, duration: 0.15 })
    }

    window.addEventListener('mousemove', move)

    // Using MutationObserver or simply selecting dynamically over time if things rerender
    const addListeners = () => {
      const interactives = document.querySelectorAll('a, button, [data-cursor], [data-cursor-img], [data-cursor-text], [data-cursor-lens], [data-cursor-video]')
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    addListeners()
    // Simple interval to catch newly mounted elements
    const interval = setInterval(addListeners, 1000)

    return () => {
      window.removeEventListener('mousemove', move)
      clearInterval(interval)
      const interactives = document.querySelectorAll('a, button, [data-cursor], [data-cursor-img], [data-cursor-text], [data-cursor-lens], [data-cursor-video]')
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <Outer ref={outerRef}>
        <TextLabel ref={textRef} />
      </Outer>
      <Inner ref={innerRef} />
    </>
  )
}
