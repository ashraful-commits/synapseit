'use client'

import styled from '@emotion/styled'

const FooterEl = styled.footer`
  background: var(--bg);
  border-top: 1px solid var(--border);
  padding: 88px 64px 52px;

  @media (max-width: 768px) {
    padding: 60px 24px 32px;
  }
`

const Inner = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`

const Top = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  padding-bottom: 68px;
  border-bottom: 1px solid var(--border);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding-bottom: 40px;
  }
`

const Brand = styled.div``

const Logo = styled.div`
  font-family: var(--font-body);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
  span { color: var(--green); }
`

const BrandDesc = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 1.85;
  color: var(--text-muted);
  max-width: 300px;
  margin-bottom: 28px;
`

const EmailLink = styled.a`
  font-family: var(--font-display);
  font-size: 17px;
  font-style: italic;
  color: var(--green);
  transition: color 0.25s;
  &:hover { color: var(--green-bright); }
`

const Col = styled.div``

const ColTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 26px;
`

const Links = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const LinkItem = styled.a`
  font-size: 14px;
  font-weight: 300;
  color: var(--text-muted);
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 1px;
    background: var(--green);
    transition: width 0.3s var(--ease-expo);
  }
  &:hover {
    color: var(--text);
    &::before { width: 14px; }
  }
`

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 36px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`

const Copyright = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: var(--text-dim);
  letter-spacing: 0.02em;
`

const BottomLinks = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
  }
`

const BottomLink = styled.a`
  font-size: 12px;
  font-weight: 400;
  color: var(--text-dim);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.2s;
  &:hover { color: var(--text-muted); }
`

export default function Footer() {
  return (
    <FooterEl>
      <Inner>
        <Top>
          <Brand>
            <Logo>Synapse <span>IT</span></Logo>
            <BrandDesc>
              Software development company based in Milan, Italy.
              We build web applications, mobile products, and cloud
              infrastructure with the rigour and refinement your business demands.
            </BrandDesc>
            <EmailLink href="mailto:hello@synapseit.com">hello@synapseit.com</EmailLink>
          </Brand>

          <Col>
            <ColTitle>Explore</ColTitle>
            <Links>
              {[
                { label: 'Services', href: '#services' },
                { label: 'Engagement Models', href: '#engagement' },
                { label: 'Process', href: '#process' },
                { label: 'Selected Work', href: '#work' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' },
              ].map(l => (
                <li key={l.label}>
                  <LinkItem href={l.href}>{l.label}</LinkItem>
                </li>
              ))}
            </Links>
          </Col>

          <Col>
            <ColTitle>Services</ColTitle>
            <Links>
              {[
                'Web Applications',
                'Mobile Development',
                'QA & Test Automation',
                'UI/UX Design',
                'DevOps & Cloud',
              ].map(s => (
                <li key={s}>
                  <LinkItem href="#services">{s}</LinkItem>
                </li>
              ))}
            </Links>
          </Col>

          <Col>
            <ColTitle>Connect</ColTitle>
            <Links>
              <li><LinkItem href="mailto:hello@synapseit.com">hello@synapseit.com</LinkItem></li>
              <li><LinkItem href="#">LinkedIn</LinkItem></li>
              <li><LinkItem href="#">GitHub</LinkItem></li>
              <li><LinkItem href="#">Twitter / X</LinkItem></li>
              <li><LinkItem href="#" style={{ marginTop: 8 }}>Milan, Italy</LinkItem></li>
            </Links>
          </Col>
        </Top>

        <Bottom>
          <Copyright>© {new Date().getFullYear()} Synapse IT S.r.l. All rights reserved.</Copyright>
          <BottomLinks>
            <BottomLink href="#">Privacy Policy</BottomLink>
            <BottomLink href="#">Terms of Service</BottomLink>
            <BottomLink href="#">Cookies</BottomLink>
          </BottomLinks>
        </Bottom>
      </Inner>
    </FooterEl>
  )
}
