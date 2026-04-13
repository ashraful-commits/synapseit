'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import dynamic from 'next/dynamic'
import MagneticButton from './MagneticButton'

const HeroSphere = dynamic(() => import('./HeroSphere'), { ssr: false })

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--bg);
`

/* Left-to-right gradient: solid bg on the text side, fades out so sphere is visible */
const Gradient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(to right, var(--bg) 0%, var(--bg) 38%, rgba(6,11,18,0.72) 58%, transparent 80%),
    linear-gradient(to top, var(--bg) 0%, transparent 28%);
`

const Badge = styled.div`
  position: absolute;
  top: 0; right: 64px;
  z-index: 10;
  padding-top: 110px;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;

  @media (max-width: 768px) {
    right: 24px;
    padding-top: 90px;
  }
`

const BadgeDot = styled.span`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 14px var(--green);
  animation: pulse 2.4s ease-in-out infinite;
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.6); opacity: 0.55; }
  }
`

const BadgeText = styled.span`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
`

// Content is constrained to the left
const Content = styled.div`
  position: relative;
  z-index: 5;
  padding: 0 40px;
  padding-top: 120px;
  width: 100%;
  max-width: 90vw; /* let it break freely */

  @media (max-width: 768px) {
    padding: 0 24px;
    padding-top: 100px;
  }

  @media (min-width: 1024px) {
    padding: 0 80px;
    padding-top: 90px;
  }
`

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  opacity: 0;

  @media (min-width: 1024px) {
    margin-bottom: 52px;
  }
`

const EyebrowLine = styled.span`
  display: block;
  width: 40px;
  height: 2px;
  background: var(--accent);
`

const EyebrowText = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(32px, 8vw, 65px); 
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--text);
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    font-size: clamp(20px, 9vw, 36px);
    line-height: 1.2;
    word-break: break-word;
  }
`

const TitleLine = styled.div`
  /* Generous clipping for brutalist reveal + 1.8x zoom safety */
  overflow: visible;
  padding: 5px 0;
`

const TitleSpan = styled.div`
  display: block;
  /* Setting initial state in GSAP, but ensuring block for splits */
  will-change: transform;
`

const ItalicLine = styled.div`
  font-style: italic;
  display: block;
  padding: 5px 0;
  will-change: transform;
`

const TitleContainer = styled.div`
  position: relative;
  display: inline-block;
`

const MagnifiedGlass = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 20;
  clip-path: circle(100px at var(--local-mouse-x, -500px) var(--local-mouse-y, -500px));
  opacity: 0;
  transition: opacity 0.3s;
  ${TitleContainer}:hover & {
    opacity: 1;
  }
`

const ZoomLayer = styled.div`
  width: 100%;
  height: 100%;
  transform: scale(1.15);
  transform-origin: var(--local-mouse-x, 50%) var(--local-mouse-y, 50%);
  transition: transform 0.1s ease-out;

  h1 {
    color: var(--text) !important;
    -webkit-text-stroke: 0px !important;
    text-shadow: 0 4px 30px rgba(0,0,0,0.8);
  }
`

import { Scramble, WaveReveal, VelocitySkew, GlitchText, BlurReveal, RevealText, SkewReveal, FadeScale, Highlighter, SplitLineReveal } from './TypoEffects'

const MagneticTag = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const isString = typeof children === 'string'
  const [displayText, setDisplayText] = useState(isString ? children : '')
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const cx = left + width / 2
    const cy = top + height / 2
    x.set((e.clientX - cx) * 0.5)
    y.set((e.clientY - cy) * 0.5)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: mouseXSpring,
        y: mouseYSpring,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'none'
      }}
    >
      {isString ? (
        <Tag style={{
          borderColor: isHovered ? 'var(--accent)' : 'var(--border)',
          color: isHovered ? 'var(--text)' : 'var(--text-dim)',
          background: isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
          boxShadow: isHovered ? '0 0 20px rgba(26,74,255,0.1)' : 'none'
        }}>
          {children}
        </Tag>
      ) : (
        children
      )}
    </motion.span>
  )
}

const HeroSplitText = ({ text, color }: { text: string, color?: string }) => (
  <SplitLineReveal text={text} color={color} />
)

const Tagline = styled.p`
  font-size: clamp(15px, 1.4vw, 18px);
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-muted);
  max-width: 460px;
  margin-top: 36px;
  opacity: 0;
  transform: translateY(24px);
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
  opacity: 0;
`

const Tag = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-dim);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 2px;
  transition: border-color 0.25s, color 0.25s;
  &:hover {
    border-color: var(--green-dim);
    color: var(--green);
  }
  &::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--green-dim);
    flex-shrink: 0;
  }
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  margin-top: 52px;
  opacity: 0;
  transform: translateY(20px);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`

const SecondaryBtn = styled.a`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: color 0.25s;
  &::after {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: currentColor;
    transition: width 0.35s var(--ease-expo);
  }
  &:hover {
    color: var(--text);
    &::after { width: 50px; }
  }
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
  opacity: 0;
  flex-wrap: wrap;
  gap: 0;
`

const RollingTag = ({ children }: { children: string }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Tag
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        overflow: 'hidden',
        height: '36px',
        padding: '0 14px', /* Reset padding to handle center alignment properly */
        display: 'flex',
        alignItems: 'center',
        borderColor: isHovered ? 'var(--accent)' : 'var(--border)',
      }}
    >
      <div style={{ height: '36px', overflow: 'hidden', position: 'relative' }}>
        <motion.div
          animate={{ y: isHovered ? -36 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ height: '36px', display: 'flex', alignItems: 'center' }}>{children}</div>
          <div style={{ height: '36px', display: 'flex', alignItems: 'center', color: 'var(--accent)' }}>{children}</div>
        </motion.div>
      </div>
    </Tag>
  )
}
const MetaItem = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: var(--text-dim);
  letter-spacing: 0.03em;
  &:not(:last-child) {
    margin-right: 20px;
    padding-right: 20px;
    border-right: 1px solid var(--border-mid);
  }

  @media (max-width: 768px) {
    width: 100%;
    border-right: none !important;
    padding-right: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 8px;
  }
`

const ScrollHint = styled.div`
  position: absolute;
  bottom: 44px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
`

const ScrollWord = styled.span`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--text-dim);
`

const ScrollMouse = styled.div`
  width: 22px;
  height: 36px;
  border: 1px solid var(--text-dim);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;

  &::before {
    content: '';
    width: 2px;
    height: 6px;
    background: var(--text-dim);
    border-radius: 2px;
    animation: scrollWheel 2s ease-in-out infinite;
  }

  @keyframes scrollWheel {
    0% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(8px); opacity: 0; }
    100% { transform: translateY(0); opacity: 0; }
  }
`

export default function Hero() {
  const line1 = useRef<HTMLDivElement>(null)
  const line2 = useRef<HTMLDivElement>(null)
  const italic = useRef<HTMLDivElement>(null)
  const eyebrow = useRef<HTMLDivElement>(null)
  const badge = useRef<HTMLDivElement>(null)
  const tagline = useRef<HTMLParagraphElement>(null)
  const tags = useRef<HTMLDivElement>(null)
  const btns = useRef<HTMLDivElement>(null)
  const meta = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)

  const titleX = useMotionValue(0)
  const titleY = useMotionValue(0)
  const titleXSpring = useSpring(titleX, { stiffness: 100, damping: 30 })
  const titleYSpring = useSpring(titleY, { stiffness: 100, damping: 30 })

  const titleContainerRef = useRef<HTMLDivElement>(null)

  const handleTitleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const moveX = (clientX - window.innerWidth / 2) / 30
    const moveY = (clientY - window.innerHeight / 2) / 30
    titleX.set(moveX)
    titleY.set(moveY)

    // Calculate local mouse for the magnifying glass
    if (titleContainerRef.current) {
      const rect = titleContainerRef.current.getBoundingClientRect()
      titleContainerRef.current.style.setProperty('--local-mouse-x', `${clientX - rect.left}px`)
      titleContainerRef.current.style.setProperty('--local-mouse-y', `${clientY - rect.top}px`)
    }
  }

  useEffect(() => {
    if (!container.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 })
      tl
        .to(eyebrow.current, { opacity: 1, duration: 0.9, ease: 'power3.out' })
        .fromTo(line1.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.3, ease: 'power4.out' }, '-=0.5')
        .fromTo(line2.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.3, ease: 'power4.out' }, '-=0.95')
        .fromTo(italic.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.4, ease: 'power4.out' }, '-=0.95')
        .to(tagline.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
        .to(tags.current, { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.6')
        .to(btns.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .to(meta.current, { opacity: 1, duration: 0.5 }, '-=0.3')
        .to(badge.current, { opacity: 1, duration: 0.6 }, '-=0.5')
        .to(scroll.current, { opacity: 1, duration: 0.6 }, '-=0.2')
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <Section id="home" ref={container} onMouseMove={handleTitleMouseMove}>
      {/* Three.js morphing sphere — right half */}
      <HeroSphere />

      <Gradient />

      <Badge ref={badge}>
        <BadgeDot />
        <BadgeText>Milan, Italy — Available Worldwide</BadgeText>
      </Badge>

      <Content>
        <Eyebrow ref={eyebrow}>
          <EyebrowLine />
          <EyebrowText>Software Engineering</EyebrowText>
        </Eyebrow>

        <motion.div
          data-cursor-lens
          style={{ x: titleXSpring, y: titleYSpring }}
        >
          <TitleContainer ref={titleContainerRef}>
            <Title>
              <TitleLine>
                <TitleSpan ref={line1}>
                  <HeroSplitText text="Your software" color="#1a4aff" />
                </TitleSpan>
              </TitleLine>
              <TitleLine>
                <TitleSpan ref={line2}>
                  <HeroSplitText text="deserves better" />
                </TitleSpan>
              </TitleLine>
              <ItalicLine ref={italic}>
                <HeroSplitText text="engineering." />
              </ItalicLine>
            </Title>

            {/* True Optical Zoom Layer */}
            <MagnifiedGlass>
              <ZoomLayer>
                <Title aria-hidden="true">
                  <TitleLine>
                    <TitleSpan style={{ color: '#1a4aff' }}>Your software</TitleSpan>
                  </TitleLine>
                  <TitleLine>
                    <TitleSpan>deserves better</TitleSpan>
                  </TitleLine>
                  <ItalicLine>
                    engineering.
                  </ItalicLine>
                </Title>
              </ZoomLayer>
            </MagnifiedGlass>
          </TitleContainer>
        </motion.div>

        <Tagline ref={tagline}>
          We architect, build, and scale digital products for companies
          that need engineering they can depend on.
        </Tagline>

        <Tags ref={tags}>
          <MagneticTag>Web Apps</MagneticTag>
          <MagneticTag children={<RollingTag children="Mobile" />} />
          <MagneticTag>QA & Testing</MagneticTag>
          <MagneticTag children={<RollingTag children="UI/UX" />} />
          <MagneticTag>DevOps & Cloud</MagneticTag>
        </Tags>

        <Buttons ref={btns}>
          <MagneticButton href="#contact" variant="primary">
            Start Your Project
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1 7.5h13M8.5 2l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>
          <SecondaryBtn href="#work">See Our Work</SecondaryBtn>
        </Buttons>

        <Meta ref={meta}>
          <MetaItem><BlurReveal text="Response within 24 hours" /></MetaItem>
          <MetaItem><BlurReveal text="120+ products delivered" /></MetaItem>
          <MetaItem><BlurReveal text="98% client retention" /></MetaItem>
        </Meta>
      </Content>

      <ScrollHint ref={scroll}>
        <ScrollWord>Scroll</ScrollWord>
        <ScrollMouse />
      </ScrollHint>
    </Section>
  )
}
