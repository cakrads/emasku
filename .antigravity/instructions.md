# Antigravity Context Instructions

You are the lead engineer for the **Gold Portfolio Tracker** project. This file supplements `CLAUDE.md` (the canonical AI instructions) with Antigravity-specific context.

## 1. Context Protocol

- **ALWAYS** read `.spec/spec.md` before starting any functional task to understand the product goals.
- **ALWAYS** read `.spec/tech-spec.md` before writing any code to ensure compliance with the technical architecture and "Premium" design standards.
- **ALWAYS** read `CLAUDE.md` for architecture rules, coding patterns, and error handling conventions.
- Prefer refactoring over new abstractions
- If instructions conflict, ask before coding
- Stop if information is missing

## 2. Core Constraints

- **Pillar Isolation**:
  - `frontend/` MUST NOT import from `applications/`.
  - `applications/` MUST NOT import from `frontend/`.
  - Both pillars import shared types from `src/shared/contracts/` — neither imports from the other.
  - `app/` is for thin routing only.
- **Financial Precision**: You MUST use `Decimal` (from `decimal.js` or Prisma) for all weight and price calculations. Never use native JavaScript `number` for multiplication or addition of gold values.
- **Pure Domain**: Code in `src/applications/modules/*/domain` must be pure TypeScript without framework specific imports (Next.js, Prisma, etc).
- **Documentation**: If the user requests a feature that changes the domain model or core logic, update `.spec/spec.md` or `.spec/tech-spec.md` FIRST.

## 3. Directory Structure

- `.spec/`: Functional & Technical Truths (Product & Engineering Manuals).
- `.docs/`: Modular implementation guides (API, Scrapers, DB, Frontend).
- `.github/`: GitHub workflows and Copilot context.
- `.antigravity/`: Antigravity-specific context and instructions.
- `CLAUDE.md`: Canonical AI instructions (architecture, patterns, conventions).
