'use client'

import { useRef, useState } from 'react'
import styled from '@emotion/styled'

const Section = styled.section`
  background: var(--bg);
  padding: 140px 0 0;
  overflow: hidden;
`

const Inner = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 64px;
`

const BigCTA = styled.div`
  text-align: center;
  padding-bottom: 100px;
  border-bottom: 1px solid var(--border);
`

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: 32px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  &::before, &::after {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: var(--green);
  }
`

const BigTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(54px, 8vw, 114px);
  font-weight: 300;
  color: var(--text);
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin-bottom: 32px;

  em {
    font-style: italic;
    color: var(--green);
  }
`

const BigSubtitle = styled.p`
  font-size: 17px;
  font-weight: 300;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 580px;
  margin: 0 auto 52px;
`

const CTARow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
`

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 20px 50px;
  background: var(--green);
  color: var(--bg);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: all 0.3s var(--ease-expo);

  svg { transition: transform 0.3s ease; }
  &:hover {
    background: var(--green-bright);
    transform: translateY(-3px);
    box-shadow: 0 28px 64px rgba(45, 216, 130, 0.32);
    svg { transform: translateX(5px); }
  }
`

const SecondaryBtn = styled.a`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-mid);
  padding-bottom: 3px;
  transition: color 0.25s, border-color 0.25s;
  &:hover { color: var(--text); border-color: var(--text-muted); }
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 28px;
  flex-wrap: wrap;
`

const MetaItem = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: var(--text-dim);
  letter-spacing: 0.03em;
  &:not(:last-child) {
    margin-right: 22px;
    padding-right: 22px;
    border-right: 1px solid var(--border-mid);
  }
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  padding: 100px 0;
`

const FormLeft = styled.div``

const FormTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(30px, 3.5vw, 50px);
  font-weight: 300;
  color: var(--text);
  margin-bottom: 36px;
  letter-spacing: -0.02em;
  line-height: 1.1;
  em { font-style: italic; color: var(--green); }
`

const ContactInfo = styled.div`
  padding: 36px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 36px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  &:not(:last-child) {
    margin-bottom: 26px;
    padding-bottom: 26px;
    border-bottom: 1px solid var(--border);
  }
`

const InfoLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
`

const InfoValue = styled.a`
  font-size: 15px;
  font-weight: 400;
  color: var(--text);
  transition: color 0.25s;
  &:hover { color: var(--green); }
`

const StepsList = styled.div``

const StepItem = styled.div`
  display: flex;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border);
  &:last-child { border-bottom: none; }
`

const StepBadge = styled.span`
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1px solid var(--green-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--green);
  flex-shrink: 0;
`

const StepText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--text-muted);
  line-height: 1.7;
  align-self: center;
`

const FormRight = styled.div``

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`

const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
`

const Input = styled.input`
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 300;
  padding: 14px 18px;
  border-radius: 2px;
  outline: none;
  transition: border-color 0.25s, background 0.25s;
  width: 100%;

  &::placeholder { color: var(--text-dim); }
  &:focus {
    border-color: var(--green-dim);
    background: var(--bg-lift);
  }
`

const Select = styled.select`
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 300;
  padding: 14px 18px;
  border-radius: 2px;
  outline: none;
  cursor: none;
  transition: border-color 0.25s;
  width: 100%;
  appearance: none;

  option { background: var(--bg-soft); }
  &:focus { border-color: var(--green-dim); }
`

const Textarea = styled.textarea`
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 300;
  padding: 14px 18px;
  border-radius: 2px;
  outline: none;
  resize: vertical;
  min-height: 150px;
  transition: border-color 0.25s, background 0.25s;
  width: 100%;
  line-height: 1.7;

  &::placeholder { color: var(--text-dim); }
  &:focus {
    border-color: var(--green-dim);
    background: var(--bg-lift);
  }
`

const SubmitBtn = styled.button<{ sent: boolean }>`
  padding: 18px 44px;
  background: ${({ sent }) => sent ? 'var(--green-dim)' : 'var(--green)'};
  color: var(--bg);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: all 0.3s var(--ease-expo);
  align-self: flex-start;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 50px rgba(45, 216, 130, 0.28);
    background: ${({ sent }) => sent ? 'var(--green-dim)' : 'var(--green-bright)'};
  }
`

export default function Contact() {
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    formRef.current?.reset()
  }

  return (
    <Section id="contact">
      <Inner>
        <BigCTA>
          <SectionLabel>Let&apos;s Build</SectionLabel>
          <BigTitle>
            Ready to discuss<br />
            <em>your next project?</em>
          </BigTitle>
          <BigSubtitle>
            Tell us what you&apos;re building, your timeline, and any constraints.
            We&apos;ll respond with an honest assessment of how we can help —
            and the right engagement model for your situation.
          </BigSubtitle>
          <CTARow>
            <PrimaryBtn href="mailto:hello@synapseit.com">
              Start the Conversation
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1 7.5h13M8.5 2l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </PrimaryBtn>
            <SecondaryBtn href="#services">See Engagement Models</SecondaryBtn>
          </CTARow>
          <MetaRow>
            <MetaItem>Response within 24 hours</MetaItem>
            <MetaItem>No commitment required</MetaItem>
            <MetaItem>Fully confidential</MetaItem>
          </MetaRow>
        </BigCTA>

        <FormGrid>
          <FormLeft>
            <FormTitle>
              Tell us what<br />
              <em>you&apos;re building.</em>
            </FormTitle>
            <ContactInfo>
              <InfoItem>
                <InfoLabel>Direct Email</InfoLabel>
                <InfoValue href="mailto:hello@synapseit.com">hello@synapseit.com</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Headquarters</InfoLabel>
                <InfoValue as="span">Milan, Italy — CET timezone · EU-compliant</InfoValue>
              </InfoItem>
            </ContactInfo>
            <StepsList>
              {[
                'We review your inquiry within one business day',
                'A senior team member responds with an honest assessment',
                'If there\'s a fit, we propose a discovery session',
              ].map((s, i) => (
                <StepItem key={i}>
                  <StepBadge>{String(i + 1).padStart(2, '0')}</StepBadge>
                  <StepText>{s}</StepText>
                </StepItem>
              ))}
            </StepsList>
          </FormLeft>

          <FormRight>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" type="text" placeholder="Jane Smith" required />
                </Field>
                <Field>
                  <Label htmlFor="email">Work Email *</Label>
                  <Input id="email" type="email" placeholder="jane@company.com" required />
                </Field>
              </FieldGroup>

              <Field>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" type="text" placeholder="Acme Corp (optional)" />
              </Field>

              <Field>
                <Label htmlFor="intent">I&apos;d like to</Label>
                <Select id="intent">
                  <option value="">Select an option</option>
                  <option value="new">Start a New Project</option>
                  <option value="extend">Extend Your Team</option>
                  <option value="model">Discuss an Engagement Model</option>
                  <option value="long">Explore a Long-Term Partnership</option>
                </Select>
              </Field>

              <Field>
                <Label htmlFor="budget">Budget Range</Label>
                <Select id="budget">
                  <option value="">Select range (optional)</option>
                  <option value="under50">Under €50K</option>
                  <option value="50-150">€50K – €150K</option>
                  <option value="150-500">€150K – €500K</option>
                  <option value="500plus">€500K+</option>
                </Select>
              </Field>

              <Field>
                <Label htmlFor="message">Project Details *</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your project, timeline, and any specific requirements..."
                  required
                />
              </Field>

              <SubmitBtn type="submit" sent={sent}>
                {sent ? '✓ Inquiry Sent' : 'Submit Inquiry'}
              </SubmitBtn>
            </Form>
          </FormRight>
        </FormGrid>
      </Inner>
    </Section>
  )
}
