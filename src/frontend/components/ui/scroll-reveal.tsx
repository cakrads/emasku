'use client'

import { useScrollAnimation } from '@/frontend/hooks/use-scroll-animation'
import { cn } from '@/frontend/utils/cn'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  distance?: number
  scale?: boolean
  threshold?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 800,
  distance = 40,
  scale = false,
  threshold = 0.1,
  once = true
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, once })

  const getTransform = () => {
    if (!isVisible) {
      const transforms = []
      switch (direction) {
        case 'up': transforms.push(`translateY(${distance}px)`); break
        case 'down': transforms.push(`translateY(-${distance}px)`); break
        case 'left': transforms.push(`translateX(${distance}px)`); break
        case 'right': transforms.push(`translateX(-${distance}px)`); break
      }
      if (scale) transforms.push('scale(0.95)')
      return transforms.join(' ') || 'none'
    }
    return 'none'
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) translateX(0) scale(1)' : getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
