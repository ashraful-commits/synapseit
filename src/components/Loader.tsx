'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'

const LoaderOverlay = styled.div<{ isComplete: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 1.2s cubic-bezier(0.7, 0, 0.2, 1);
  transform: translateY(${({ isComplete }) => isComplete ? '-100%' : '0'});
  pointer-events: ${({ isComplete }) => isComplete ? 'none' : 'auto'};
`

const LoadingText = styled.div`
  font-family: var(--font-display);
  font-size: clamp(80px, 15vw, 240px);
  font-weight: 800;
  color: transparent;
  -webkit-text-stroke: 2px var(--border-mid);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.8;
  position: relative;
  overflow: hidden;

  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    color: var(--accent);
    -webkit-text-stroke: 0px;
    width: var(--fill-width, 0%);
    overflow: hidden;
    white-space: nowrap;
  }
`

const ProgressBar = styled.div`
  position: absolute;
  bottom: 10%;
  left: 10%;
  right: 10%;
  height: 2px;
  background: var(--border);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    height: 100%;
    width: 0%;
    background: var(--accent);
  }
`

export default function Loader() {
  const [percent, setPercent] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = 'hidden'

    const obj = { value: 0 }
    
    // Simulate loading progress
    gsap.to(obj, {
      value: 100,
      duration: 2.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        const val = Math.floor(obj.value)
        setPercent(val)
        
        if (textRef.current) {
          // Fill text based on percentage
          // Type casting to style sheet for pseudo elements requires a css variable hack or inline style
          textRef.current.style.setProperty('--fill-width', `${val}%`)
        }
        if (barRef.current) {
          barRef.current.style.width = `${val}%`
        }
      },
      onComplete: () => {
        setTimeout(() => {
          setIsComplete(true)
          document.body.style.overflow = ''
        }, 400)
      }
    })
  }, [])

  return (
    <LoaderOverlay isComplete={isComplete}>
      <LoadingText 
        ref={textRef} 
        data-text={String(percent).padStart(3, '0')}
        style={{
          // @ts-ignore
          '--fill-width': '0%'
        }}
      >
        {String(percent).padStart(3, '0')}
      </LoadingText>
      
      {/* We need to apply the variable to pseudo using styled component tricks, 
          let's just use an inner div to guarantee it works without TS warnings */}
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', height: '2px', background: 'var(--border)' }}>
        <div ref={barRef} style={{ height: '100%', background: 'var(--accent)', width: '0%' }} />
      </div>
    </LoaderOverlay>
  )
}
