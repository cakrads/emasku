PROMPT:

Build a mobile-first dashboard page for a web app called Emasku, a personal gold portfolio tracker.

Product context

Emasku is a financial time-series system, not a CRUD app.
The dashboard’s single goal is to answer:
“What is the current value of my gold portfolio, and what changed?”

Design principles (must follow)

Calm, trustworthy, financial tone

Prioritize clarity over decoration

One primary question per page

No technical jargon visible to users

No tables on mobile

Page structure (strict order)

Hero section

Large total portfolio value (IDR)

Overall gain/loss since purchase (amount + percentage)

Today’s change (positive or negative)

This section must be readable in under 3 seconds

Price freshness indicator

Small text showing last price update time

Example: “Last updated at 08:00”

Should visually reinforce trust

Brand breakdown

Card-based layout per gold brand (e.g. ANTAM, Galeri24)

Each card shows:

Brand name

Total grams owned

Current value

Small delta indicator

Max 3–4 cards visible, horizontal scroll on mobile

Portfolio performance snapshot

A simple, minimal line chart

Shows total portfolio value over the last 7 days

No intraday candles

No multiple charts

Primary action

One clear primary button: “Add Gold Holding”

Visually prominent but not aggressive

Explicit exclusions (do NOT include)

No SPOT / SELL / BUYBACK labels

No editable prices

No admin or settings controls

No dense tables

No multi-brand charts

Layout requirements

Mobile-first design

Vertical scrolling

Thumb-friendly spacing

Desktop version may expand spacing but not add features

Visual style

Neutral financial colors (white, soft gray, muted gold accent)

No heavy gradients

Minimal animation, informational only

Deliver a single dashboard page UI that feels like a serious financial product, not a marketing landing page.
