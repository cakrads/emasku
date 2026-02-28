# PRD: Document Jakarta Timezone for closeDate

## Category: Minor
## Severity: Minor
## Target File: `prisma/schema.prisma`
## Lines: 287-289

## Problem
The `closeDate` field lacks documentation about its explicit Jakarta (WIB) timezone handling.

## Solution
1. Add a `///` doc comment on the `closeDate` field explaining WIB timezone usage.
2. Ensure consistency across the stack.

## Verification
- Review the Prisma schema and verify the documentation is present and clear.
