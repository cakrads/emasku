# [0078] - Extract magic number for 24h ms

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
There is a hardcoded magic number `86_400_000` (24 hours in ms) used. 

**Details:**
- Action Required: Extract this into a properly named constant for clarity. Validate quantity/buyPrice positively alongside it if applicable.
