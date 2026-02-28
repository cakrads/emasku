# [0098] No Pessimistic Locking on Concurrent Sells

## Category
Concurrency — 🟠 Major

## Problem
`sellHolding` in `PrismaPortfolioRepository` reads the holding inside a
transaction but without a database lock. Two concurrent sell requests for the
same holding can both read status=ACTIVE and both proceed, resulting in
duplicate sell transactions.

## Fix
Use `updateMany` with a `status: 'ACTIVE'` WHERE clause as the final write.
If `updated.count === 0`, throw `ConflictError('Holding already sold')`.
This ensures only one request can successfully transition the status.

## Files
- `src/applications/shared/persistence/repositories/prisma-portfolio-repository.ts`
