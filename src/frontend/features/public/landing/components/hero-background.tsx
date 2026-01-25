import { useScrollParallax } from '@/frontend/hooks/use-scroll-animation'

export function HeroBackground() {
  const scrollY = useScrollParallax()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Base gradient - ends in transparent to blend seamlessly with next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />

      {/* Animated grid - moves slower than scroll */}
      <div
        className="absolute inset-0 bg-grid opacity-30"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />

      {/* Primary radial glow */}
      <div
        className="absolute inset-0 bg-radial-gradient"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      />

      {/* Main Background Glow - Premium Gold (Center) - Restored from previous iteration */}
      <div
        className="absolute top-1/2 left-1/2 w-[800px] h-[600px] bg-accent-gold/18 dark:bg-accent-gold/22 blur-[150px] rounded-full pointer-events-none will-change-transform"
        style={{
          transform: `translate(-50%, calc(-50% + ${scrollY * 0.1}px))`,
        }}
      />

      {/* Secondary Accent Glow - Premium Gold (Top Middle) - Restored from previous iteration */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent-gold/14 dark:bg-accent-gold/18 blur-[120px] rounded-full pointer-events-none will-change-transform"
        style={{
          transform: `translate(-50%, ${scrollY * 0.07}px)`,
        }}
      />

      {/* Floating geometric shapes */}
      <div
        className="absolute top-20 right-1/4 w-3 h-3 bg-accent-gold/40 rotate-45 animate-float"
        style={{ transform: `translateY(${scrollY * -0.2}px) rotate(45deg)` }}
      />
      <div
        className="absolute top-1/3 left-20 w-2 h-2 bg-accent-gold/30 rounded-full animate-float"
        style={{ animationDelay: '200ms', transform: `translateY(${scrollY * -0.15}px)` }}
      />
      <div
        className="absolute top-1/2 right-32 w-4 h-4 border border-accent-gold/20 rotate-12 animate-float"
        style={{ animationDelay: '400ms', transform: `translateY(${scrollY * -0.25}px) rotate(12deg)` }}
      />
      <div
        className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-accent-gold/20 rounded-full animate-float"
        style={{ animationDelay: '300ms', transform: `translateY(${scrollY * -0.18}px)` }}
      />

      {/* Glowing lines */}
      <div
        className="absolute top-1/4 left-0 w-px h-64 bg-gradient-to-b from-transparent via-accent-gold/20 to-transparent"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="absolute top-1/3 right-20 w-px h-48 bg-gradient-to-b from-transparent via-accent-gold/15 to-transparent"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-noise" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-vignette" />
    </div>
  )
}
