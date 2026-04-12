'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'

const Nav = styled.nav<{ scrolled: boolean }>`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 64px;
  height: 84px;
  transition: background 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease;
  background: ${({ scrolled }) => scrolled ? 'rgba(7, 13, 10, 0.90)' : 'transparent'};
  backdrop-filter: ${({ scrolled }) => scrolled ? 'blur(24px) saturate(160%)' : 'none'};
  border-bottom: 1px solid ${({ scrolled }) => scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'};
`

const Logo = styled.a`
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 2px;

  .word { color: var(--text); }
  .accent {
    color: var(--accent);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0; right: 0;
      height: 1px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
  }
  &:hover .accent::after { transform: scaleX(1); }
`

const Links = styled.ul`
  display: flex;
  list-style: none;
  gap: 40px;
  align-items: center;
`

const Link = styled.a`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  position: relative;
  transition: color 0.25s;

  &::before {
    content: attr(data-text);
    position: absolute;
    left: 0; top: 0;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    width: 0%;
    transition: width 0.35s var(--ease-expo);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: var(--accent);
    transition: width 0.35s var(--ease-expo);
  }

  &:hover {
    color: var(--text-muted);
    &::before { width: 100%; }
    &::after { width: 100%; }
  }
`

const CTA = styled.a`
  padding: 11px 28px;
  border: 1px solid var(--border-mid);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s;

  &:hover {
    background: var(--green);
    border-color: var(--green);
    color: var(--bg);
    transform: translateY(-1px);
  }
`

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -84, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.3 }
    )
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Nav ref={navRef} scrolled={scrolled}>
      <Logo href="/">
        <span className="word">Synapse</span>&nbsp;
        <span className="accent">IT</span>
      </Logo>

      <Links>
        {[
          { label: 'Services', href: '#services' },
          { label: 'Engagement', href: '#engagement' },
          { label: 'Process', href: '#process' },
          { label: 'Work', href: '#work' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
        ].map(({ label, href }) => (
          <li key={label}>
            <Link href={href} data-text={label}>{label}</Link>
          </li>
        ))}
      </Links>

      <CTA href="#contact">Get Started</CTA>
    </Nav>
  )
}
