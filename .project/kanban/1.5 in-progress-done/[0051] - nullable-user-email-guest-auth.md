# [0051] - Nullable User.email for guest authentication

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
`User.email` required field conflicts with guest authentication model. 
Line 121 enforces non-null email, but guest users are modeled with nullable email.

**Details:**
- File: `prisma/schema.prisma`

**Action Required:**
Change `email String @unique` to `email String? @unique`.
