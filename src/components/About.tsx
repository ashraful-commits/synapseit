'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Section = styled.section`
  background: var(--bg-soft);
  padding: 140px 0;
  overflow: hidden;
`

const Inner = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 64px;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: end;
  margin-bottom: 100px;
`

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  &::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: var(--green);
  }
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(42px, 4.8vw, 68px);
  font-weight: 300;
  color: var(--text);
  line-height: 1.0;
  letter-spacing: -0.02em;
  em { font-style: italic; color: var(--green); }
`

const HeaderRight = styled.p`
  font-size: 16px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-muted);
  max-width: 420px;
  align-self: end;
`

const PhilosophyBlock = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 60px;
  margin-bottom: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
`

const Quote = styled.blockquote`
  font-family: var(--font-display);
  font-size: clamp(22px, 2.4vw, 32px);
  font-weight: 300;
  font-style: italic;
  color: var(--text);
  line-height: 1.55;
  border-left: 2px solid var(--green);
  padding-left: 28px;
`

const PhilosophyBody = styled.p`
  font-size: 15px;
  font-weight: 300;
  line-height: 1.85;
  color: var(--text-muted);
  align-self: center;
`

const Numbers = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 80px;
`

const NumItem = styled.div`
  padding: 44px 36px;
  border-right: 1px solid var(--border);
  &:last-child { border-right: none; }
`

const NumVal = styled.div`
  font-family: var(--font-display);
  font-size: 58px;
  font-weight: 300;
  color: var(--text);
  line-height: 1;
  letter-spacing: -0.02em;
  span { color: var(--green); }
`

const NumLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 12px;
`

const PrinciplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 80px;
`

const Principle = styled.div`
  padding: 48px 44px;
  background: var(--bg-card);
  transition: background 0.3s;
  &:hover { background: var(--bg-lift); }
`

const PrincipleNum = styled.div`
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 300;
  color: var(--text-dim);
  margin-bottom: 20px;
`

const PrincipleName = styled.h3`
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 14px;
  letter-spacing: -0.01em;
`

const PrincipleDesc = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-muted);
`

const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
`

const WhyItem = styled.div`
  padding: 44px;
  background: var(--bg-card);
  transition: background 0.3s;
  display: flex;
  gap: 22px;
  &:hover { background: var(--bg-lift); }
`

const WhyIcon = styled.div`
  width: 40px; height: 40px;
  border: 1px solid var(--border-mid);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--green);
  flex-shrink: 0;
`

const WhyText = styled.div``

const WhyName = styled.h4`
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 10px;
`

const WhyDesc = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 1.75;
  color: var(--text-muted);
`

export default function About() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-reveal]')
    if (!els) return
    els.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' }
        }
      )
    })
  }, [])

  return (
    <Section id="about" ref={ref}>
      <Inner>
        <Header data-reveal>
          <div>
            <SectionLabel>About Synapse IT</SectionLabel>
            <SectionTitle>
              A company built on<br />
              <em>conviction and craft.</em>
            </SectionTitle>
          </div>
          <HeaderRight>
            Based in Italy. Delivering internationally. A team of 40+ engineers,
            designers, and specialists building software that lasts.
          </HeaderRight>
        </Header>

        <PhilosophyBlock data-reveal>
          <Quote>
            &ldquo;Software built with discipline and designed with intention
            produces better business outcomes than software built by committee.&rdquo;
          </Quote>
          <PhilosophyBody>
            We are not a staffing agency. We are not a generalist consultancy.
            We are a software development company that holds itself accountable to
            the quality of its work and the success of its clients&apos; products.
            Our clients range from funded startups to established mid-market companies —
            all of whom share a need for technical partners who deliver with consistency and care.
          </PhilosophyBody>
        </PhilosophyBlock>

        <Numbers data-reveal>
          {[
            { val: '40+', label: 'Practitioners' },
            { val: '5',   label: 'Disciplines' },
            { val: '8+',  label: 'Years Delivering' },
            { val: '98%', label: 'Client Retention' },
          ].map(({ val, label }) => (
            <NumItem key={label}>
              <NumVal>
                {val.replace(/[+%]/, '')}<span>{val.match(/[+%]/)?.[0] || ''}</span>
              </NumVal>
              <NumLabel>{label}</NumLabel>
            </NumItem>
          ))}
        </Numbers>

        <PrinciplesGrid data-reveal>
          {[
            {
              name: 'Substance Over Speed',
              desc: 'We don\'t optimise for velocity at the expense of quality. Every decision — from architecture to deployment — is made with the product\'s long-term health in mind.',
            },
            {
              name: 'Transparency as Standard',
              desc: 'You see what we see. Progress, challenges, risks, and trade-offs are communicated directly and promptly. No filtering, no posturing.',
            },
            {
              name: 'Ownership, Not Attendance',
              desc: 'Our teams take responsibility for outcomes, not just tasks. When something isn\'t working, we raise it. When something can be better, we propose it.',
            },
            {
              name: 'Partners, Not Vendors',
              desc: 'We invest in understanding your business with the same rigour we bring to understanding your codebase. The best engineering decisions require commercial context.',
            },
            {
              name: 'Cross-Functional by Design',
              desc: 'Engineering, design, QA, and DevOps collaborate daily — not as separate departments handing off deliverables. This integrated structure eliminates the gaps where quality erodes.',
            },
            {
              name: 'Built for the Long Term',
              desc: 'Our highest-value relationships span years. We retain 98% of clients because we treat every engagement as the beginning of a partnership, not a transaction.',
            },
          ].map((p, i) => (
            <Principle key={p.name}>
              <PrincipleNum>{String(i + 1).padStart(2, '0')}</PrincipleNum>
              <PrincipleName>{p.name}</PrincipleName>
              <PrincipleDesc>{p.desc}</PrincipleDesc>
            </Principle>
          ))}
        </PrinciplesGrid>

        <WhyGrid data-reveal>
          {[
            { icon: '🇮🇹', name: 'European Business Presence', desc: 'Headquartered in Milan with EU-compliant operations, aligned to European business hours and regulatory standards.' },
            { icon: '⚡', name: 'Senior-Weighted Teams', desc: 'Our staff is composed of experienced specialists — not junior developers learning on your project. Seniority is the baseline.' },
            { icon: '⚙️', name: 'Commercially Flexible', desc: 'Resource augmentation, hourly advisory, or fixed-scope delivery. We match the commercial structure to the project reality.' },
            { icon: '📊', name: 'Competitive Without Compromise', desc: 'Strong value-to-cost ratio without sacrificing code quality, communication standards, or delivery reliability.' },
          ].map(({ icon, name, desc }) => (
            <WhyItem key={name}>
              <WhyIcon>{icon}</WhyIcon>
              <WhyText>
                <WhyName>{name}</WhyName>
                <WhyDesc>{desc}</WhyDesc>
              </WhyText>
            </WhyItem>
          ))}
        </WhyGrid>
      </Inner>
    </Section>
  )
}
