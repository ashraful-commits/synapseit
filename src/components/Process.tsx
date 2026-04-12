'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Section = styled.section`
  background: var(--bg);
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

const Steps = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0; bottom: 0;
    width: 1px;
    background: var(--border);
  }
`

const Step = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 40px;
  padding: 0 0 72px;
  position: relative;
`

const StepDot = styled.div`
  position: relative;
  z-index: 1;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`

const Dot = styled.div<{ active?: boolean }>`
  width: 11px; height: 11px;
  border-radius: 50%;
  border: 2px solid ${({ active }) => active ? 'var(--green)' : 'var(--border-mid)'};
  background: ${({ active }) => active ? 'var(--green)' : 'var(--bg)'};
  transition: all 0.4s ease;
  box-shadow: ${({ active }) => active ? '0 0 14px var(--green)' : 'none'};
`

const StepContent = styled.div``

const StepNum = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--green-dim);
  margin-bottom: 16px;
`

const StepName = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(26px, 2.8vw, 40px);
  font-weight: 300;
  color: var(--text);
  margin-bottom: 20px;
  letter-spacing: -0.01em;
  line-height: 1.1;
`

const StepBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
`

const StepDesc = styled.p`
  font-size: 15px;
  font-weight: 300;
  line-height: 1.85;
  color: var(--text-muted);
`

const StepMeta = styled.div``

const MetaItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  font-weight: 400;
  color: var(--text-muted);
  display: flex;
  gap: 12px;
  &::before {
    content: '↗';
    color: var(--green);
    font-size: 12px;
    flex-shrink: 0;
    margin-top: 1px;
  }
`

const MetaLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
`

const steps = [
  {
    name: 'Discover',
    desc: 'Understanding your business objectives, user needs, technical landscape, and competitive context. We identify constraints early, define measurable success criteria, and ensure alignment across stakeholders.',
    deliverables: ['Stakeholder and domain interviews', 'User research and competitive analysis', 'Technical feasibility assessment', 'Documented scope and success metrics'],
  },
  {
    name: 'Plan',
    desc: 'Architects and technical leads define the system design, data models, integration points, and technology stack. Delivery managers structure the roadmap into milestones with clear dependencies and risk mitigation.',
    deliverables: ['System and data architecture documentation', 'Technology and platform selection rationale', 'Sprint plan and milestone roadmap', 'Risk register and mitigation protocols'],
  },
  {
    name: 'Design',
    desc: 'Our design practice starts with user flows and information architecture, progresses through wireframes and interactive prototypes, and validates decisions with real users before engineering commitment.',
    deliverables: ['User journey mapping and flow diagrams', 'Interactive prototypes for key workflows', 'Design system with reusable components', 'Usability validation with target users'],
  },
  {
    name: 'Develop',
    desc: 'We build in focused two-week sprints, delivering working software at every cycle. Continuous integration ensures code quality, automated testing catches regressions, and every sprint closes with a working demonstration.',
    deliverables: ['Sprint-based delivery with bi-weekly demos', 'Continuous integration and deployment pipeline', 'Code review and quality gate enforcement', 'Real-time progress visibility through project tools'],
  },
  {
    name: 'Test',
    desc: 'QA runs alongside development — not after it. Our engineers build automated test suites covering functional, performance, security, and accessibility dimensions. Manual exploratory testing targets edge cases.',
    deliverables: ['Automated regression and end-to-end test suites', 'Performance and load testing under realistic conditions', 'Security assessment and vulnerability scanning', 'Cross-browser and cross-device validation'],
  },
  {
    name: 'Deploy',
    desc: 'We manage production deployments with staged rollout strategies, automated rollback procedures, and comprehensive monitoring from the first minute in production. Infrastructure is defined as code.',
    deliverables: ['Staged deployment with canary or blue-green strategies', 'Automated rollback and recovery procedures', 'Production monitoring and alerting setup', 'Infrastructure-as-code documentation'],
  },
  {
    name: 'Optimize',
    desc: 'Post-launch, we monitor performance, analyse user behaviour, and identify optimisation opportunities. Iterative improvements are prioritised based on data — not intuition — ensuring every change delivers measurable value.',
    deliverables: ['Performance monitoring and anomaly detection', 'User analytics and behaviour insights', 'Iterative feature improvement based on data', 'Ongoing maintenance and technical health reviews'],
  },
]

export default function Process() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stepEls = ref.current?.querySelectorAll('[data-step]')
    if (!stepEls) return

    stepEls.forEach((el) => {
      const dot = el.querySelector('[data-dot]')
      gsap.fromTo(el,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          }
        }
      )
      if (dot) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          onEnter: () => {
            gsap.to(dot, { backgroundColor: 'var(--green)', borderColor: 'var(--green)', duration: 0.4, ease: 'power2.out' })
          },
          onLeaveBack: () => {
            gsap.to(dot, { backgroundColor: 'var(--bg)', borderColor: 'var(--border-mid)', duration: 0.4 })
          }
        })
      }
    })
  }, [])

  return (
    <Section id="process">
      <Inner>
        <Header>
          <div>
            <SectionLabel>How We Deliver</SectionLabel>
            <SectionTitle>
              A process built on<br />
              <em>discipline, not improvisation.</em>
            </SectionTitle>
          </div>
          <HeaderRight>
            Seven defined stages. Clear outputs at each gate. Every phase has
            measurable outcomes, review points, and documented decisions — so you
            always know where things stand.
          </HeaderRight>
        </Header>

        <Steps ref={ref}>
          {steps.map((s, i) => (
            <Step key={s.name} data-step>
              <StepDot>
                <Dot data-dot />
              </StepDot>
              <StepContent>
                <StepNum>{String(i + 1).padStart(2, '0')} — {s.name}</StepNum>
                <StepName>{s.name}</StepName>
                <StepBody>
                  <StepDesc>{s.desc}</StepDesc>
                  <StepMeta>
                    <MetaLabel>Deliverables</MetaLabel>
                    {s.deliverables.map(d => (
                      <MetaItem key={d}>{d}</MetaItem>
                    ))}
                  </StepMeta>
                </StepBody>
              </StepContent>
            </Step>
          ))}
        </Steps>
      </Inner>
    </Section>
  )
}
