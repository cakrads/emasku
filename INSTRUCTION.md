# PROMPT — Implement Holdings Input Wizard (Market-Driven UX)

## Role & Goal

You are a **senior frontend engineer** implementing a **gold holdings input wizard** with strong UX, data integrity, and scalability.

Your task is to implement a **3-step wizard** for adding gold holdings where:

- Market data drives user choices
- User effort is minimized
- Invalid data is prevented by design
- Architecture remains clean and maintainable

⚠️ This task is **UI + UX only**.  
⚠️ No backend changes.  
⚠️ API may be mocked or reused if already available.

---

## Core UX Principles (Mandatory)

1. User should not type what the system already knows
2. Reduce number of clicks
3. Prevent invalid weights by design
4. Market data is the source of truth
5. Custom input is allowed **only** for non-market brands

Violation of these principles is NOT allowed.

---

## Wizard Flow (Final Decision)

### Step 1 — Select Brand

**UI**

- Card or grid list of brands
- Example: ANTAM, UBS, GALERI24
- Include one option: **“Other / Custom Brand”** existing

**Behavior**

- Selecting a brand:
  - Immediately selects the brand
  - Automatically advances to Step 2
- “Next” button still exists as fallback (accessibility)

**State**

- brandCode
- brandName
- isCustomBrand (boolean)
or use existing state which ready as payload

---

### Step 2 — Select Weight

#### Case A — Market Brand

**Data Source**

- `/prices`
- Filter by selected brand
- Extract unique `denominationGram`

**UI**

- Selectable cards or segmented buttons
- Example:
  - 1 gram
  - 2 gram
  - 5 gram
  - 10 gram
- Optional: show today price as secondary text

**Behavior**

- Selecting a weight:
  - Immediately selects weight
  - Automatically advances to Step 3
- “Next” button still exists

**Rules**

- Manual weight input is DISABLED
- Only weights from market data allowed

---

#### Case B — Custom Brand

If `isCustomBrand === true`:

**UI**

- Manual weight input

**Validation**

- Numeric
- Minimum: 0.1 gram
- Reasonable max limit

**Helper Text**

- “Custom brand does not have market-defined weights”

---

### Step 3 — Purchase Details

**Fields**

- Purchase date (date picker)
- Quantity (default = 1)
- Total buy price (IDR)
- Notes (optional)

**Rules**

- Buy price is TOTAL price
- Do NOT ask price per gram
- System calculates internal values later

**Actions**

- Primary: Save Holding
- Secondary: Back

---

### Step 4 — Review Like existing Step 3

---

## Click Reduction Rules (Required)

- Selecting brand → auto-advance to Step 2
- Selecting weight → auto-advance to Step 3
- Next button still exists for accessibility

---

---

in mobile android, back button is used to go back to previous step

use useful name, don't use Wizard Setup

---

## Component Architecture (Mandatory)

Split into composable components:

- HoldingsWizard
- BrandSelector
- WeightSelector
- PurchaseForm
- WizardFooter

Rules:

- No API calls inside UI components
- Data access via service layer or hooks
- Wizard state centralized (parent or context)

---

## State Model (Required)

Wizard state MUST contain which ready as payload:

- brandCode
- brandName
- isCustomBrand
- denominationGram
- quantity
- buyPriceTotal
- boughtAt
- notes

❌ Do NOT store derived or calculated values.

---

## UX Copy (Required)

**Step Titles**

- Step 1  
  - ID: Pilih Jenis Emas  
  - EN: Select Gold Brand

- Step 2  
  - ID: Pilih Berat  
  - EN: Select Weight

- Step 3  
  - ID: Detail Pembelian  
  - EN: Purchase Details

**Helper Text**

Market brand:

- “Berat diambil dari data harga pasar”

Custom brand:

- “Berat dimasukkan manual karena merek tidak tersedia”

---

## Validation Rules

- Brand must be selected
- Weight must be selected
- Cannot save without:
  - Buy price
  - Purchase date
- Inline validation only
- No alert dialogs

---

## Non-Goals (Do NOT Implement)

- Backend changes
- Authentication
- Price history chart
- Valuation or PnL calculation
- UI redesign beyond wizard

---

## Success Criteria

Implementation is correct if:

- User can add a holding with minimal clicks
- Manual weight only appears for custom brand
- Invalid weights are impossible
- Code is modular and maintainable
- UX feels fast and intentional

---

## Final Instruction

Optimize for:

- Data correctness
- User trust
- Long-term maintainability

Do not over-engineer.  
Do not shortcut architecture.  
Deliver production-ready code.
