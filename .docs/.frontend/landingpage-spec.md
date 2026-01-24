# Emasku — Landing Page Specification (FINAL)

## 1. Objective

Build a **public landing page** that feels:

- Clean
- Calm
- Trustworthy
- Modern (financial / web3-adjacent)

Primary goals:

- Establish trust before login
- Communicate product value visually
- Guide users with scroll-based narrative
- Maintain excellent performance (Core Web Vitals)

This landing page is **NOT**:

- A trading UI
- A heavy animation showcase
- A copywriting experiment

---

## 2. Design Principles (NON-NEGOTIABLE)

### 2.1 Visual Tone

- Minimal
- Neutral
- Calm
- Confident
- No visual noise

Avoid:

- Playful UI
- Over-glow
- Excessive gradients
- Loud colors

---

### 2.2 Typography (CRITICAL)

Typography is more important than animation.

Rules:

- One primary font family only
- Neutral, highly readable font
- No decorative fonts

Recommended direction:

- Inter / Geist / SF-style fonts
- Slightly wide headings
- Body text optimized for long reading

Typography scale:

- Headings: restrained, not oversized
- Body: smaller than typical marketing sites, higher line-height
- Labels: subtle, low contrast

---

## 3. Page Structure (Source of Truth)

The landing page consists of these sections in order:

1. Hero  
2. Proof / Metrics  
3. How It Works (Scroll Narrative)  
4. Why Emasku Exists  
5. Who It’s For  
6. Final CTA  
7. Footer  

Each section:

- Must feel like a “chapter”
- Must have generous vertical spacing
- Must not visually compete with other sections

---

## 4. Hero Section Specification

Purpose:

- Establish trust
- Set tone
- Introduce product calmly

Layout:

- Centered headline
- Supporting subtext
- Primary CTA
- Optional subtle visual background

Motion:

- Very slow parallax on background only
- Headline fades in on load
- CTA appears last

Rules:

- No fast movement
- No bouncing
- No looping animation

---

## 5. How It Works Section (KEY SECTION)

This section replaces “Cara Kerja”.

### 5.1 Structure

- Two-column layout:
  - Left: Sticky phone mockup
  - Right: Step-by-step explanation

- Scroll-driven narrative:
  - Each scroll segment represents one step
  - Phone content updates per step

---

### 5.2 Motion Rules

Allowed:

- Fade in / fade out
- Small translate (Y: 8–16px)
- Opacity changes
- Very subtle scale (0.98 → 1)

Forbidden:

- Bounce
- Elastic easing
- Fast parallax
- Horizontal sliding chaos

Important:

- Phone container stays mostly static
- Only the content inside the phone changes
- Old content exits before new content enters

---

## 6. Animation Philosophy (GLOBAL)

Animation exists to:

- Guide attention
- Support narrative
- Reduce cognitive load

Animation must NEVER:

- Compete with text
- Draw attention to itself
- Trigger motion sickness

Global rules:

- Use scroll-based animation only
- No autoplay loops
- Respect prefers-reduced-motion

---

## 7. Performance & Core Web Vitals (MANDATORY)

The landing page MUST meet these targets:

### 7.1 Core Web Vitals Targets

- LCP < 2.5s  
- CLS < 0.1  
- INP < 200ms  

Failure to meet these targets is considered a design bug.

---

### 7.2 Performance Rules

Images:

- Use next/image
- Proper sizing
- No oversized hero images
- Avoid heavy video backgrounds

Fonts:

- Self-host fonts
- Use font-display: swap
- Limit font weights

Animation:

- Prefer CSS + transform
- Avoid layout-triggering animations
- Avoid manual scroll listeners
- Use Intersection Observer or motion libraries carefully

---

### 7.3 JavaScript Discipline

- No animation libraries by default
- Introduce Framer Motion only if strictly necessary
- Lazy-load non-critical sections
- No blocking JavaScript in the hero section

---

## 8. Accessibility & UX

Mandatory:

- Respect prefers-reduced-motion
- High text contrast
- Clear focus states
- No text embedded in images

UX principles:

- Calm scrolling
- Predictable behavior
- No surprise interactions

---

## 9. Content Strategy (FOR LATER)

At this stage:

- Content may be placeholder
- Focus on layout, spacing, and motion

Content rules:

- Short sentences
- No hype language
- Informative, not persuasive

---

## 10. Implementation Boundary

This specification defines:

- Layout
- Motion behavior
- Performance constraints

This specification does NOT define:

- Final marketing copy
- SEO optimization
- Conversion experiments

Any implementation that violates these principles is considered incorrect,
even if it appears visually attractive.

---

## END OF SPEC
