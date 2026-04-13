'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger)
}

// 1. Matrix Scramble (Deliberate & Technical)
export const Scramble = ({ text, delay = 0, triggerOnHover = true }: { text: string, delay?: number, triggerOnHover?: boolean }) => {
  const [displayText, setDisplayText] = useState(text)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  const startScramble = () => {
    if (typeof text !== 'string') return
    let iteration = 0
    let interval = setInterval(() => {
      setDisplayText(
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index]
          return letters[Math.floor(Math.random() * 26)]
        }).join("")
      )
      if (iteration >= text.length) clearInterval(interval)
      iteration += 1 / 4
    }, 45)
  }

  useEffect(() => {
    const timeout = setTimeout(startScramble, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span onMouseEnter={triggerOnHover ? startScramble : undefined}>
      {displayText}
    </span>
  )
}

// 2. Wave Reveal (Fluid, for large titles)
export const WaveReveal = ({ text }: { text: string }) => {
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {text.split(" ").map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.2em' }}>
          <motion.span
            initial={{ y: "120%", rotate: 10 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              delay: i * 0.1,
              ease: [0.215, 0.61, 0.355, 1]
            }}
            style={{ display: 'inline-block', transformOrigin: 'left top' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// 3. Velocity Skew (Responds to Scroll)
export const VelocitySkew = ({ children }: { children: React.ReactNode }) => {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const skewVelocity = useSpring(useTransform(scrollVelocity, [-2000, 2000], [-15, 15]), {
    stiffness: 300,
    damping: 30
  })

  return (
    <motion.div style={{ skewX: skewVelocity, willChange: 'transform', display: 'inline-block' }}>
      {children}
    </motion.div>
  )
}

// 4. Blur Reveal
export const BlurReveal = ({ text }: { text: string }) => {
  return (
    <motion.span
      initial={{ filter: 'blur(12px)', opacity: 0, scale: 0.9 }}
      whileInView={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      style={{ display: 'inline-block' }}
    >
      {text}
    </motion.span>
  )
}

// 5. Skew Reveal
export const SkewReveal = ({ text }: { text: string }) => {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden' }}>
      <motion.span
        initial={{ y: "100%", skewY: 5 }}
        whileInView={{ y: 0, skewY: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        style={{ display: 'inline-block' }}
      >
        {text}
      </motion.span>
    </span>
  )
}

// 6. Fade Scale
export const FadeScale = ({ text }: { text: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {text}
    </motion.span>
  )
}

// Standard Dynamic Heading wrapper
export const VariableH = ({ children, tag: Tag = "h2" }: { children: React.ReactNode, tag?: any }) => {
  return (
    <Tag style={{ display: 'inline-block' }}>
      {typeof children === 'string' ? <Scramble text={children} triggerOnHover={true} /> : children}
    </Tag>
  )
}

// Paragraph Word Reveal
export const RevealText = ({ text }: { text: string }) => {
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {text.split(" ").map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
            style={{ display: 'inline-block' }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// 7. Horizontal Velocity Skew (For horizontal strips)
export const HorizontalVelocitySkew = ({ children, velocity }: { children: React.ReactNode, velocity: any }) => {
  const skew = useSpring(useTransform(velocity, [-2000, 2000], [-15, 15]), {
    stiffness: 300,
    damping: 30
  })

  return (
    <motion.div style={{ skewX: skew, willChange: 'transform' }}>
      {children}
    </motion.div>
  )
}

// 8. Chromatic Glitch (RGB Split on hover)
const GlitchWrapper = styled.span`
  position: relative;
  display: inline-block;
  cursor: none;

  .glitch-layer {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    opacity: 0;
    pointer-events: none;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
  }

  &:hover .glitch-layer {
    opacity: 0.8;
  }

  &:hover .layer-r { transform: translate(4px, -2px); color: #ff1a4a; }
  &:hover .layer-g { transform: translate(-4px, 2px); color: #1aff4a; }
  &:hover .layer-b { transform: translate(2px, 1px); color: #1a4aff; }
`

export const GlitchText = ({ text }: { text: string }) => {
  return (
    <GlitchWrapper>
      <span className="base">{text}</span>
      <span className="glitch-layer layer-r">{text}</span>
      <span className="glitch-layer layer-g">{text}</span>
      <span className="glitch-layer layer-b">{text}</span>
    </GlitchWrapper>
  )
}
// 9. Highlighter Effect (Color block behind text)
const HighlightWrapper = styled.span`
  position: relative;
  display: inline-block;
  padding: 0 4px;
  z-index: 1;
`

const HighlightBlock = styled(motion.span)`
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.color || 'var(--accent)'};
  z-index: -1;
  transform-origin: left;
`

export const Highlighter = ({ text, color }: { text: string, color?: string }) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <HighlightWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HighlightBlock
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        color={color}
      />
      <span style={{ position: 'relative', zIndex: 2 }}>{text}</span>
    </HighlightWrapper>
  )
}
// 10. Split Line Reveal (Reveals text line by line on scroll)
export const SplitLineReveal = ({ text, color }: { text: string, color?: string }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const words = el.querySelectorAll('.word')

    gsap.fromTo(words,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        stagger: 0.05,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    )
  }, [])

  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', color: color ? color : 'inherit' }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.25em' }}>
          <span className="word" style={{ display: 'inline-block' }}>{word}</span>
        </span>
      ))}
    </div>
  )
}

// 11. MotionPathWaypoints (Laser-precision visual narrative)
export const MotionPathWaypoints = ({ d = "M0 0 Q 250 250 500 500" }: { d?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (!pathRef.current || !dotRef.current || !glowRef.current) return

    const path = pathRef.current
    const dot = dotRef.current
    const glow = glowRef.current

    // Initialize dot at start
    gsap.set([dot, glow], { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      }
    })

    tl.to([dot, glow], {
      motionPath: {
        path: path,
        align: path,
        autoRotate: true,
      },
      ease: "none"
    }, 0)

    // Pulse animation for the glow
    gsap.to(glow, {
      scale: 1.8,
      opacity: 0.3,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === containerRef.current) st.kill()
      })
    }
  }, [d])

  return (
    <WaypointContainer ref={containerRef}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* The Track */}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.5"
          strokeDasharray="2 12"
          opacity="0.1"
          vectorEffect="non-scaling-stroke"
        />

        {/* The Glow */}
        <circle ref={glowRef} r="12" fill="var(--accent)" opacity="0.6" filter="url(#laserGlow)" />

        {/* The Waypoint */}
        <circle ref={dotRef} r="3" fill="var(--accent)" />
      </svg>
    </WaypointContainer>
  )
}

const WaypointContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.8;
`
