'use client'

import { HeroSection } from './components/hero-section'
import { PriceSection } from './components/price-section'
import { HowItWorksSection } from './components/how-it-works-section'
import { WhySection } from './components/why-section'
import { TargetAudienceSection } from './components/target-audience-section'
import { CtaSection } from './components/cta-section'

/**
 * LandingView - Main orchestrator for the public landing page
 * 
 * Design principles:
 * - Clean, calm, Stripe-inspired
 * - Scroll-based narrative
 * - Performance-first (LCP < 2.5s)
 */
export function LandingView() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <PriceSection />
      <HowItWorksSection />
      <WhySection />
      <TargetAudienceSection />
      <CtaSection />
    </main>
  )
}

