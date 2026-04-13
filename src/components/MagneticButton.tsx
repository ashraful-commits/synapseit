'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import styled from '@emotion/styled'

const ButtonWrapper = styled(motion.div, {
  shouldForwardProp: (prop) => !['variant', 'isFormContext'].includes(prop)
}) <{ variant: 'primary' | 'secondary', isFormContext?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 22px 54px;
  border-radius: 100px; /* Pill shape */
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.22em;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;

  background: ${({ variant }) => variant === 'primary' ? 'var(--bg-lift)' : 'transparent'};
  border: 1px solid ${({ variant }) => variant === 'primary' ? 'rgba(255,255,255,0.08)' : 'var(--border)'};

  transition: border-color 0.4s ease;

  &:hover {
    border-color: var(--accent);
  }

  svg {
    position: relative;
    z-index: 2;
    flex-shrink: 0;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover svg {
    transform: translateX(6px) scale(1.1);
  }
`

const LiquidFill = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--accent);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
`

const TextContainer = styled(motion.span)`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
`

type MagneticButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
  onClick?: () => void
  tag?: any
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  className?: string
}

export default function MagneticButton({ children, variant = 'primary', href, onClick, tag, type, disabled, className }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Magnetic Pull Physics
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { damping: 15, stiffness: 120, mass: 0.5 }
  const mouseXSpring = useSpring(x, springConfig)
  const mouseYSpring = useSpring(y, springConfig)

  const rotateX = useTransform(mouseYSpring, [-40, 40], [10, -10])
  const rotateY = useTransform(mouseXSpring, [-40, 40], [-10, 10])

  // Liquid Fill Tracker
  const fillX = useMotionValue(0)
  const fillY = useMotionValue(0)
  const fillXSpring = useSpring(fillX, { damping: 25, stiffness: 200 })
  const fillYSpring = useSpring(fillY, { damping: 25, stiffness: 200 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()

    // Magnetic pull
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    x.set(dx * 0.5)
    y.set(dy * 0.5)

    // Fill tracking
    fillX.set(e.clientX - rect.left)
    fillY.set(e.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const Component = tag || (href ? 'a' : 'button')
  const isFormContext = Component === 'button' || type === 'submit'

  // Cast to any to bypass the motion.div vs Emotion 'as' prop type conflict
  const MotionWrapper = ButtonWrapper as any

  return (
    <MotionWrapper
      as={Component}
      href={href}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
      ref={ref}
      variant={variant}
      isFormContext={isFormContext}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: mouseXSpring,
        y: mouseYSpring,
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
    >
      <LiquidFill
        style={{ x: fillXSpring, y: fillYSpring }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 45 : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <TextContainer
        animate={{ color: isHovered ? '#ffffff' : 'var(--text)' }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </TextContainer>
    </MotionWrapper>
  )
}
