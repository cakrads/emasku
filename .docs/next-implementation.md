# Emasku Project Roadmap

## 🏁 Phase 1: Authentication MVP (Completed)

**Goal:** Establish a secure, compliant, and user-friendly authentication foundation.

### ✅ key Achievements

- **Shared Infrastructure**: Centralized Supabase integration with type-safe `auth.service.ts` and `auth.utils.ts`.
- **Hybrid Login**: Supported both **Google OAuth** (Primary) and **Guest Login** (Secondary).
- **Security**:
  - Implemented secure cookie-based session management (`middleware.ts`).
  - Secured all backend Portfolio APIs with Bearer Token/Cookie validation.
- **Frontend Architecture**:
  - `AuthProvider` via Context/Zustand for global state.
  - Responsive `Navbar` with Shadcn Dropdown (Desktop) and Tab Bar (Mobile).
  - Dedicated Profile Page with secure Logout flow.
- **UI/UX Refinements**:
  - **Dark Mode**: Fully functional toggle switch.
  - **Feedback**: Loading states, error handling, and confirmation modals.

---

## 🚀 Phase 2: Core Product Features (Next Plan)

**Goal:** deliver the core value proposition—intelligent gold portfolio tracking.

### 1. Analytics & Charts (High Priority)

*Visualizing wealth growth.*

- [ ] **Portfolio Value Chart**: Line chart showing total value over time.
- [ ] **Unrealized P/L**: Real-time Gain/Loss calculation based on live prices.
- [ ] **Asset Allocation**: Pie chart breakdown by Brand or Weight.
- [ ] **Summary Cards**: "Total Gold (grams)", "Total Investment", "Current Value".

### 2. Live Market Data Integration

*Connecting to the real world.*

- [ ] **Real-time Price Feed**: Connect Dashboard to Scraper/Galeri24 API.
- [ ] **Price Ticker**: Marquee or header showing current Buy/Sell prices.
- [ ] **Price Alerts**: User-defined notifications (e.g., "Alert when Buyback > X").

### 3. Smart Transactions

*Refining data entry.*

- [ ] **Transaction History**: List view of all past Buy/Sell actions.
- [ ] **Edit/Delete**: Ability to correct past data entry errors.
- [ ] **Invoice Upload**: Attach photos of physical invoices to transactions.

### 4. PWA & Offline Capability

*Mobile-first experience.*

- [ ] **Manifest & Icons**: Make app installable on iOS/Android home screens.
- [ ] **Offline Support**: View last-known portfolio data without internet.

---

## 📈 Long-Term Vision (Phase 3+)

- **Multi-Currency Support**: Support USD/Gold prices.
- **Social Sharing**: Share portfolio milestones (sanitized).
- **Export Data**: CSV/PDF export for tax/personal records.
