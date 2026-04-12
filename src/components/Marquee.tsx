'use client'

import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`

const Wrapper = styled.div`
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 22px 0;
  background: var(--bg-soft);
`

const Track = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 32s linear infinite;
  &:hover { animation-play-state: paused; }
`

const Item = styled.span`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 40px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
  white-space: nowrap;
  transition: color 0.25s;

  &:hover { color: var(--text-muted); }

  &::after {
    content: '·';
    color: var(--green);
    font-size: 16px;
    opacity: 0.7;
  }
`

const items = [
  'ISO 27001 Compliant',
  'GDPR Ready',
  'AWS Partner Network',
  'Agile Certified',
  '120+ Products Shipped',
  '98% Client Retention',
  '15+ Markets Served',
  '99.9% Uptime Delivered',
  '8+ Years Operating',
  '40+ Specialists',
  'Milan, Italy',
  'European Business Presence',
]

export default function Marquee() {
  const doubled = [...items, ...items]
  return (
    <Wrapper>
      <Track>
        {doubled.map((item, i) => (
          <Item key={i}>{item}</Item>
        ))}
      </Track>
    </Wrapper>
  )
}
