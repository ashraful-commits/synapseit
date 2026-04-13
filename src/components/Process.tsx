'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BlurReveal, VariableH, Scramble } from './TypoEffects'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

/* ─── Styled Components ─────────────────────────────────────── */

const ProcessSection = styled.section`
  background: var(--bg);
  position: relative;
  overflow: hidden;
  height: 100vh; /* Lock height to viewport for perfect pinning */
`

const ProcessNoise = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.04;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  z-index: 5;
`

const ProcessHeader = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 80px 64px 0;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 20;

  @media (max-width: 768px) {
    padding: 60px 24px 0;
    grid-template-columns: 1fr;
    gap: 20px;
  }
`

const HeaderLabel = styled.div`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  &::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--accent);
  }
`

const HeaderTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 56px);
  font-weight: 300;
  color: var(--text);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;

  em {
    font-style: italic;
    color: var(--accent);
    font-family: serif;
    font-weight: 400;
  }
`

const HeaderSub = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 380px;
  border-left: 1px solid var(--border-mid);
  padding-left: 24px;

  @media (max-width: 768px) {
    display: none; /* Hide sub on mobile to save vertical space */
  }
`

const StickyContainer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0; left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px; /* Offset to center cards under header */
`

const CardsWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1100px;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    height: 600px;
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    height: auto;
    min-height: 520px;
    padding: 0 20px;
  }
`

const CardItem = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 80px;
  padding: 60px 80px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 
    0 40px 100px -20px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  will-change: transform, opacity, filter;
  transform-origin: center top;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 60px 48px;
    height: auto;
    min-height: 500px;
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 24px;
    gap: 24px;
  }
`

const CardLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
`

const StepIndex = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
`

const StepName = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(40px, 4.5vw, 68px);
  font-weight: 300;
  color: var(--text);
  letter-spacing: -0.04em;
  line-height: 0.9;
  text-transform: uppercase;
`

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-left: 60px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 1024px) {
    padding-left: 0;
    border-left: none;
    gap: 24px;
  }
`

const StepDesc = styled.p`
  font-size: 16px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-muted);
`

const DeliverablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px 40px;
`

const DItem = styled.div`
  display: flex;
  gap: 14px;
  font-size: 14px;
  color: var(--text-muted);
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  &:last-child { border-bottom: none; }
  &::before { 
    content: '→'; 
    color: var(--accent); 
    font-weight: bold;
    transition: transform 0.3s ease;
  }
  &:hover {
    color: var(--text);
    padding-left: 8px;
    &::before { transform: translateX(4px); }
  }
`

const BigNum = styled.div`
  font-family: var(--font-display);
  font-size: clamp(140px, 20vw, 280px);
  font-weight: 800;
  color: rgba(255, 255, 255, 0.02);
  line-height: 0.7;
  position: absolute;
  right: 0;
  bottom: -20px;
  pointer-events: none;
`

/* ─── Data ───────────────────────────────────────────────────── */

const steps = [
    {
        name: 'Discovery',
        desc: 'Deep extraction of business goals, user behavioral patterns, and competitive whitespace. This phase defines the strategic vector for the entire project.',
        deliverables: ['Stakeholder alignment workshops', 'Competitive intelligence report', 'User persona mapping', 'Strategic scope definition'],
        color: 'rgba(26,74,255,1)',
    },
    {
        name: 'Architecture',
        desc: 'Defining the structural integrity. We map data flows, service relationships, and technology stacks that prioritize scalability and future-proofing.',
        deliverables: ['System relationship diagrams', 'Database schema modeling', 'API contract definitions', 'Scalability roadmap'],
        color: 'rgba(26,160,255,1)',
    },
    {
        name: 'Realization',
        desc: 'High-fidelity execution. Designs are transformed into interactive prototypes and eventually production-grade systems with atomic precision.',
        deliverables: ['Atomic design systems', 'Interactive high-fi prototypes', 'Motion and interaction specs', 'Component library audits'],
        color: 'rgba(140,26,255,1)',
    },
    {
        name: 'Engineering',
        desc: 'Senior-led development utilizing modern CI/CD patterns. We build in vertical slices, ensuring testable, working code is delivered in every cycle.',
        deliverables: ['Production-grade feature builds', 'Automated test suites', 'CI/CD pipeline hardening', 'Real-time performance logs'],
        color: 'rgba(26,200,120,1)',
    },
    {
        name: 'Optimization',
        desc: 'Deployment is just the beginning. We monitor, measure, and refine based on real production telemetry to ensure peak performance.',
        deliverables: ['Staged rollout management', 'Production monitoring setup', 'Performance audit reports', 'Infrastructure optimization'],
        color: 'rgba(255,100,26,1)',
    },
]

const cardBgs = [
    'linear-gradient(135deg, #0a0c16 0%, #0e1224 100%)',
    'linear-gradient(135deg, #080e16 0%, #0a1622 100%)',
    'linear-gradient(135deg, #0c0a16 0%, #120e24 100%)',
    'linear-gradient(135deg, #0a120e 0%, #0c1a12 100%)',
    'linear-gradient(135deg, #160c0a 0%, #22100a 100%)',
]

/* ─── Tilt Wrapper ─────────────────────────────────────── */

function CardWithTilt({ children, style, className }: any) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 25 })
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 25 })
    const ref = useRef<HTMLDivElement>(null)

    function onMouseMove(e: React.MouseEvent) {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    return (
        <CardItem
            ref={ref}
            className={className}
            onMouseMove={onMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0) }}
            style={{ ...style, rotateX, rotateY }}
        >
            {children}
        </CardItem>
    )
}

/* ─── Main Component ─────────────────────────────────────────────── */

export default function Process() {
    const sectionRef = useRef<HTMLElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)
    const [activeStep, setActiveStep] = useState(0)

    useEffect(() => {
        const section = sectionRef.current
        const cards: HTMLElement[] = gsap.utils.toArray('.process-card')
        const totalSteps = steps.length

        if (!section) return

        const ctx = gsap.context(() => {
            // Create a master timeline for the pinned section
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'process-trigger',
                    trigger: section,
                    start: 'top top',
                    end: `+=${totalSteps * 150}%`, // Longer scroll for a 'pinned' feel
                    pin: true,
                    scrub: 1, // Smooth scrolling
                    onUpdate: (self) => {
                        const stepHeight = 1 / totalSteps
                        const current = Math.min(Math.floor(self.progress / stepHeight), totalSteps - 1)
                        setActiveStep(current)
                    }
                }
            })

            // Initial state for cards
            gsap.set(cards, { y: 40, opacity: 0, visibility: 'hidden' })
            if (cards[0]) {
                gsap.set(cards[0], { y: 0, opacity: 1, visibility: 'visible' })
            }

            cards.forEach((card, i) => {
                const nextCard = cards[i + 1]

                if (nextCard) {
                    // Exit current card completely
                    tl.to(card, {
                        y: -40,
                        opacity: 0,
                        duration: 1,
                        ease: 'power2.inOut',
                        onComplete: () => { gsap.set(card, { visibility: 'hidden' }) },
                        onReverseComplete: () => { gsap.set(card, { visibility: 'visible' }) }
                    }, i)

                    // Entrance next card
                    tl.to(nextCard, {
                        y: 0,
                        opacity: 1,
                        visibility: 'visible',
                        duration: 1,
                        ease: 'power2.inOut'
                    }, i)
                }
            })

            // Enter animation for the header
            gsap.from(['.p-label', '.p-title', '.p-sub'], {
                y: 40,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <ProcessSection id="process" ref={sectionRef}>
            <ProcessNoise />

            <ProcessHeader>
                <div style={{ zIndex: 10 }}>
                    <HeaderLabel className="p-label">
                        Workflow <span style={{ opacity: 0.4 }}>/ 05 Units</span>
                    </HeaderLabel>
                    <HeaderTitle className="p-title">
                        The standard for<br />
                        <em>senior delivery.</em>
                    </HeaderTitle>
                </div>
                <HeaderSub className="p-sub" style={{ zIndex: 10 }}>
                    Our engineering culture is built on deterministic outcomes. We remove the variability of software development through a rigorous, multi-loop validation process.
                </HeaderSub>
            </ProcessHeader>

            <StickyContainer ref={stickyRef}>
                <CardsWrapper>
                    {steps.map((s, i) => (
                        <CardWithTilt
                            key={s.name}
                            className="process-card"
                            style={{
                                background: cardBgs[i],
                                border: `1px solid ${s.color.replace('1)', '0.15)')}`,
                                zIndex: i + 1,
                            }}
                        >
                            <BigNum>{String(i + 1).padStart(2, '0')}</BigNum>

                            <CardLeft>
                                <StepIndex style={{ color: s.color }}>Unit 0{i + 1}</StepIndex>
                                <StepName>
                                    <Scramble text={s.name} />
                                </StepName>
                            </CardLeft>

                            <CardRight>
                                <StepDesc>{s.desc}</StepDesc>
                                <div style={{ marginTop: 'auto' }}>
                                    <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '24px', opacity: 0.8 }}>
                                        Critical Success Metrics
                                    </div>
                                    <DeliverablesGrid>
                                        {s.deliverables.map(d => (
                                            <DItem key={d}>{d}</DItem>
                                        ))}
                                    </DeliverablesGrid>
                                </div>
                            </CardRight>
                        </CardWithTilt>
                    ))}
                </CardsWrapper>
            </StickyContainer>
        </ProcessSection>
    )
}
