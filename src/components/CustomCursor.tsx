'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'

const Outer = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 40px; height: 40px;
  background: white;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
  will-change: transform, width, height, border-radius;
  mix-blend-mode: difference;
  overflow: hidden;
  background-size: cover;
  background-position: center;

  @keyframes rotate-lens {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }

  &.lens-active {
    animation: rotate-lens 4s linear infinite;
  }
`

const Inner = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 8px; height: 8px;
  background: white;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: transform;
  mix-blend-mode: difference;
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
          outer.classList.add('lens-active')
          gsap.to(target, { scale: 1.05, duration: 0.5, ease: 'power3.out' })
          gsap.to(outer, {
            width: 200, height: 200,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent 60%)',
            border: '1px solid rgba(255,255,255,0.15)',
            backgroundImage: 'none',
            opacity: 1,
            mixBlendMode: 'difference',
            backdropFilter: 'none',
            boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05), 0 0 20px rgba(255,0,128,0.15), 0 0 20px rgba(0,255,255,0.15)',
            duration: 0.5,
            ease: 'power3.out',
          })
          gsap.to(inner, { opacity: 0, duration: 0.15 })
        } else if (target.hasAttribute('data-cursor-video')) {
          textLabel.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="var(--bg)"/></svg>`
          gsap.to(textLabel, { opacity: 1, duration: 0.2 })
          gsap.to(outer, {
            width: 90, height: 90,
            background: 'var(--accent)',
            borderColor: 'var(--accent)',
            mixBlendMode: 'normal',
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
            mixBlendMode: 'normal',
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
            background: 'white',
            borderColor: 'transparent',
            mixBlendMode: 'difference',
            backdropFilter: 'none',
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out',
          })
          gsap.to(inner, { opacity: 0, duration: 0.15 })
        }
      }
    }

    const onLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      if (target.hasAttribute('data-cursor-lens')) {
        gsap.to(target, { scale: 1, duration: 0.5, ease: 'power3.out' })
      }
      outer.classList.remove('lens-active')
      outer.style.backgroundImage = 'none'
      gsap.to(textLabel, { opacity: 0, duration: 0.1, onComplete: () => { textLabel.innerHTML = '' } })
      gsap.to(outer, {
        width: 40, height: 40,
        borderRadius: '50%',
        background: 'white',
        mixBlendMode: 'difference',
        backdropFilter: 'none',
        borderColor: 'transparent',
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
