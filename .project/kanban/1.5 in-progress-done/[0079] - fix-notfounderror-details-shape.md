# [0079] - Fix NotFoundError details shape

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
`holdingId` property in the `NotFoundError` details object currently carries a human-readable message string rather than the raw ID value.

**Details:**
- Action Required: Update the `NotFoundError` details object to assign `holdingId: id` properly, and put the text message in a separate `reason` or `message` key.
