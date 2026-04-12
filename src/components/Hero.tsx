'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'

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
`

const TitleLine = styled.div`
  padding: 15px 0;
  margin: -15px 0;
  overflow: visible;
`

const TitleSpan = styled.div`
  display: block;
  transform: translateY(0%);
  will-change: transform;
`

const ItalicLine = styled.div`
  font-style: italic;
  color: var(--accent);
  padding: 15px 0;
  margin: -15px 0;
`

const ItalicSpan = styled.div`
  display: block;
  transform: translateY(0%);
`

const HoverChar = styled.span`
  display: inline-block;
  white-space: pre;
  will-change: transform;
`

const SplitText = ({ text }: { text: string }) => (
  <>
    {text.split('').map((char, i) => (
      <HoverChar key={i}>{char}</HoverChar>
    ))}
  </>
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
`

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 18px 44px;
  background: var(--accent);
  color: var(--text);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: all 0.4s var(--ease-expo);

  svg { transition: transform 0.3s ease; }
  &:hover {
    background: var(--accent-bright);
    transform: translateY(-3px);
    box-shadow: 0 24px 60px var(--accent-glow);
    svg { transform: translateX(5px); }
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

const ScrollBar = styled.div`
  width: 1px;
  height: 52px;
  overflow: hidden;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: linear-gradient(to bottom, var(--accent), transparent);
    animation: scrollDrop 2.2s ease-in-out infinite;
  }
  @keyframes scrollDrop {
    0% { transform: translateY(-100%); }
    50% { transform: translateY(0%); }
    100% { transform: translateY(100%); }
  }
`

export default function Hero() {
  const line1 = useRef<HTMLSpanElement>(null)
  const line2 = useRef<HTMLSpanElement>(null)
  const italic = useRef<HTMLSpanElement>(null)
  const eyebrow = useRef<HTMLDivElement>(null)
  const badge = useRef<HTMLDivElement>(null)
  const tagline = useRef<HTMLParagraphElement>(null)
  const tags = useRef<HTMLDivElement>(null)
  const btns = useRef<HTMLDivElement>(null)
  const meta = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)

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

      const chars = container.current?.querySelectorAll('span')
      if (chars && chars.length > 0) {
        const onMouseMove = (e: MouseEvent) => {
          const mouseX = e.clientX
          const mouseY = e.clientY

          chars.forEach((char) => {
            if (!char.closest('h1')) return

            const rect = char.getBoundingClientRect()
            const charCenterX = rect.left + rect.width / 2
            const charCenterY = rect.top + rect.height / 2

            const dist = Math.sqrt(Math.pow(mouseX - charCenterX, 2) + Math.pow(mouseY - charCenterY, 2))

            const maxDist = 90 // Tightly bound to match lens radius
            if (dist < maxDist) {
              // High velocity magnification (1.8x zoom)
              const proximityScale = 1 + (1 - dist / maxDist) * 0.8
              const yPush = -(proximityScale - 1) * 30

              gsap.to(char, {
                scale: proximityScale,
                y: yPush,
                color: '#fff',
                textShadow: '0px 0px 30px rgba(26, 74, 255, 0.6)',
                zIndex: 100,
                duration: 0.1,
                ease: 'power3.out',
                overwrite: 'auto'
              })
            } else {
              // Clean return with overlap safety
              gsap.to(char, {
                scale: 1,
                y: 0,
                color: '',
                textShadow: 'none',
                zIndex: 1,
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: 'auto'
              })
            }
          })
        }
        window.addEventListener('mousemove', onMouseMove)
        return () => window.removeEventListener('mousemove', onMouseMove)
      }
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <Section id="home" ref={container}>
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

        <Title>
          <TitleLine><TitleSpan ref={line1} data-cursor-lens><SplitText text="Your software" /></TitleSpan></TitleLine>
          <TitleLine><TitleSpan ref={line2} data-cursor-lens><SplitText text="deserves better" /></TitleSpan></TitleLine>
          <ItalicLine><ItalicSpan ref={italic} data-cursor-lens><SplitText text="engineering." /></ItalicSpan></ItalicLine>
        </Title>

        <Tagline ref={tagline}>
          We architect, build, and scale digital products for companies
          that need engineering they can depend on.
        </Tagline>

        <Tags ref={tags}>
          {['Web Apps', 'Mobile', 'QA & Testing', 'UI/UX', 'DevOps & Cloud'].map(s => (
            <Tag key={s}>{s}</Tag>
          ))}
        </Tags>

        <Buttons ref={btns}>
          <PrimaryBtn href="#contact">
            Start Your Project
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1 7.5h13M8.5 2l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </PrimaryBtn>
          <SecondaryBtn href="#work">See Our Work</SecondaryBtn>
        </Buttons>

        <Meta ref={meta}>
          <MetaItem>Response within 24 hours</MetaItem>
          <MetaItem>120+ products delivered</MetaItem>
          <MetaItem>98% client retention</MetaItem>
        </Meta>
      </Content>

      <ScrollHint ref={scroll}>
        <ScrollWord>Scroll</ScrollWord>
        <ScrollBar />
      </ScrollHint>
    </Section>
  )
}
