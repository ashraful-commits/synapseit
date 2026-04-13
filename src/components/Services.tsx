'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Section = styled.section<{ bgColor: string, showPattern: boolean }>`
  background: ${({ bgColor }) => bgColor};
  padding: 140px 0;
  transition: background-color 0.5s ease-out;
  will-change: background-color;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: ${({ showPattern }) => showPattern ? 0.04 : 0};
    background: repeating-linear-gradient(45deg, var(--text) 0, var(--text) 1px, transparent 0, transparent 50%);
    background-size: 24px 24px;
    transition: opacity 0.5s ease;
    pointer-events: none;
    z-index: 0;
  }
`

const Inner = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 64px;
  position: relative;
  z-index: 2;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: end;
  margin-bottom: 60px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    margin-bottom: 100px;
  }
`

const Left = styled.div``

const SectionLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  &::before {
    content: '';
    display: block;
    width: 32px;
    height: 2px;
    background: var(--accent);
  }
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(48px, 6vw, 90px);
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text);
  line-height: 0.95;
  letter-spacing: -0.03em;

  @media (max-width: 768px) {
    font-size: clamp(24px, 11vw, 38px);
    line-height: 1.1;
    word-break: normal;
    overflow-wrap: break-word;
  }

  em {
    font-style: italic;
    color: var(--accent);
  }
`

const Right = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 460px;
  align-self: end;
`

const ServicesList = styled.div`
  border-top: 1px solid var(--border);
`

const ServiceItem = styled.div<{ active: boolean }>`
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
`

const ServiceHeader = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 40px 0;
  gap: 32px;
  transition: opacity 0.3s, transform 0.4s ease-out;

  &:hover {
    opacity: 1 !important;
    transform: translateX(24px);
  }

  @media (max-width: 768px) {
    padding: 32px 0;
    gap: 12px;
    flex-wrap: wrap;
    &:hover { transform: none; }
  }
`

const ServiceNum = styled.span`
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dim);
  letter-spacing: 0.08em;
  min-width: 36px;

  @media (max-width: 768px) {
    font-size: 12px;
    min-width: 24px;
  }
`

const ServiceName = styled.h3<{ active: boolean }>`
  font-family: var(--font-display);
  font-size: clamp(32px, 4.5vw, 68px);
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ active }) => active ? 'var(--text)' : 'transparent'};
  -webkit-text-stroke: ${({ active }) => active ? '0px' : '1px var(--border-mid)'};
  flex: 1;
  transition: color 0.3s, -webkit-text-stroke 0.3s;
  letter-spacing: -0.02em;
  line-height: 1.0;
  position: relative;

  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 1.2;
    -webkit-text-stroke: ${({ active }) => active ? '0px' : '0.5px var(--border-mid)'};
  }

  &::before {
    content: attr(data-text);
    position: absolute;
    left: 0; top: 0;
    color: var(--accent);
    -webkit-text-stroke: 0px;
    white-space: nowrap;
    overflow: hidden;
    width: 0%;
    transition: width 0.6s var(--ease-expo);
  }

  @media (max-width: 768px) {
    &::before { display: none; } /* Disable progressive fill on mobile to prevent overflow */
  }

  ${ServiceItem}:hover &::before {
    width: 100%;
  }
`

const ServiceMeta = styled.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.9;
  min-width: 140px;
  text-align: right;

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    margin-left: 36px;
    font-size: 11px;
    order: 3;
    margin-top: -8px;
  }
`

const PlusIcon = styled.span<{ active: boolean }>`
  width: 44px; height: 44px;
  border: 1px solid var(--border-mid);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.35s ease;
  font-size: 24px;
  line-height: 1;
  transform: ${({ active }) => active ? 'rotate(45deg)' : 'rotate(0deg)'};
  border-color: ${({ active }) => active ? 'var(--accent)' : 'var(--border-mid)'};
  color: ${({ active }) => active ? 'var(--bg)' : 'var(--text-muted)'};
  background: ${({ active }) => active ? 'var(--accent)' : 'transparent'};
`

const ServiceBody = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  padding: 0 0 54px 0;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    padding: 0 0 54px 68px;
  }
`

const ServiceDesc = styled.p`
  font-size: 15px;
  font-weight: 300;
  line-height: 1.85;
  color: var(--text-muted);
`

const ServiceStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const StackLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 4px;
`

const StackTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const StackTag = styled.span`
  padding: 6px 14px;
  border: 1px solid var(--border-mid);
  font-size: 12px;
  font-weight: 400;
  color: var(--text-muted);
  letter-spacing: 0.03em;
  border-radius: 2px;
  transition: border-color 0.2s, color 0.2s;
  &:hover { border-color: var(--green-dim); color: var(--green); }
`

const Outcomes = styled.div`
  margin-top: 24px;
`

const OutcomeItem = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: var(--text-muted);
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 12px;
  &::before { content: '→'; color: var(--green); flex-shrink: 0; }
`

const services = [
  {
    name: 'Web Application Development',
    metric: '60+ platforms',
    desc: 'SaaS platforms, enterprise tools, data-intensive dashboards, and multi-tenant systems. Architecture decisions are driven by your product roadmap and the operational reality of keeping software healthy over years, not weeks.',
    stack: ['React', 'Next.js', 'Node.js', 'Python', 'PostgreSQL', 'GraphQL'],
    outcomes: [
      'Production-ready systems with sub-200ms response times',
      'Architectures that support 10× growth without rework',
      'Faster time-to-market with parallel workstreams',
    ],
    img: '/images/fintech.png',
    bg: '#001a99', // Bright Electric Blue
  },
  {
    name: 'Mobile Application Development',
    metric: '30+ apps shipped',
    desc: 'iOS, Android, React Native, Flutter — performance benchmarks, accessibility standards, and app store strategy are engineered into the process from the first sprint. We evaluate platform strategy based on audience, timeline, and long-term maintenance.',
    stack: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase', 'AWS Amplify'],
    outcomes: [
      'Store-ready applications with optimised submission packages',
      '4.5+ average store ratings across delivered products',
      'Compliant architectures for regulated market segments',
    ],
    img: '/images/telehealth.png',
    bg: '#330099', // Intense Purple
  },
  {
    name: 'QA & Test Automation',
    metric: '92% avg coverage',
    desc: 'Testing at Synapse IT is embedded into the delivery process, not appended to it. Our QA engineers design test strategies, build automation frameworks, and integrate them into CI/CD pipelines — reducing regression risk at every stage.',
    stack: ['Cypress', 'Playwright', 'Jest', 'Selenium', 'k6', 'GitHub Actions'],
    outcomes: [
      'Regression testing reduced from days to hours',
      'Test coverage consistently above 85% across projects',
      'Fewer production incidents through preventive testing',
    ],
    img: '/images/ecommerce.png',
    bg: '#990033', // Deep Crimson/Pink
  },
  {
    name: 'UI/UX Design',
    metric: '40+ products',
    desc: 'Research-driven interfaces that convert and scale. We build design systems that scale across products, create prototypes that validate assumptions before engineering begins, and deliver interfaces that reduce friction while reinforcing brand credibility.',
    stack: ['Figma', 'Prototyping', 'Design Systems', 'User Testing', 'Accessibility', 'Motion Design'],
    outcomes: [
      'Measurable improvements in task completion and conversion',
      'Scalable design systems reducing future development cost',
      'Consistent brand experience across platforms and touchpoints',
    ],
    img: '/images/ecommerce.png',
    bg: '#006644', // Emerald Green
  },
  {
    name: 'DevOps & Cloud Engineering',
    metric: '99.97% uptime',
    desc: 'Infrastructure treated as a product — versioned, monitored, improved. We architect cloud environments that balance performance, security, and cost. Every environment is defined as code, reviewed like application code, and deployed through automated pipelines.',
    stack: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Terraform', 'Datadog'],
    outcomes: [
      '99.97% uptime across production environments',
      'Cloud cost reductions of 25–40% through governance',
      'Deployment frequency increased from weekly to multiple daily',
    ],
    img: '/images/fintech.png',
    bg: '#004499', // Ocean Blue
  },
]

export default function Services() {
  const [active, setActive] = useState<number | null>(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const items = ref.current?.querySelectorAll('.gsap-service-item')
    if (!items) return
    gsap.fromTo(items,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        }
      }
    )
  }, [])

  useEffect(() => {
    bodyRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === active) {
        gsap.to(el, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power3.out' })
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: 'power3.in' })
      }
    })
  }, [active])

  // Determine background color based on hover state, fallback to global background
  const bgColor = hoveredIdx !== null ? services[hoveredIdx].bg : 'var(--bg)'

  return (
    <Section id="services" bgColor={bgColor} showPattern={hoveredIdx !== null}>
      <Inner>
        <Header>
          <Left>
            <SectionLabel>What We Build</SectionLabel>
            <SectionTitle>
              Five disciplines,<br />
              <em>one integrated team.</em>
            </SectionTitle>
          </Left>
          <Right>
            Engineering, design, QA, and DevOps work as a single delivery unit —
            not separate departments handing off through queues. Every capability
            below is staffed by senior practitioners.
          </Right>
        </Header>

        <ServicesList ref={ref}>
          {services.map((s, i) => (
            <ServiceItem
              key={s.name}
              className="gsap-service-item"
              active={active === i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setActive(active === i ? null : i)}
              data-cursor-img={s.img}
            >
              <ServiceHeader active={active === i}>
                <ServiceNum>{String(i + 1).padStart(2, '0')}</ServiceNum>
                <ServiceName active={active === i} data-text={s.name}>{s.name}</ServiceName>
                <ServiceMeta>{s.metric}</ServiceMeta>
                <PlusIcon active={active === i}>+</PlusIcon>
              </ServiceHeader>

              <div
                ref={el => { bodyRefs.current[i] = el }}
                style={{ height: i === 0 ? 'auto' : 0, opacity: i === 0 ? 1 : 0, overflow: 'hidden' }}
              >
                <ServiceBody>
                  <div>
                    <ServiceDesc>{s.desc}</ServiceDesc>
                    <Outcomes>
                      {s.outcomes.map(o => <OutcomeItem key={o}>{o}</OutcomeItem>)}
                    </Outcomes>
                  </div>
                  <ServiceStack>
                    <StackLabel>Technology Stack</StackLabel>
                    <StackTags>
                      {s.stack.map(t => <StackTag key={t}>{t}</StackTag>)}
                    </StackTags>
                  </ServiceStack>
                </ServiceBody>
              </div>
            </ServiceItem>
          ))}
        </ServicesList>
      </Inner>
    </Section>
  )
}