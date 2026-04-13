'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import MagneticButton from './MagneticButton'
import { Scramble, VariableH, SkewReveal, WaveReveal, VelocitySkew, SplitLineReveal } from './TypoEffects'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Outer = styled.section`
  background: var(--bg);
  overflow: hidden;
`

const Sticky = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`

const Strip = styled.div`
  display: flex;
  width: max-content;
  height: 100%;
  will-change: transform;
`

const Card = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0 10vw;
  border-right: 1px solid rgba(255,255,255,0.05);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px 24px;
    gap: 20px;
    align-content: center;
  }
`

const BackgroundParallax = styled.div`
  position: absolute;
  inset: -10vw -40vw; /* Wider to allow parallax sliding */
  background: radial-gradient(circle at 50% 50%, rgba(26,74,255,0.05), rgba(5,8,12,1));
  z-index: 0;
  will-change: transform;
`

const ContentLayer = styled.div`
  position: relative;
  z-index: 10;
  max-width: 600px;
`

const RightLayer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TiltImageWrapper = styled(motion.div)<{ imgUrl: string }>`
  width: 80%;
  aspect-ratio: 16/10;
  border-radius: 8px;
  background-image: url(${props => props.imgUrl});
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8);
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    width: 100%;
  }
`

function TiltImage({ imgUrl }: { imgUrl: string }) {
  const ref = useRef<HTMLDivElement>(null)
  let x = useMotionValue(0)
  let y = useMotionValue(0)

  let mouseXSpring = useSpring(x, { damping: 20, stiffness: 150 })
  let mouseYSpring = useSpring(y, { damping: 20, stiffness: 150 })

  let rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15])
  let rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  return (
    <div style={{ perspective: 1500, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      <TiltImageWrapper
        ref={ref}
        imgUrl={imgUrl}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateX, rotateY }}
      />
    </div>
  )
}

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 64px);
  font-weight: 300;
  color: var(--text);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 40px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 24px;
  }
`

const IndustryTag = styled.div`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
`

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
    gap: 8px;
  }
`

const TechTag = styled.span`
  padding: 8px 16px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  border-radius: 40px;
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

  @media (max-width: 768px) {
    font-size: 42px;
  }
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
      let mm = gsap.matchMedia();
      const bgs = gsap.utils.toArray('.par-bg');
      
      mm.add("(min-width: 1px)", () => {
        // Fade in the cards
        const cards = gsap.utils.toArray('.par-card')
        gsap.fromTo(cards, 
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: outer,
              start: 'top 75%',
            }
          }
        )

        // Pin the outer container and scrub horizontally
        gsap.to(strip, {
          x: () => -(strip.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: outer,
            start: 'top top',
            end: () => `+=${(strip.scrollWidth - window.innerWidth) * 1.5}`,
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          }
        })

        // Add parallax to the backgrounds
        bgs.forEach((bg, i) => {
          gsap.to(bg as HTMLElement, {
            x: '40vw',
            ease: 'none',
            scrollTrigger: {
              trigger: outer,
              start: 'top top',
              end: () => `+=${(strip.scrollWidth - window.innerWidth) * 1.5}`,
              invalidateOnRefresh: true,
              scrub: 1.2,
            }
          })
        })
      });
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <Outer id="work">
      <Sticky ref={outerRef}>
        <Strip ref={stripRef}>
          {cases.map((c) => (
            <Card key={c.title} className="par-card">
              <BackgroundParallax className="par-bg" />
              
              <ContentLayer>
                <IndustryTag>
                  {c.industry} &nbsp;&mdash;&nbsp; {c.client}
                </IndustryTag>
                <CardTitle><SplitLineReveal text={c.title} /></CardTitle>
                
                <TagRow>
                  {c.tech.map(t => <TechTag key={t}><Scramble text={t} triggerOnHover={true} /></TechTag>)}
                </TagRow>

                <MagneticButton variant="primary">
                  View Case Study
                </MagneticButton>
              </ContentLayer>

              <RightLayer>
                <TiltImage imgUrl={c.imgUrl} />
              </RightLayer>
            </Card>
          ))}
        </Strip>
      </Sticky>
    </Outer>
  )
}
