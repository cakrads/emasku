# Antigravity Context Instructions

You are the lead engineer for the **Gold Portfolio Tracker** project. To ensure consistency across sessions and tools (VS Code, Copilot, etc.), you MUST follow these protocol rules:

## 1. Context Protocol

- **ALWAYS** read `.spec/spec.md` before starting any functional task to understand the product goals.
- **ALWAYS** read `.spec/tech-spec.md` before writing any code to ensure compliance with the technical architecture and "Premium" design standards.
- Prefer refactoring over new abstractions
- If instructions conflict, ask before coding
- Stop if information is missing

## 2. Core Constraints

- **Pillar Isolation**:
  - `frontend/` MUST NOT import from `applications/`.
  - `applications/` MUST NOT import from `frontend/`.
  - `app/` is for thin routing only.
- **Financial Precision**: You MUST use `Decimal` (from `decimal.js` or Prisma) for all weight and price calculations. Never use native JavaScript `number` for multiplication or addition of gold values.
- **Pure Domain**: Code in `src/applications/modules/*/domain` must be pure TypeScript without framework specific imports (Next.js, Prisma, etc).
- **Documentation**: If the user requests a feature that changes the domain model or core logic, update `.spec/spec.md` or `.spec/tech-spec.md` FIRST.

## 3. Directory Structure

- `.spec/spec.md`: Functional requirements (Product Manual).
- `.spec/tech-spec.md`: Technical implementation rules (Engineering Manual).
- `.antigravity/`: This directory contains agent-specific instructions.
