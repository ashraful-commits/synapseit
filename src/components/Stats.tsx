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
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 80px 0;
  overflow: hidden;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 64px;
`

const Item = styled.div<{ last?: boolean }>`
  padding: 32px 40px;
  border-right: ${({ last }) => last ? 'none' : '1px solid var(--border)'};
  &:first-of-type { padding-left: 0; }
`

const Num = styled.div`
  font-family: var(--font-display);
  font-size: clamp(46px, 4.8vw, 68px);
  font-weight: 300;
  color: var(--text);
  line-height: 1;
  letter-spacing: -0.02em;

  .suffix { color: var(--green); }
`

const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 12px;
  line-height: 1.5;
`

const stats = [
  { num: 120, suffix: '+', label: 'Products Shipped' },
  { num: 8,   suffix: '+', label: 'Years Operating' },
  { num: 40,  suffix: '+', label: 'Specialists on Staff' },
  { num: 98,  suffix: '%', label: 'Client Retention' },
  { num: 15,  suffix: '+', label: 'Markets Served' },
  { num: 99.9,suffix: '%', label: 'Uptime Delivered', decimal: true },
]

export default function Stats() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const items = ref.current?.querySelectorAll('[data-num]')
    if (!items) return

    items.forEach(el => {
      const target = parseFloat(el.getAttribute('data-num') || '0')
      const isDecimal = el.getAttribute('data-decimal') === 'true'
      const obj = { val: 0 }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = isDecimal
                ? obj.val.toFixed(1)
                : Math.round(obj.val).toString()
            }
          })
        }
      })
    })
  }, [])

  return (
    <Section ref={ref}>
      <Grid>
        {stats.map(({ num, suffix, label, decimal }, i) => (
          <Item key={label} last={i === stats.length - 1}>
            <Num>
              <span
                data-num={num}
                data-decimal={decimal ? 'true' : 'false'}
              >0</span>
              <span className="suffix">{suffix}</span>
            </Num>
            <Label>{label}</Label>
          </Item>
        ))}
      </Grid>
    </Section>
  )
}
