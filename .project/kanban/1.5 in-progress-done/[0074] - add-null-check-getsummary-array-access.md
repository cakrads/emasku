# [0074] - Add null check in getSummary array access

**Source:** PR #4 CodeRabbit Review (Minor)

**Problem:**
`getSummary()` accesses `this.entries[this.entries.length - 1]` without checking if the array is empty. While it typically has a 'started' entry, it could crash in unexpected circumstances.

**Details:**
- Action Required: Add a null/bounds check before accessing the last element of `this.entries`.
