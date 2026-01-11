TASK: Implement Authentication with Guest Login and Google Login (Supabase)

CONTEXT
Project: Emasku

We want to implement authentication with the following rules:

- The app HAS a login page
- User can login as Guest
- Later user can login with Google
- Auth is handled by Supabase
- Portfolio and data ownership depend on auth
- Design must be clean, future-proof, and easy to extend

IMPORTANT:
This is a financial app.
Auth architecture must be stable and scalable.
Avoid shortcuts.
Security is NON-NEGOTIABLE.

---

SECURITY REQUIREMENTS (MANDATORY)

These security measures are REQUIRED for a financial application:

1. All auth tokens MUST use httpOnly cookies
2. Token refresh MUST be implemented
3. Server-side validation MUST be enforced
4. Audit logging MUST be enabled for auth events
5. Error messages MUST NOT leak system information

---

AUTH FLOW OVERVIEW

Frontend:

1. User opens app
2. If not authenticated → redirect to /login
3. On login page:
   - User can continue as Guest
   - User can login with Google
4. After login:
   - Session is stored in httpOnly cookie
   - Token is automatically attached to API calls
   - Token refresh is scheduled
5. User enters dashboard

Backend (assumed later):

- JWT validation (REQUIRED - never trust client-side auth alone)
- user_id extraction
- Portfolio scoped per user_id
- Rate limiting on auth endpoints
- Audit logging

---

FRONTEND FILE STRUCTURE (MANDATORY)

Use this structure exactly:

src/auth/
├── supabase.client.ts     # Supabase singleton
├── auth.service.ts        # Core auth logic
├── auth.refresh.ts        # Token refresh handling
├── auth.store.ts          # State management
├── auth.types.ts          # Type definitions
├── auth.errors.ts         # Error handling
└── index.ts               # Public exports

src/lib/
├── cookies.ts             # Secure cookie handling
├── http-client.ts         # HTTP client with auth
└── env.ts                 # Environment variables

src/hooks/
└── useAuth.ts             # React auth hook

src/middleware/
├── auth-guard.ts          # Client-side guard
└── auth.middleware.ts     # Server-side guard (Next.js)

src/pages/
└── login.tsx              # Login page

---

STEP 1: SUPABASE CLIENT

Create a single Supabase client.

Rules:

- No component directly imports Supabase
- Supabase client lives only in auth module
- Environment variables are accessed via env.ts

supabase.client.ts responsibilities:

- Initialize Supabase client
- Export a singleton instance
- Configure auth persistence

---

STEP 2: AUTH TYPES

auth.types.ts should define:

- AuthUser
- AuthSession
- AuthStatus (loading | authenticated | unauthenticated)
- AuthProvider (guest | google)
- AuthError (code, userMessage, debugMessage)

No Supabase types should leak outside this file.

---

STEP 3: AUTH SERVICE (CORE LOGIC)

auth.service.ts must:

- Handle all auth operations
- Hide Supabase implementation details

Expose functions:

- initAuth()
- loginAsGuest()
- loginWithGoogle()
- getSession()
- getAccessToken()
- refreshSession()
- signOut(options?: { scope: 'local' | 'global' })

Rules:

- No UI logic
- No React usage
- No direct cookie access (use cookies util)
- All errors must be wrapped in AuthError type

Guest login:

- Use Supabase anonymous sign-in
- Persist session automatically
- Generate device fingerprint for session binding

Google login:

- Use Supabase OAuth
- Redirect handled by Supabase
- MUST use state parameter for CSRF protection
- No UI assumptions

---

STEP 4: AUTH REFRESH (CRITICAL FOR SECURITY)

auth.refresh.ts responsibilities:

- Schedule automatic token refresh
- Refresh 5 minutes before expiry
- Handle refresh failures gracefully
- Re-authenticate if refresh fails

Expose functions:

- setupAutoRefresh()
- cancelAutoRefresh()
- refreshSession()

Rules:

- Use Supabase onAuthStateChange for session monitoring
- Never let tokens expire during active use
- Silent refresh (no user interaction required)

---

STEP 5: AUTH ERROR HANDLING

auth.errors.ts must define:

Error codes:

- AUTH_INVALID_CREDENTIALS
- AUTH_SESSION_EXPIRED
- AUTH_REFRESH_FAILED
- AUTH_NETWORK_ERROR
- AUTH_RATE_LIMITED
- AUTH_UNKNOWN

Rules:

- NEVER expose raw Supabase errors to UI
- Log detailed errors for debugging (dev only)
- Return sanitized messages to users
- Include error recovery suggestions

Example:

```typescript
interface AuthError {
  code: AuthErrorCode;
  userMessage: string;    // Safe for UI display
  debugMessage?: string;  // Only populated in dev
  recoveryAction?: 'retry' | 'relogin' | 'contact_support';
}
```

---

STEP 6: AUTH STORE (STATE ONLY)

auth.store.ts responsibilities:

- Hold auth state
- Expose reactive state to UI

State includes:

- userId
- isGuest
- authStatus
- provider
- sessionExpiresAt

Rules:

- No API calls
- No Supabase usage
- No side effects

---

STEP 7: COOKIE HANDLING (SECURITY CRITICAL)

cookies.ts responsibilities:

- Set auth token with secure flags
- Read auth token
- Clear auth token
- Handle expiration

MANDATORY Cookie Configuration:

```typescript
{
  httpOnly: true,       // REQUIRED: Prevent XSS access
  secure: true,         // REQUIRED in production: HTTPS only
  sameSite: 'strict',   // REQUIRED: CSRF protection
  path: '/',            // Limit cookie scope
  maxAge: 3600 * 24 * 7 // 7 days max
}
```

Rules:

- One abstraction for all cookie operations
- No document.cookie usage outside this file
- NEVER store tokens in localStorage or sessionStorage
- Use different cookie names for dev/prod to prevent conflicts

---

STEP 8: HTTP CLIENT INTEGRATION

http-client.ts must:

- Automatically attach Authorization header
- Read token from cookies util
- Handle missing token gracefully
- Handle 401 responses (trigger re-auth)

Rules:

- No API call manually attaches token
- Auth must be transparent to feature code
- Implement request interceptor for token attachment
- Implement response interceptor for auth errors

401 Response Handling:

1. Attempt token refresh
2. If refresh succeeds, retry original request
3. If refresh fails, redirect to login

---

STEP 9: AUTH HOOK

useAuth.ts:

- Consumes auth.store
- Exposes:
  - isAuthenticated
  - isGuest
  - user
  - isLoading
  - logout()
  - upgradeToGoogle() (for guest → Google flow)

No business logic here.

---

STEP 10: LOGIN PAGE

Create login.tsx with:

- Button: "Continue as Guest"
- Button: "Continue with Google"

Rules:

- No auth logic in component
- Only call auth.service
- Minimal UI, clean layout
- No dependency on dashboard design
- Show loading states during auth
- Display user-friendly error messages

Example actions:

- Guest button → loginAsGuest()
- Google button → loginWithGoogle()

---

STEP 11: ROUTE GUARD

Client-side (auth-guard.ts):

- Protect private routes
- Redirect unauthenticated users to /login
- Show loading state while checking auth
- Prevent flash of protected content

Server-side (auth.middleware.ts) - REQUIRED:

- Validate JWT on server
- Extract user from token
- Protect API routes
- Never trust client-side auth alone

Rules:

- No UI rendering here
- Reusable across routes
- Server-side validation is MANDATORY

---

STEP 12: GUEST SESSION SECURITY

Guest sessions have special security considerations:

Rules:

- Rate limit guest session creation (backend)
- Consider session cookies (clear on browser close) for guests
- Implement "Claim Account" flow with verification
- Document data migration security for guest → Google upgrade

Guest → Google Upgrade Flow:

1. User initiates upgrade
2. Complete Google OAuth
3. Verify email ownership
4. Migrate data atomically
5. Invalidate old guest session
6. Issue new authenticated session

---

STEP 13: AUDIT LOGGING (MANDATORY FOR FINANCIAL APP)

Log the following auth events:

- Login attempts (success/failure)
- Session creation
- Session refresh
- Logout
- Failed token validation
- Account upgrades

Include in logs:

- Timestamp
- User ID (if available)
- IP address
- User agent
- Event type
- Success/failure status

Rules:

- Never log passwords or full tokens
- Comply with privacy regulations
- Enable anomaly detection (optional but recommended)

---

STEP 14: ENVIRONMENT SECURITY

env.ts must:

- Validate all required env vars at startup
- Fail fast if critical vars are missing
- Never expose server secrets to client

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL        # Public - OK to expose
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY   # Public - OK to expose
SUPABASE_SERVICE_ROLE_KEY       # SECRET - Never expose to client
```

Rules:

- Use NEXT_PUBLIC_ prefix only for client-safe variables
- Different Supabase projects for dev/staging/prod
- Never commit .env files
- Document all env vars in .env.example

---

STEP 15: SECURITY HEADERS (Next.js Config)

Add to next.config.js:

```javascript
headers: [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  },
]
```

---

===========================================================================
INDONESIA UU PDP (PERLINDUNGAN DATA PRIBADI) COMPLIANCE
UU No. 27 Tahun 2022 - Effective since October 17, 2024
===========================================================================

IMPORTANT: As a financial app processing Indonesian user data, Emasku
MUST comply with UU PDP. Non-compliance can result in:

- Administrative fines up to 2% of annual revenue
- Criminal penalties up to 6 years imprisonment
- Fines up to IDR 60 billion

---

STEP 16: CONSENT MANAGEMENT (UU PDP MANDATORY)

UU PDP requires EXPLICIT CONSENT before processing personal data.

Create src/privacy/consent.service.ts:

Consent Requirements:

- Must be explicit, written (digital signature acceptable)
- Must be opt-in (NOT pre-checked boxes)
- Must inform user of:
  - Purpose of data processing
  - Types of data collected
  - Retention period
  - User rights under UU PDP

Expose functions:

- requestConsent(purpose: ConsentPurpose): Promise<boolean>
- getConsentStatus(userId: string): Promise<ConsentRecord>
- withdrawConsent(userId: string, purpose: ConsentPurpose): Promise<void>
- getConsentHistory(userId: string): Promise<ConsentAudit[]>

Consent Purposes to track:

- ACCOUNT_CREATION: For creating user account
- PORTFOLIO_ANALYTICS: For processing portfolio data
- MARKETING: For promotional communications (optional, separate consent)
- THIRD_PARTY_SHARING: If sharing with partners (explicit separate consent)

Storage:

- Store consent records in database
- Include timestamp, IP address, consent version
- Never delete consent history (audit trail required)

UI Requirements:

- Display privacy policy before registration
- Checkbox with clear consent text (not pre-checked)
- Link to full privacy policy document
- Language must be clear and understandable (Bahasa Indonesia)

---

STEP 17: DATA SUBJECT RIGHTS (UU PDP MANDATORY)

Users have the following rights under UU PDP. ALL must be implemented:

1. Right to Information (Hak Informasi)
   - Users must know how their data is processed
   - Implement: Privacy dashboard showing data usage

2. Right to Access (Hak Akses)
   - Users can request a copy of their personal data
   - Implement: Data export feature (JSON/PDF format)
   - Timeline: Must respond within 3x24 hours

3. Right to Correction (Hak Koreksi)
   - Users can update inaccurate personal data
   - Implement: Profile edit functionality
   - Must verify identity before making changes

4. Right to Deletion (Hak Penghapusan)
   - Users can request data deletion
   - Implement: Account deletion feature
   - Timeline: Must complete within 72 hours of request
   - Exception: May retain if required by law (e.g., financial records)

5. Right to Withdraw Consent (Hak Menarik Persetujuan)
   - Users can withdraw consent at any time
   - Implement: Consent management in settings
   - Must cease processing within 72 hours
   - Must delete data within 72 hours (unless other legal basis)

6. Right to Data Portability (Hak Portabilitas)
   - Users can receive their data in electronic format
   - Implement: Export to common format (JSON, CSV)

7. Right to Object (Hak Keberatan)
   - Users can object to certain processing
   - Implement: Object to marketing communications

Create src/privacy/data-rights.service.ts:

```typescript
interface DataRightsService {
  // Right to Access
  exportUserData(userId: string): Promise<UserDataExport>;
  
  // Right to Correction
  updatePersonalData(userId: string, data: PersonalDataUpdate): Promise<void>;
  
  // Right to Deletion
  requestAccountDeletion(userId: string): Promise<DeletionRequest>;
  executeAccountDeletion(requestId: string): Promise<void>;
  
  // Right to Withdraw Consent
  withdrawAllConsent(userId: string): Promise<void>;
  
  // Right to Portability
  generatePortableData(userId: string, format: 'json' | 'csv'): Promise<Buffer>;
}
```

---

STEP 18: PRIVACY NOTICE & TRANSPARENCY (UU PDP MANDATORY)

Create a comprehensive Privacy Policy (Kebijakan Privasi) that includes:

Required Content:

1. Identity of data controller (PT or business entity)
2. Contact information (DPO if applicable)
3. Types of personal data collected
4. Purpose of data processing
5. Legal basis for processing
6. Data retention period
7. Third parties who may receive data
8. Cross-border transfer information (if any)
9. User rights under UU PDP
10. How to exercise rights
11. How to file complaints

File Location: src/pages/privacy-policy.tsx

Display Requirements:

- Must be displayed BEFORE data collection
- Must be in Bahasa Indonesia (can have English version too)
- Must be easily accessible from all pages (footer link)
- Must notify users when policy changes

---

STEP 19: DATA BREACH NOTIFICATION (UU PDP MANDATORY)

If a data breach occurs, notification is REQUIRED.

Create src/privacy/breach.service.ts:

Breach Response Timeline:

1. Within 72 hours: Notify affected users
2. Within 72 hours: Notify data protection authority
3. Document: All breach details and recovery efforts

Notification Must Include:

- Description of the breach
- Types of data exposed
- Approximate number of affected users
- Mitigation steps taken
- Contact for more information
- Steps users should take

Implementation:

```typescript
interface BreachNotification {
  breachId: string;
  discoveredAt: Date;
  notifiedUsersAt?: Date;
  notifiedAuthorityAt?: Date;
  affectedDataTypes: string[];
  estimatedAffectedUsers: number;
  mitigationSteps: string[];
  status: 'investigating' | 'contained' | 'resolved';
}

interface BreachService {
  reportBreach(details: BreachDetails): Promise<BreachNotification>;
  notifyAffectedUsers(breachId: string): Promise<void>;
  notifyAuthority(breachId: string): Promise<void>;
  getBreachStatus(breachId: string): Promise<BreachNotification>;
}
```

---

STEP 20: DATA MINIMIZATION & RETENTION (UU PDP MANDATORY)

Collect ONLY data necessary for the stated purpose.

Data Minimization Rules:

- For guest users: Collect minimal device identifier only
- For Google users: Only request necessary OAuth scopes
- For portfolio: Only store financial data necessary for tracking

Data Retention Policy:

Define retention periods for each data type:

| Data Type | Retention Period | Legal Basis |
|-----------|-----------------|-------------|
| Account data | Active + 5 years | Financial regulations |
| Transaction history | 10 years | Tax/financial regulations |
| Consent records | Indefinite | Audit trail required |
| Access logs | 2 years | Security compliance |
| Marketing preferences | Until withdrawn | Consent |
| Session data | 7 days | Operational necessity |

Implementation:

- Create data retention scheduler
- Automatically purge expired data
- Document all retention decisions

Create src/privacy/retention.service.ts:

```typescript
interface RetentionService {
  scheduleDataPurge(userId: string, dataType: DataType): Promise<void>;
  executeScheduledPurges(): Promise<PurgeReport>;
  getRetentionPolicy(): RetentionPolicy;
  extendRetention(userId: string, dataType: DataType, reason: string): Promise<void>;
}
```

---

STEP 21: CROSS-BORDER DATA TRANSFER (UU PDP)

If data is transferred outside Indonesia (e.g., to Supabase servers):

Requirements:

1. Receiving country MUST have equivalent data protection standards
2. OR implement adequate binding data protection mechanisms
3. OR obtain explicit consent from users for the transfer

Supabase Consideration:

- Check Supabase data residency options
- Document where data is stored (region)
- If outside Indonesia, inform users in privacy policy
- Consider using Supabase's data residency features

Implementation:

- Add data location disclosure to privacy policy
- If needed, implement consent for cross-border transfer
- Document data flow to external services

---

STEP 22: DATA PROTECTION IMPACT ASSESSMENT (DPIA)

For high-risk processing activities, conduct DPIA:

When DPIA is Required:

- Processing sensitive personal data (financial data qualifies)
- Large-scale data processing
- Automated decision-making
- New technologies or processes

DPIA Must Include:

1. Description of processing operations
2. Assessment of necessity and proportionality
3. Assessment of risks to data subjects
4. Measures to address risks

Document: Create DPIA document before launch

---

STEP 23: FILE STRUCTURE UPDATE (PDP MODULE)

Add new privacy module to project structure:

src/privacy/
├── consent.service.ts      # Consent management
├── consent.store.ts        # Consent state
├── consent.types.ts        # Consent types
├── data-rights.service.ts  # Data subject rights
├── retention.service.ts    # Data retention
├── breach.service.ts       # Breach notification
├── privacy.types.ts        # Shared types
└── index.ts                # Public exports

src/pages/
├── privacy-policy.tsx      # Privacy policy page
├── privacy-settings.tsx    # User privacy dashboard
└── data-request.tsx        # Data export/deletion requests

---

STEP 24: FUTURE-PROOFING (MANDATORY)

Design must allow:

- Guest → Google account upgrade
- Persist portfolio data after upgrade
- Multiple auth providers later
- MFA implementation (future)
- Password-based auth (future)
- Data Protection Officer (DPO) integration (if scale requires)

Avoid:

- Hardcoding guest assumptions
- Tight coupling to Supabase
- Provider-specific logic in components
- Collecting unnecessary personal data

---

DELIVERABLES

Required:

- Login page
- Auth module (service, store, types, errors, refresh)
- Cookie utilities with security flags
- HTTP client integration with interceptors
- Client-side route guard
- Server-side auth middleware
- Clear inline documentation

Security-specific:

- auth.errors.ts with sanitized error handling
- auth.refresh.ts with auto-refresh logic
- auth.middleware.ts for server-side validation
- Security headers in next.config.js
- Audit logging integration

UU PDP Compliance:

- Privacy policy page (Bahasa Indonesia)
- Consent management service
- Data subject rights implementation
- Data export functionality
- Account deletion workflow
- Privacy settings dashboard
- Data retention policy documentation
- Breach notification procedures

---

OUT OF SCOPE

- Role management
- Permission system
- UI polish
- MFA implementation
- Data Protection Officer (DPO) appointment

IN SCOPE (previously out of scope, now required):

- Server-side JWT validation (basic)
- Audit event types definition
- Basic UU PDP compliance features

Focus on:

- Security first
- UU PDP compliance
- Correctness
- Clean architecture
- Maintainability

---

SECURITY CHECKLIST (PRE-LAUNCH)

Before deploying to production, verify:

Security:

- [ ] httpOnly cookies enabled
- [ ] Secure flag set in production
- [ ] SameSite=Strict configured
- [ ] Token refresh implemented and tested
- [ ] OAuth state parameter validated (Supabase config)
- [ ] Error messages sanitized (no stack traces)
- [ ] Server-side auth validation in place
- [ ] Audit logging enabled
- [ ] Rate limiting configured (backend)
- [ ] Security headers added to Next.js config
- [ ] Guest session limitations documented
- [ ] Account upgrade flow secured
- [ ] Environment variables validated at startup
- [ ] No tokens in localStorage/sessionStorage
- [ ] 401 handling with auto-refresh implemented

UU PDP Compliance:

- [ ] Privacy policy published (Bahasa Indonesia)
- [ ] Consent collection before data processing
- [ ] Consent withdrawal mechanism working
- [ ] Data export feature functional
- [ ] Account deletion workflow tested
- [ ] 72-hour response capability verified
- [ ] Data retention policy documented
- [ ] Cross-border transfer disclosed (if applicable)
- [ ] Breach notification procedure documented
- [ ] Data minimization reviewed
- [ ] User rights accessible from privacy settings

---

APPENDIX A: SECURITY RATIONALE

Why httpOnly Cookies?

- XSS attacks cannot access httpOnly cookies
- Even if attacker injects malicious JavaScript, tokens are safe

Why Token Refresh?

- Short-lived tokens reduce attack window
- If token is stolen, damage is time-limited
- Better UX than forcing re-login

Why Server-side Validation?

- Client-side auth can be bypassed
- Never trust the client in financial apps
- Defense in depth principle

Why Audit Logging?

- Compliance requirements for financial apps
- Incident investigation capability
- Anomaly detection for security threats

---

APPENDIX B: UU PDP REFERENCE

Law: Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi
Effective: October 17, 2022 (transition period ended October 16, 2024)

Key Principles:

1. Lawfulness (Keabsahan) - Legal basis required
2. Purpose Limitation (Pembatasan Tujuan) - Only process for stated purpose
3. Data Minimization (Minimalisasi Data) - Only collect necessary data
4. Accuracy (Akurasi) - Keep data accurate and updated
5. Storage Limitation (Pembatasan Penyimpanan) - Don't keep longer than necessary
6. Integrity & Confidentiality (Integritas & Kerahasiaan) - Keep data secure
7. Accountability (Akuntabilitas) - Demonstrate compliance

Lawful Bases for Processing:

1. Explicit consent
2. Contractual obligation
3. Legal obligation
4. Vital interests
5. Public interest
6. Legitimate interest (requires balancing test)

Sensitive Data (Data Pribadi Spesifik):

- Health data
- Biometric data
- Genetic data
- Sexual orientation
- Political views
- Religious beliefs
- Criminal records
- Financial data (RELEVANT TO EMASKU)

Note: Financial data is considered sensitive. Extra care required.

Penalties Summary:

| Violation | Administrative | Criminal |
|-----------|---------------|----------|
| Minor breach | Warning | - |
| Data misuse | Up to 2% revenue | Up to 5 years |
| Falsification | - | Up to 6 years + IDR 6B |
| Illegal sale | - | Up to 5 years + IDR 5B |
| Corporate violation | Asset confiscation | Dissolution possible |
