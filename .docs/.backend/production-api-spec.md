# Production API Specification

> **Status**: Draft
> **Source**: Generated from `INSTRUCTION.md` requirements.

This document serves as the **Technical Specification** for ensuring the Emasku API is production-ready, secure, and scalable. It supplements the high-level `tech-spec.md` and the functional `api-contract.md`.

---

## 1. Endpoint Classification

Each endpoint is classified to determine its security, caching, and rate-limiting posture.

| Method | Endpoint | Classification | Implication |
| :--- | :--- | :--- | :--- |
| `GET` | `/prices/spot` | **Public Read** | Cached heavily; protected by Public Key. |
| `GET` | `/prices/today` | **Public Read** | Short-cache; protected by Public Key. |
| `GET` | `/brands` | **Master / Ref** | Static data; extremely high cache TTL. |
| `GET` | `/portfolio/summary` | **Auth Read** | No shared cache; User-specific (JWT). |
| `GET` | `/portfolio` | **Auth Read** | No shared cache; User-specific (JWT). |
| `POST` | `/portfolio` | **Auth Write** | Critical data integrity; Idempotency desirable. |
| `POST` | `/portfolio/{id}/sell` | **Auth Write** | Critical state change; Transactional safety. |
| `POST` | `/scraper/run` | **System / Admin** | Restricted access (Secret Key); Side-effect heavy. |

---

## 2. Security & Access Control

### 2.1 Public APIs (`/prices`, `/brands`)

* **Visibility**: Accessible via browser/client-side code.
* **Authentication**: `x-public-key` header required (non-secret identifier).
* **Protection**:
  * **User-Agent Blocking**: Reject known bot signatures (curl, wget, generic python scripts).
  * **CORS**: strict allow-list for known frontend domains.

### 2.2 Authenticated APIs (`/portfolio`)

* **Authentication**: `Authorization: Bearer <JWT>` required.
* **Authorization**: Checks strictly based on `sub` (Subject ID) in JWT.
  * *Rule*: A user can ONLY access resources where `ownerId == jwt.sub`.
* **Leak Prevention**: Global middleware or base controller must reject cross-tenant access attempts.

### 2.3 System APIs (`/scraper`)

* **Authentication**: `Authorization: Bearer <SCRAPER_SECRET>`
* **Access**: Restricted to internal schedulers (GitHub Actions, CRON) or admin debugging.

---

## 3. Rate Limiting Policy Matrix

Implement using **Upstash Redis** (Edge compatible).

| Endpoint Class | Limit | Period | Key Scope | Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Market Data** (`/prices/*`) | **60** | 1 min | IP + Public Key | Prevent scraping/abuse; allow normal dashboard polling. |
| **Market Chart** (`/prices/spot`) | **20** | 1 min | IP + Public Key | Expensive query; enforce caching on client side. |
| **Reference** (`/brands`) | **100** | 1 min | IP | Static data; should be cached client-side almost forever. |
| **Portfolio Read** | **100** | 1 min | User ID | Allow fast UI navigation/refresh; stop rapid polling. |
| **Portfolio Write** | **10** | 1 min | User ID | Prevent double-submit spam or write-floods. |
| **System** | **5** | 1 min | IP / Global | Scraper should run infrequently (e.g., once per minute max). |

**Exceed Behavior**: Return `429 Too Many Requests` with `Retry-After` header.

---

## 4. Data Integrity & Safety (Write Operations)

### 4.1 Duplicate Prevention

* **Frontend**: Disable submit buttons on click; use `isSubmitting` state.
* **Backend**:
  * Use database transactions (`prisma.$transaction`) for all multi-step writes.
  * Implement **Idempotency Keys** (future phase) for critical monetary moves.

### 4.2 Race Conditions (Double Sell)

* **Scenario**: User clicks "Sell" twice on same item.
* **Locking**:
  * Use **Optimistic Locking**: Check `status` is `ACTIVE` before updating to `SOLD`.
  * Atomic Update: `UPDATE holdings SET status='SOLD' WHERE id=? AND status='ACTIVE'`
  * If 0 rows updated, throw "Already Sold" error.
* **Refetch**: Always return fresh `status` after operation.

### 4.3 Soft Delete / Close

* **Soft Close**: Selling marks `status: SOLD` (retains history).
* **Soft Delete**: `deletedAt` column for accidental logical deletions (if enabled).
* **Constraint**: `GET /portfolio` (active list) MUST filter `WHERE status = 'ACTIVE'`.

---

## 5. Cache & Performance Strategy

### 5.1 Caching Rules (CDN / Edge)

| Endpoint | Cache-Control Header | Scope | Rationale |
| :--- | :--- | :--- | :--- |
| `/prices/today` | `s-maxage=60, swr=30` | Shared (CDN) | Real-time-ish; scrape runs every minute. |
| `/prices/spot` | `s-maxage=900, swr=60` | Shared (CDN) | Historical data changes slowly (daily). |
| `/brands` | `s-maxage=86400, swr=3600` | Shared (CDN) | Master data rarely changes. |
| `/portfolio/*` | `no-store, private` | **NEVER CACHE** | User data must be instant and consistent. |

* `swr` = `stale-while-revalidate`

### 5.2 Application Caching

* Use **TanStack Query** on Frontend for client-side state caching (deduplication of requests).
* **Invalidation**:
  * After `POST /portfolio` → Invalidate `['portfolio', 'list']`, `['portfolio', 'summary']`.
  * After `POST /sell` → Invalidate `['portfolio', 'list']`, `['portfolio', 'summary']`.

---

## 6. Audit & Observability

### 6.1 Request Logging

Every request (Edge/Middleware) must log:

* `trace_id` (generated per request)
* `method`, `path`
* `status_code`
* `duration_ms`
* `identifiers` (User ID or Public Key)

### 6.2 Audit Trail (Business Level)

Record critical events to `AuditLog` table:

* `HOLDING_CREATED`
* `HOLDING_SOLD`
* `SCRAPER_RUN` (success/failure details)

### 6.3 Abuse Signals

Alert if:

* `401 Unauthorized` spike > 100/min (Brute force?)
* `429 Too Many Requests` spike (Scraper attack?)
* API Key usage spike from single IP.

---

## 7. Future-Proofing & Missing Pieces

### 7.1 Identified Missing Pieces (v1)

* **Pagination**: `GET /portfolio` currently returns all. Need `?page=1&limit=20`.
* **Filtering**: `GET /portfolio` needs `?status=ACTIVE` or `?status=SOLD`.
* **Validation**: Zod schemas for all request bodies are managed in Code, but need unified error mapper.

### 7.2 Scalability Hooks

* **Database**: Ready for read-replicas (Prisma supports separate Read/Write URLs).
* **Workers**: Scraper logic isolated; can move to separate Worker service.
* **Multi-Tenancy**: `userId` is pervasive; strictly enforces isolation boundaries.

---

## 8. DO / DON'T Rules

* **DO** validate everything with Zod before touching the Domain layer.
* **DO** use `decimal.js` for ANY currency/weight math.
* **DO** return `404` for "Not Found" vs `403` for "Not Yours" (prevent ID enumeration).
* **DON'T** expose internal integer IDs (use CUID/UUID).
* **DON'T** trust `buyPrice` from client blindly in future (validate against historical logic if possible, though currently user-input).
