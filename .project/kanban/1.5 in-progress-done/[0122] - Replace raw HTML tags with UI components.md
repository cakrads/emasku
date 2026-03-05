# [0002] Replace Raw HTML Tags with UI Components

**Priority:** HIGH
**Effort:** Large (71 files, 726 tags — batch by feature)
**Category:** Code Quality / Architecture

---

## Problem

726 raw HTML tags (`<div>`, `<p>`, `<h1-h6>`, `<span>`) found across 71 files in `src/frontend/features/`. Violates CLAUDE.md rule: _"No raw HTML tags outside `components/ui/`"_. Should use `Stack`, `Typography`, `Container`, `Section`, `Card`.

## Batch Plan

Execute in this order (group related features together):

### Batch C — Buyback & Holdings List
| Feature | Files | Tags |
|---------|-------|------|
| `admin/buyback-simulation` | 7 | 77 |
| `admin/holdings-list` | 10 | 83 |

### Batch D — Holdings & Profile
| Feature | Files | Tags |
|---------|-------|------|
| `admin/profile` | 1 | 38 |
| `admin/holdings-detail` | 6 | 28 |
| `admin/holdings-create` | 6 | 27 |
| `admin/holdings-brand-category` | 1 | 18 |
| `admin/holdings-edit` | 1 | 4 |

### Batch E — Goals
| Feature | Files | Tags |
|---------|-------|------|
| `admin/goals-detail` | 2 | 26 |
| `admin/goals-list` | 3 | 17 |
| `admin/goals-create` | 1 | 3 |
| `admin/goals-edit` | 1 | 3 |

### Batch B — Dashboard
| Feature | Files | Tags |
|---------|-------|------|
| `admin/dashboard` | 16 | 138 |

### Batch A — Public Pages
| Feature | Files | Tags |
|---------|-------|------|
| `public/landing` | 9 | 168 |
| `public/privacy` | 1 | 46 |
| `public/prices-history` | 2 | 24 |
| `public/prices-list` | 3 | 18 |
| `public/login` | 1 | 13 |

## Replacement Guide

| Raw HTML | UI Component |
|----------|-------------|
| `<div>` for layout | `<Stack>`, `<Container>`, `<Section>` |
| `<div>` for spacing | `<Stack gap="...">` |
| `<p>`, `<span>`, `<h1-h6>` | `<Typography variant="...">` |
| `<section>` | `<Section>` |
| Card-like `<div>` | `<Card>`, `<CardHeader>`, `<CardContent>` |

## Acceptance Criteria

- [ ] Zero raw HTML tags in `src/frontend/features/` (except where truly unavoidable, e.g., `<table>`)
- [ ] Visual output unchanged (compare before/after)
- [ ] `npm run build` passes after each batch
