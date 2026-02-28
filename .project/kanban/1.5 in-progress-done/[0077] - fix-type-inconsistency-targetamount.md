# [0077] - Fix type inconsistency for targetAmount

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
`targetAmount` data interfaces use `bigint` but the domain model is `number | null`. Converting `BigInt` to `number` loses precision for large values, defeating the purpose of using `bigint`.

**Details:**
- File: Goal domains/interfaces.
- Action Required: Align the types between the data interface and the domain model, ensuring consistent use of `bigint` or `number` where appropriate without arbitrary downstream dropping of precision.
