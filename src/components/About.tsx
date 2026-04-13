'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Scramble, RevealText, VariableH, SkewReveal, BlurReveal, VelocitySkew, WaveReveal, SplitLineReveal, MotionPathWaypoints } from './TypoEffects'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Section = styled.section`
  position: relative;
  padding: 120px 0 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 80px 0 40px;
    background: rgba(255, 255, 255, 0.02); /* Subtle mobile background */
  }
`

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 64px;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; 
  margin-bottom: 80px;
`

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 16px;
  &::before {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: var(--accent);
  }
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(60px, 8vw, 120px);
  font-weight: 300;
  color: var(--text);
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  max-width: 1000px;
  margin: 0; 
`





const SplitContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  margin-bottom: 100px; /* Reduced from 180px */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`

const MassiveQuote = styled.div`
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 56px);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text);

  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  .word {
    display: inline-block;
    opacity: 0.6; /* Increased further for immediate clarity */
    transform: translateY(10px);
  }
`

const RightDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`

const Description = styled.p`
  font-size: 18px;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85); /* Brighter for better visibility */
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 24px;
  }
`

const StatItem = styled.div`
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 24px;
`

const StatNumber = styled.div`
  font-family: var(--font-display);
  font-size: 80px;
  font-weight: 300;
  color: var(--text);
  line-height: 1;
  letter-spacing: -0.04em;
  margin-bottom: 12px;
  span { color: var(--accent); }

  @media (max-width: 768px) {
    font-size: 52px;
  }
`

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6); /* Brighter than var(--text-dim) */
`

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 180px;
`

const FeatureRow = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 60px;
  padding: 60px 0;
  border-top: 1px solid rgba(255,255,255,0.05);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 40px 0;
  }
  
  &:last-child {
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  
  &:hover .feature-icon {
    transform: scale(1.2) rotate(15deg);
    color: var(--accent-bright);
  }
`

const FeatureHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`

const FeatureIcon = styled.div`
  width: 32px;
  height: 32px;
  color: var(--accent);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`

const FeatureTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 300;
  color: var(--text);

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const FeatureDesc = styled.p`
  font-size: 18px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-muted);
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const quoteText = "Software built with discipline and designed with intention produces better business outcomes than software built by committee."

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Create a profound parallax Y translation effect
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])

  useEffect(() => {
    // Word-by-word reveal for massive quote
    if (quoteRef.current) {
      const words = quoteRef.current.querySelectorAll('.word')
      gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: 0.5,
        }
      })
    }
  }, [])

  return (
    <Section id="about" ref={containerRef}>
      <Inner>
        <Header>
          <SectionLabel><SkewReveal text="About Synapse IT" /></SectionLabel>
          <SectionTitle>
            <SplitLineReveal text="A company built on conviction and craft." />
          </SectionTitle>
        </Header>
      </Inner>

      <Inner>
        <SplitContent>
          <MassiveQuote ref={quoteRef}>
            {quoteText.split(' ').map((word, i) => (
              <span key={i} className="word">{word}&nbsp;</span>
            ))}
          </MassiveQuote>

          <RightDetails>
            <Description>
              <RevealText text="We are not a staffing agency. We are not a generalist consultancy. We are a software engineering company that holds itself accountable to the absolute highest quality of its work and the success of its clients' products." />
            </Description>
            <Description>
              <RevealText text="Our clients range from funded startups to established mid-market companies — all of whom share a need for technical partners who deliver with consistency" />
            </Description>

            <StatsGrid>
              <StatItem>
                <StatNumber><Scramble text="40+" /></StatNumber>
                <StatLabel><Scramble text="Practitioners" /></StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber><Scramble text="8+" /></StatNumber>
                <StatLabel><Scramble text="Years Delivering" /></StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>98<span>%</span></StatNumber>
                <StatLabel>Client Retention</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>5</StatNumber>
                <StatLabel>Disciplines</StatLabel>
              </StatItem>
            </StatsGrid>
          </RightDetails>
        </SplitContent>

        <FeatureList>
          {[
            {
              icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
              title: 'Substance Over Speed',
              desc: 'We don\'t optimise for velocity at the expense of quality. Every decision — from architecture to deployment — is made with the product\'s long-term health in mind.'
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>,
              title: 'Ownership, Not Attendance',
              desc: 'Our teams take responsibility for outcomes, not just tasks. When something isn\'t working, we raise it. When something can be better, we propose it.'
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="1.5" /><path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" /><path d="M12 4V20" stroke="currentColor" strokeWidth="1.5" /></svg>,
              title: 'Cross-Functional by Design',
              desc: 'Engineering, design, QA, and DevOps collaborate daily — not as separate departments handing off deliverables. This integrated structure eliminates gaps.'
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" /><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" /><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" /></svg>,
              title: 'Commercially Flexible',
              desc: 'Resource augmentation, hourly advisory, or fixed-scope delivery. We match the commercial structure to the project reality without compromising quality.'
            },
          ].map((f, i) => (
            <FeatureRow key={i}>
              <FeatureHeader>
                <FeatureIcon className="feature-icon">{f.icon}</FeatureIcon>
                <FeatureTitle>{f.title}</FeatureTitle>
              </FeatureHeader>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureRow>
          ))}
        </FeatureList>
      </Inner>
    </Section>
  )
}
