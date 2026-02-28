# [0085] Validate sellDate in Bulk Sell Usecase

## Category
Input Validation / Data Integrity

## Problem
`BulkSellHoldingUsecase.execute()` passes `new Date(input.sellDate)` directly to the repository
without validating the date string. If `sellDate` is invalid (e.g., `"not-a-date"`), it produces
an invalid `Date` object that propagates to the DB layer.

The single `SellHoldingUsecase` already validates sellDate with `isNaN(date.getTime())` and a 
future-date check — the bulk sell should match.

## Fix
Add the same date validation from `SellHoldingUsecase`:
```ts
const sellDateObj = new Date(input.sellDate)
if (Number.isNaN(sellDateObj.getTime())) {
  throw new ValidationError('Invalid sell date format', { ... })
}
if (sellDateObj.getTime() > new Date().getTime() + ONE_DAY_MS) {
  throw new ValidationError('Invalid sell date', { ... })
}
```

## Files
- `src/applications/modules/portfolio/v1/usecases/bulk-sell-holding.usecase.ts`
