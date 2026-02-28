# [0096] Dependency Injection Anti-Pattern in Controllers

## Category
Architecture — 🔴 Critical

## Problem
Controllers (`GoalController`, `PortfolioController`, `PricesController`)
instantiate concrete repository classes directly inside every method.
This creates tight coupling, code duplication, and makes testing difficult.

## Fix
Move repository instantiation to controller constructors. Inject via
interfaces (`IGoalRepository`, `IPortfolioRepository`). Create controller
instances in route handlers with concrete implementations.

## Files
- `src/applications/modules/goals/v1/delivery/http/goal-controller.ts`
- `src/applications/modules/portfolio/v1/delivery/http/portfolio-controller.ts`
- `src/applications/modules/prices/v1/delivery/http/prices-controller.ts`
