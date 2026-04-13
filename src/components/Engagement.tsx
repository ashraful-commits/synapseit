'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { SkewReveal, SplitLineReveal, BlurReveal } from './TypoEffects'

type ModelKey = 'augmentation' | 'hourly' | 'fixed'

const models = {
  augmentation: {
    title: 'Resource Augmentation',
    tagline: 'Extend your capacity without the hiring timeline.',
    desc: 'Place Synapse IT engineers, designers, or QA specialists directly into your team. They adopt your workflows, tools, and communication channels — operating as embedded members of your organisation while maintaining our engineering standards.',
    context: 'Ongoing development, capacity gaps, or teams building long-term product capability.',
    metric: { label: 'Avg. onboarding', value: '5 days' },
    whenToChoose: [
      'You have an internal team that needs additional depth or specialised skills',
      'Delivery timelines require more capacity than your current team can sustain',
      'You need flexibility to scale up or down without long-term hiring commitments',
      'Knowledge transfer and cultural alignment matter as much as output'
    ],
    howItWorks: [
      { id: '01', title: 'Assessment', text: 'We assess your team structure, tooling, and delivery cadence' },
      { id: '02', title: 'Selection', text: 'Dedicated specialists are selected and onboarded into your environment' },
      { id: '03', title: 'Integration', text: 'They participate in your rituals, report through your channels, and follow your processes' },
      { id: '04', title: 'Scaling', text: 'Capacity adjusts monthly based on your evolving needs' }
    ],
    whatYouGet: [
      'Dedicated specialists embedded in your team',
      'Full alignment with your processes and tooling',
      'Scale up or down on a monthly basis',
      'Structured knowledge sharing and documentation'
    ]
  },
  hourly: {
    title: 'Hourly Basis',
    tagline: 'Senior expertise, transparent billing.',
    desc: 'Engage our senior engineers, architects, or design leads for targeted work — technical audits, architecture reviews, sprint-based contributions, or advisory engagements. Every hour is tracked and reported with full transparency.',
    context: 'Technical assessments, short-term specialist contributions, or evolving project requirements.',
    metric: { label: 'Avg. start time', value: '3 days' },
    whenToChoose: [
      'You need expert input on specific decisions or technical challenges',
      'Project scope is evolving and fixed commitments don\'t fit yet',
      'You require specialist skills for a defined period — weeks, not months',
      'Ongoing support, enhancements, or maintenance with variable demand'
    ],
    howItWorks: [
      { id: '01', title: 'Define', text: 'Define the expertise needed and engagement scope' },
      { id: '02', title: 'Assignment', text: 'We assign senior-level practitioners — no juniors, no rotation' },
      { id: '03', title: 'Tracking', text: 'Hours are tracked transparently with detailed reporting' },
      { id: '04', title: 'Agility', text: 'Adjust intensity week to week with no minimum commitment' }
    ],
    whatYouGet: [
      'Detailed and auditable time tracking',
      'Access to senior practitioners only',
      'No minimum hours or lock-in',
      'Engagement can begin within days'
    ]
  },
  fixed: {
    title: 'Fixed Budget',
    tagline: 'Committed scope, predictable investment.',
    desc: 'When requirements are well-defined, we agree on scope, milestones, and budget before work begins. Deliverables are documented, reviews happen at each milestone, and a structured change management process keeps the project on track.',
    context: 'MVPs, product launches, or feature sets with established requirements and firm budget constraints.',
    metric: { label: 'Avg. delivery', value: 'On budget' },
    whenToChoose: [
      'Requirements are clearly documented and unlikely to change significantly',
      'Budget predictability is a hard constraint — no cost surprises',
      'The project has a defined start, end, and set of deliverables',
      'Stakeholders need milestone-based progress visibility'
    ],
    howItWorks: [
      { id: '01', title: 'Scoping', text: 'We conduct a scoping workshop to define requirements precisely' },
      { id: '02', title: 'Proposal', text: 'A fixed proposal documents deliverables, milestones, timeline, and price' },
      { id: '03', title: 'Build', text: 'Development follows the agreed plan with milestone reviews' },
      { id: '04', title: 'Control', text: 'A built-in change management protocol handles any scope adjustments' }
    ],
    whatYouGet: [
      'Scope and acceptance criteria defined upfront',
      'Milestone-based delivery and payment schedule',
      'Fixed pricing with no hidden charges',
      'Built-in change management protocol'
    ]
  }
}

const Section = styled.section`
  padding: 140px 0;
  background: var(--bg);
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 100px 0;
  }
`

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 64px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`

const Header = styled.div`
  max-width: 800px;
  margin-bottom: 120px;

  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`

const Label = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;

  &::before {
    content: '';
    width: 40px;
    height: 1px;
    background: var(--accent);
  }
`

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(48px, 6vw, 90px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text);
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 42px;
    margin-bottom: 24px;
  }
`

const Subtitle = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const ModelTabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 100px;
  width: fit-content;
  margin-bottom: 80px;
  position: relative;
  z-index: 100;

  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 20px;
    width: 100%;
    margin-bottom: 40px;
  }
`

const Tab = styled.button<{ active: boolean }>`
  position: relative;
  padding: 16px 32px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? 'var(--bg)' : 'var(--text-muted)'};
  background: transparent;
  transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  cursor: pointer;
  z-index: 1;

  &:hover {
    color: ${props => props.active ? 'var(--bg)' : 'var(--text)'};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 24px;
    font-size: 13px;
  }
`

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: var(--text);
  border-radius: 100px;
  z-index: -1;
`

const ModelContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 120px;
  min-height: 500px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 80px;
    min-height: auto;
  }
`

const MainInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`

const Tagline = styled.h3`
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 300;
  line-height: 1.1;
  color: var(--text);
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`

const Description = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-muted);

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const ContextCard = styled.div`
  padding: 40px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  
  .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    margin-bottom: 16px;
    display: block;
  }

  .text {
    font-size: 16px;
    color: var(--text);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 24px;
    .text { font-size: 14px; }
  }
`

const MetricBox = styled.div`
  margin-top: auto;
  padding-top: 40px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding-top: 24px;
  }

  .label {
    font-size: 12px;
    text-transform: uppercase;
    color: white;
    opacity: 0.4;
  }

  .value {
    font-family: var(--font-display);
    font-size: 40px;
    color: var(--accent);

    @media (max-width: 768px) {
      font-size: 32px;
    }
  }
`

const SideInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
`

const InfoBlock = styled.div`
  .title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    margin-bottom: 32px;
  }
`

const Checklist = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const ChecklistItem = styled.li`
  font-size: 16px;
  color: var(--text-muted);
  padding-left: 28px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    width: 12px;
    height: 1px;
    background: var(--accent);
  }
`

const Steps = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Step = styled.div`
  .id {
    font-size: 10px;
    color: var(--accent);
    margin-bottom: 12px;
  }
  .stitle {
    font-size: 16px;
    color: var(--text);
    margin-bottom: 8px;
  }
  .stext {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.5;
  }
`

const ComparisonSection = styled.div`
  margin-top: 180px;

  @media (max-width: 768px) {
    margin-top: 100px;
  }
`

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid rgba(255,255,255,0.05);
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  th, td {
    padding: 32px;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 14px;
  }

  th {
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--text-dim);
  }

  .feature-head {
    color: var(--text);
    font-weight: 500;
  }

  .highlight {
    color: var(--accent);
  }
`

const DecisionGuide = styled.div`
  margin-top: 180px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 80px;
    margin-top: 100px;
  }
`

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const Question = styled.div`
  padding: 40px;
  background: rgba(255,255,255,0.02);
  border-left: 2px solid rgba(255,255,255,0.1);
  transition: all 0.4s ease;

  &:hover {
    background: rgba(255,255,255,0.04);
    border-left-color: var(--accent);
  }

  .q-id {
    font-size: 12px;
    color: var(--accent);
    margin-bottom: 16px;
  }

  .q-text {
    font-size: 20px;
    color: var(--text);
    font-weight: 300;
  }

  @media (max-width: 768px) {
    padding: 32px;
    .q-text { font-size: 18px; }
  }
`

const CTA = styled.div`
  padding: 80px;
  background: linear-gradient(135deg, rgba(8, 12, 17, 1) 0%, rgba(26, 74, 255, 0.05) 100%);
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 32px;
  margin-top: 120px;

  h3 {
    font-family: var(--font-display);
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 300;
  }

  p {
    max-width: 500px;
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    padding: 60px 24px;
    gap: 24px;
    margin-top: 80px;
  }
`

const PrimaryButton = styled.button`
  background: var(--text);
  color: var(--bg);
  border: none;
  padding: 20px 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 100px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 16px 36px;
    font-size: 14px;
    width: 100%;
  }
`

const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, rgba(26, 74, 255, 0.03) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
`

export default function Engagement() {
  const [activeModel, setActiveModel] = useState<ModelKey>('augmentation')
  const model = models[activeModel]

  return (
    <>
      <Section id="engagement">
        <BackgroundGlow />
        <Inner>
          <Header>
            <Label><SkewReveal text="Tailored Engagement" /></Label>
            <Title><SplitLineReveal text="Structured for your commercial reality." /></Title>
            <Subtitle>
              Every engagement is different. We offer three commercial frameworks — each delivering the same engineering standards, but structured to match how your organisation operates and invests.
            </Subtitle>
          </Header>

          <ModelTabs>
            {(Object.keys(models) as ModelKey[]).map((key) => (
              <Tab
                key={key}
                active={activeModel === key}
                onClick={() => setActiveModel(key)}
              >
                {activeModel === key && (
                  <ActiveIndicator
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {models[key].title}
              </Tab>
            ))}
          </ModelTabs>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ModelContent>
                <MainInfo>
                  <Tagline>{model.tagline}</Tagline>
                  <Description>{model.desc}</Description>
                  <ContextCard>
                    <span className="label">Primary focus</span>
                    <p className="text">{model.context}</p>
                  </ContextCard>
                  <MetricBox>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="label">{model.metric.label}</span>
                      <div style={{ width: '40px', height: '1px', background: 'var(--accent)', marginTop: '8px' }} />
                    </div>
                    <span className="value">{model.metric.value}</span>
                  </MetricBox>
                </MainInfo>

                <SideInfo>
                  <InfoBlock>
                    <div className="title">When to Choose This</div>
                    <Checklist>
                      {model.whenToChoose.map((item, i) => (
                        <ChecklistItem key={i}>{item}</ChecklistItem>
                      ))}
                    </Checklist>
                  </InfoBlock>

                  <InfoBlock>
                    <div className="title">How It Works</div>
                    <Steps>
                      {model.howItWorks.map((step) => (
                        <Step key={step.id}>
                          <div className="id">{step.id}</div>
                          <div className="stitle">{step.title}</div>
                          <div className="stext">{step.text}</div>
                        </Step>
                      ))}
                    </Steps>
                  </InfoBlock>

                  <InfoBlock>
                    <div className="title">What You Get</div>
                    <Checklist>
                      {model.whatYouGet.map((item, i) => (
                        <ChecklistItem key={i}>{item}</ChecklistItem>
                      ))}
                    </Checklist>
                  </InfoBlock>
                </SideInfo>
              </ModelContent>
            </motion.div>
          </AnimatePresence>
        </Inner>
      </Section>

      <div style={{ background: 'var(--bg)', position: 'relative', zIndex: 10 }}>
        <Inner>
          <ComparisonSection>
            <Header>
              <Label><SkewReveal text="Side-by-Side" /></Label>
              <Title><SplitLineReveal text="Compare at a glance." /></Title>
            </Header>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th className="feature-head">Perspective</th>
                    <th>Augmentation</th>
                    <th>Hourly</th>
                    <th>Fixed Budget</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="feature-head">Scope definition</td>
                    <td>Flexible</td>
                    <td>Evolving</td>
                    <td className="highlight">Defined upfront</td>
                  </tr>
                  <tr>
                    <td className="feature-head">Billing structure</td>
                    <td>Monthly retainer</td>
                    <td>Per hour</td>
                    <td className="highlight">Milestone-based</td>
                  </tr>
                  <tr>
                    <td className="feature-head">Team integration</td>
                    <td>Embedded</td>
                    <td>Collaborative</td>
                    <td>Managed delivery</td>
                  </tr>
                  <tr>
                    <td className="feature-head">Duration</td>
                    <td>Ongoing</td>
                    <td>Variable</td>
                    <td>Project-bound</td>
                  </tr>
                  <tr>
                    <td className="feature-head">Start timeline</td>
                    <td>1–2 weeks</td>
                    <td>2–5 days</td>
                    <td>After scoping</td>
                  </tr>
                </tbody>
              </Table>
            </TableWrapper>
          </ComparisonSection>

          <DecisionGuide>
            <div>
              <Header>
                <Label><SkewReveal text="Decision Guide" /></Label>
                <Title><SplitLineReveal text="How to choose the right model." /></Title>
                <Subtitle>
                  Answer these four questions. Each one maps to the engagement model that best fits your situation — giving you a clear starting point for the conversation.
                </Subtitle>
              </Header>
            </div>
            <QuestionList>
              {[
                "How well-defined is your project scope?",
                "What is your timeline expectation?",
                "How important is budget predictability?",
                "Do you have an internal development team?"
              ].map((q, i) => (
                <Question key={i}>
                  <div className="q-id">0{i + 1}</div>
                  <div className="q-text">{q}</div>
                </Question>
              ))}
            </QuestionList>
          </DecisionGuide>

          <CTA>
            <BlurReveal text="Not sure which model fits?" />
            <p>Tell us about your project scope, timeline, and team structure. We'll recommend the engagement model that gives you the best outcome — no obligations, just clarity.</p>
            <PrimaryButton>Discuss Your Project</PrimaryButton>
          </CTA>
        </Inner>
      </div>
    </>
  )
}
