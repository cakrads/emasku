# [0065] - Use custom prisma in compute daily close

**Source:** PR #4 CodeRabbit Review (Major)

**Problem:**
Prisma client mismatch. `ComputeDailyCloseUsecase` uses global DB connection while `PrismaPriceRepository` uses custom instance.

**Details:**
- File: `src/applications/shared/scrapers/run-scraper.ts`
- File: `src/applications/modules/prices/v1/usecases/compute-daily-close.usecase.ts`

**Action Required:**
Update the usecase constructor to accept `prisma: PrismaClient` so the custom connection pool applies.
