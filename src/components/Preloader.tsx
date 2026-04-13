'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Counter = styled(motion.div)`
  font-family: var(--font-display);
  font-size: clamp(5rem, 15vw, 12rem);
  font-weight: 800;
  color: white;
  display: flex;
  align-items: baseline;
  line-height: 0.8;
  
  span {
    font-size: 0.3em;
    margin-left: 0.1em;
    color: var(--accent);
  }
`

const ProgressBarContainer = styled.div`
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
`

const ProgressBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--accent);
  width: 100%;
`

const LoadingText = styled(motion.p)`
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1rem;
`

export default function Preloader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setLoading(false), 500)
          return 100
        }
        return prev + Math.floor(Math.random() * 5) + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = 'auto'
    } else {
      document.body.style.overflow = 'hidden'
    }
  }, [loading])

  return (
    <AnimatePresence>
      {loading && (
        <Overlay
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          <Counter
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Math.min(progress, 100)}<span>%</span>
          </Counter>

          <ProgressBarContainer>
            <ProgressBar
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ ease: "linear" }}
              style={{ originX: 0 }}
            />
          </ProgressBarContainer>

          <LoadingText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Initializing Experience
          </LoadingText>
        </Overlay>
      )}
    </AnimatePresence>
  )
}
