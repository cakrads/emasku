# Agent Instruction — Landing Page Enhancement (Hero + Motion)

## Context

The landing page structure, typography system, and spacing system are already finalized and approved.

Your task is to ENHANCE the landing page visually and experientially
without breaking calmness, performance, or professionalism.

This is a financial / web3-adjacent product.
The target quality bar is Stripe / Linear-level cleanliness.

---

## Scope of Work (ALLOWED)

You may ONLY work on:

1. Hero section parallax
2. Subtle ornamental visuals
3. Scroll-based fade-in / fade-out animation
4. Visual polish that improves perceived quality

You may NOT:

- Change layout structure
- Change typography choices
- Change spacing scale
- Add marketing copy
- Add new sections
- Add heavy visual effects

---

## 1. Hero Section — Parallax Enhancement

Goal:

- Create depth and calm sophistication
- Establish premium, professional tone

Rules:

- Parallax must be VERY subtle
- Only background or decorative layers may move
- Main text content must remain stable and readable

Allowed:

- Slow vertical background movement
- Slight opacity shift based on scroll
- Layered background gradients or shapes

Forbidden:

- Fast parallax
- Large movement distances
- Text parallax
- Looping animations

Hero parallax must:

- Respond only to scroll
- Never autoplay
- Respect prefers-reduced-motion

---

## 2. Ornaments & Decorative Elements

Purpose:

- Add visual interest
- Avoid flat or boring appearance
- Support the financial / web3 tone

Examples of acceptable ornaments:

- Soft gradients
- Abstract geometric shapes
- Subtle grid lines
- Light noise / grain (very subtle)
- Stripe-like background layers

Rules:

- Ornaments must NEVER distract from text
- Low contrast
- Minimal color usage
- No strong glow effects

If unsure:

- Reduce opacity
- Reduce size
- Reduce count

Less is always better.

---

## 3. Scroll-Based Animations (Fade / Reveal)

Goal:

- Guide attention
- Improve narrative flow
- Maintain calmness

Allowed animations:

- Fade in
- Fade out
- Translate Y: 8–16px
- Slight scale: 0.98 → 1

Forbidden animations:

- Bounce
- Elastic
- Spring overshoot
- Horizontal sliding
- Rotations

Animation timing:

- Delayed
- Predictable
- One animation per element only

All animations must:

- Be triggered by scroll
- Use intersection observers or equivalent
- Respect prefers-reduced-motion

---

## 4. Professional Feel Checklist

Before finalizing, validate:

- Nothing feels playful
- Nothing feels noisy
- Nothing feels rushed
- Motion feels intentional
- Page still looks good with animation disabled
- Page still feels premium on low-end devices

If any element draws attention to itself more than the content,
it must be removed or simplified.

---

## 5. Performance Constraints (NON-NEGOTIABLE)

All enhancements must respect Core Web Vitals:

- No layout shift (CLS must remain < 0.1)
- No heavy JS in hero
- No blocking animations
- Prefer CSS transforms over JS
- No unnecessary animation libraries

If an effect harms performance, remove it.

---

## Final Instruction

Enhance the landing page ONLY within these constraints.

The result must feel:

- Calm
- Clean
- Premium
- Trustworthy

A visually impressive solution that violates calmness,
clarity, or performance is considered incorrect.

Do not exceed this scope.
