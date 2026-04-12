'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Outer = styled.section`
  background: var(--bg-soft);
  overflow: hidden;
`

const Sticky = styled.div`
  position: relative;
`

const Header = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 140px 64px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: end;
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
  max-width: 400px;
  align-self: end;
`

const HScroll = styled.div`
  overflow: hidden;
  border-top: 1px solid var(--border);
`

const Strip = styled.div`
  display: flex;
  will-change: transform;
`

const CardImageContainer = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.6s ease-out, transform 1s ease-out;
  transform: scale(1.05);
  z-index: 0;
`

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(6, 11, 18, 0.85); // Matches var(--bg-lift) heavily transparent
  z-index: 1;
  transition: background 0.6s ease;
`

const Card = styled.div`
  flex-shrink: 0;
  width: 62vw;
  min-height: 70vh;
  border-right: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
  
  &:hover { 
    ${CardImageContainer} { opacity: 0.35; transform: scale(1); }
    ${CardOverlay} { background: rgba(5, 8, 12, 0.65); }
  }
`


const CardLeft = styled.div`
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--border);
  position: relative;
  z-index: 5;
`

const CardTop = styled.div``

const IndustryTag = styled.div`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  span { color: var(--text-dim); }
`

const ClientInitial = styled.div`
  width: 58px; height: 58px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(8px);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 300;
  color: var(--text);
  margin-bottom: 28px;
`

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(34px, 3.2vw, 50px);
  font-weight: 300;
  color: var(--text);
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin-bottom: 24px;
`

const ChallengeLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
`

const ChallengeText = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-muted);
`

const CardBottom = styled.div``

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`

const TechTag = styled.span`
  padding: 6px 13px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  border-radius: 2px;
`

const CardRight = styled.div`
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 5;
`

const ResultBlock = styled.div``

const ResultLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 14px;
`

const ResultText = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--text-muted);
`

const Visual = styled.div<{ imgUrl?: string }>`
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.1);
  background: ${({ imgUrl }) => imgUrl ? `url(${imgUrl})` : 'rgba(0,0,0,0.4)'};
  background-size: cover;
  background-position: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    z-index: 0;
  }
`

const VisualMetric = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  margin-top: auto;
  padding-bottom: 30px;
`

const BigNum = styled.div`
  font-family: var(--font-display);
  font-size: 62px;
  font-weight: 300;
  color: var(--bg);
  text-shadow: 0 4px 20px rgba(0,0,0,0.4);
  letter-spacing: -0.03em;
  line-height: 1;
  span { color: var(--green); }
`

const BigLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bg-soft);
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  margin-top: 10px;
`

const cases = [
  {
    client: 'F',
    industry: 'Financial Services',
    services: 'Web Platform · Real-time Architecture',
    title: 'FinTrack Pro',
    challenge: 'Legacy analytics platform losing users — 3s+ response times, monolithic architecture preventing independent releases.',
    result: 'Sub-200ms response times. 300% user growth in six months. Weekly independent releases enabled.',
    metric: '300%',
    metricLabel: 'User Growth',
    tech: ['React', 'Node.js', 'WebSocket', 'Redis', 'PostgreSQL'],
    imgUrl: '/images/fintech.png',
  },
  {
    client: 'M',
    industry: 'Healthcare',
    services: 'Mobile App · Cloud Infrastructure',
    title: 'Meridian Health',
    challenge: 'No unified HIPAA-compliant telehealth platform across three regulated markets. Regulatory approval required before launch.',
    result: '50K+ patients in first quarter. 4.8★ store rating. Zero security incidents in 12 months of operation.',
    metric: '50K+',
    metricLabel: 'Patients Onboarded',
    tech: ['React Native', 'AWS', 'WebRTC', 'Terraform', 'Datadog'],
    imgUrl: '/images/telehealth.png',
  },
  {
    client: 'A',
    industry: 'E-Commerce',
    services: 'UI/UX Design · Web Application',
    title: 'Artisan Marketplace',
    challenge: '68% cart abandonment rate, no design system, inconsistent experience across four language markets.',
    result: 'Cart abandonment reduced to 31%. Average order value increased by 22%. Expanded into two additional European markets.',
    metric: '−37%',
    metricLabel: 'Cart Abandonment',
    tech: ['Next.js', 'Stripe Connect', 'Figma', 'Storybook', 'i18n'],
    imgUrl: '/images/ecommerce.png',
  },
  {
    client: 'L',
    industry: 'Logistics & Supply Chain',
    services: 'DevOps & Cloud',
    title: 'Logistics Hub',
    challenge: '40+ services on ageing on-premise infrastructure. Mounting downtime, spiralling costs, unable to scale during peak periods.',
    result: 'Operational costs reduced by 40%. Uptime improved to 99.97%. Deployment frequency from monthly to multiple daily.',
    metric: '−40%',
    metricLabel: 'Operational Cost',
    tech: ['AWS', 'Kubernetes', 'Terraform', 'Prometheus', 'GitHub Actions'],
    imgUrl: '/images/fintech.png',
  },
  {
    client: 'Q',
    industry: 'B2B SaaS',
    services: 'QA & Test Automation',
    title: 'Quality Matrix',
    challenge: '3 full days on manual regression testing before every release. Test coverage at 34%. Production bugs increasing.',
    result: 'Regression testing reduced from 3 days to 4 hours. Test coverage increased to 92%. Production incidents dropped 74%.',
    metric: '92%',
    metricLabel: 'Test Coverage',
    tech: ['Cypress', 'Playwright', 'Jest', 'k6', 'GitHub Actions'],
    imgUrl: '/images/ecommerce.png',
  },
]

export default function Work() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const strip = stripRef.current
    if (!outer || !strip) return

    const ctx = gsap.context(() => {
      const totalWidth = strip.scrollWidth - window.innerWidth

      gsap.to(strip, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: `+=${totalWidth * 1.1}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        }
      })
    }, outer)

    return () => ctx.revert()
  }, [])

  return (
    <Outer id="work">
      <Header>
        <div>
          <SectionLabel>Selected Work</SectionLabel>
          <SectionTitle>
            Problems solved,<br />
            <em>outcomes measured.</em>
          </SectionTitle>
        </div>
        <HeaderRight>
          Every project below involved cross-functional delivery — engineering,
          design, QA, and DevOps working as one team toward measurable business outcomes.
        </HeaderRight>
      </Header>

      <Sticky ref={outerRef}>
        <HScroll>
          <Strip ref={stripRef}>
            {cases.map((c) => (
              <Card key={c.title} data-cursor-text="DRAG">
                <CardImageContainer style={{ backgroundImage: `url(${c.imgUrl})` }} />
                <CardOverlay />
                
                <CardLeft>
                  <CardTop>
                    <ClientInitial>{c.client}</ClientInitial>
                    <IndustryTag>
                      {c.industry} <span>·</span> {c.services}
                    </IndustryTag>
                    <CardTitle>{c.title}</CardTitle>
                    <ChallengeLabel>Challenge</ChallengeLabel>
                    <ChallengeText>{c.challenge}</ChallengeText>
                  </CardTop>
                  <CardBottom>
                    <TagRow>
                      {c.tech.map(t => <TechTag key={t}>{t}</TechTag>)}
                    </TagRow>
                  </CardBottom>
                </CardLeft>
                <CardRight>
                  <Visual imgUrl={c.imgUrl} data-cursor-video>
                    <VisualMetric>
                      <BigNum>{c.metric.includes('%') || c.metric.includes('+') || c.metric.includes('−')
                        ? <><span>{c.metric}</span></>
                        : c.metric}
                      </BigNum>
                      <BigLabel>{c.metricLabel}</BigLabel>
                    </VisualMetric>
                  </Visual>
                  <ResultBlock>
                    <ResultLabel>Result</ResultLabel>
                    <ResultText>{c.result}</ResultText>
                  </ResultBlock>
                </CardRight>
              </Card>
            ))}
          </Strip>
        </HScroll>
      </Sticky>
    </Outer>
  )
}
