# TASK: Implement Prices API with Shared Contract Architecture (STRICT)

You are implementing the **Prices feature** using a **shared API contract architecture**.
This is NOT a redesign task. This is a **structural correctness task**.

You MUST follow the architecture rules below exactly.

---

## 🔒 NON-NEGOTIABLE RULES

1. **API contract is the single source of truth**
2. Prisma / DB schema MUST NOT be shared with frontend
3. Frontend MUST NOT import backend domain or Prisma types
4. Only `/shared/contracts` may be imported by BOTH frontend and backend
5. Backend adapts data to contract (NOT the other way around)
6. Frontend may use dummy data but MUST conform to the contract
7. No auth, no API integration beyond dummy data

If any rule is violated, the implementation is WRONG.

---

## 🗂️ REQUIRED FOLDER STRUCTURE

Create the following structure:

/shared
/contracts
prices.contract.ts

/apps/backend
/src
/domain
prices.domain.ts
/application
/prices
prices.service.ts
prices.mapper.ts
prices.controller.ts

/apps/frontend
/src
/services
/prices
prices.api.ts
prices.mock.ts
/view-model
prices.vm.ts

yaml
Salin kode

Do NOT collapse folders.
Do NOT move contracts elsewhere.

---

## 1️⃣ Shared — API Contract (MANDATORY)

Create `shared/contracts/prices.contract.ts`

Requirements:

- Use Zod
- Define **PricesTodayResponse**
- This file MUST NOT:
  - import Prisma
  - import frontend code
  - include UI formatting
  - include database concerns

Shape:

```ts
{
  priceDate: string, // YYYY-MM-DD
  prices: [
    {
      brandCode: string,
      weight: number, // gram
      price: number   // IDR integer
    }
  ]
}
Export:

Zod schema

Type inferred from schema

2️⃣ Backend Implementation (Dummy Data Allowed)
Domain
Create prices.domain.ts

Internal representation only

Can differ from API contract

Service
Create prices.service.ts

Return dummy data

NO API shape here

Mapper (CRITICAL)
Create prices.mapper.ts

Convert domain → API contract

NO business logic

NO formatting

Must return PricesTodayResponse

Controller
Create prices.controller.ts

Call service

Map using mapper

Validate response using Zod schema

Return JSON

Backend MUST:

Adapt data to contract

Never leak internal types

3️⃣ Frontend Consumption
API Client
Create prices.api.ts

Fetch /api/v1/prices/today

Return PricesTodayResponse

Mock Data
Create prices.mock.ts

Dummy data

MUST satisfy the shared contract exactly

View Model
Create prices.vm.ts

Transform API data into UI-friendly shape

Formatting (currency, labels) happens HERE

API types MUST NOT be mutated

4️⃣ STRICT SEPARATION OF CONCERNS
Layer Responsibility
Prisma Storage only
Domain Business representation
Mapper Contract enforcement
Contract API boundary
Frontend API Data fetching
View Model UI shaping

Do NOT merge layers.
Do NOT shortcut mapping.
Do NOT reuse Prisma models.

5️⃣ Validation Checklist (MUST PASS)
Before finishing, verify:

 Frontend imports ONLY from shared/contracts

 Backend does NOT expose Prisma or domain types

 API response matches contract exactly

 Dummy data conforms to Zod schema

 UI formatting exists only in View Model

 Code is easy to swap dummy → real DB later

🎯 GOAL
This implementation must:

Be production-grade

Support future auth without refactor

Allow FE & BE to evolve independently

Prevent tight coupling

If unsure, follow the contract strictly.
Do NOT invent new abstractions.
