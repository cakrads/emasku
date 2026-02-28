# [0076] - Prevent runtime error on optional timestamp

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
`priceMap.get(key)!.timestamp!` uses non-null assertions, but `timestamp` is optional in `RawPriceData`. If an entry lacks a timestamp, this throws an error.

**Details:**
- Action Required: Validate existence of `timestamp` safely before accessing it.
