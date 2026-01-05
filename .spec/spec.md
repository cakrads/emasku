# Gold Portfolio Tracker – Functional Spec

## 1. Objective

A web-based application for individuals to track their physical gold holdings, monitor current market value, and analyze profit/loss performance over time.

This project focuses on:

- User-friendly portfolio tracking.
- Clear financial performance visualization.
- Accurate historical price reference.

---

## 2. Core Concepts

### 2.1 Gold Asset

An individual purchase of gold.

- **Brand**: The manufacturer (e.g., Antam, UBS).
- **Weight**: Total weight in grams.
- **Buy Price**: The price paid per gram at the time of purchase.
- **Buy Date**: When the gold was acquired.

### 2.2 Gold Price Reference

The price used to calculate the current value and historical trends.

- **Live Reference**: Galeri 24 (galeri24.co.id) - Antam 1 Gram price.
- **Historical Reference**: Logam Mulia (logammulia.com/id/grafik-harga-emas) - Used for initial data and 5-year historical trends.

### 2.3 Portfolio Metrics

- **Current Value**: `weight × latest reference price`.
- **Buy Value**: `weight × buy price`.
- **Profit/Loss (Rp)**: `Current Value - Buy Value`.
- **Profit/Loss (%)**: `(Total Profit / Total Buy Value) × 100`.

---

## 3. Features

### 3.1 Dashboard

- **Total Portfolio Summary**: Instant view of total grams owned, total current value, and overall profit/loss status.
- **Performance Indicators**: Visual cues (colors/trends) showing if the portfolio is up or down.

### 3.2 Asset Management

- **Inventory List**: A list of all owned gold assets with their individual details.
- **Add/Edit/Delete**: Tools to keep the portfolio up to date.

### 3.3 Gold Price Insights

- **Current Price**: Display the latest fetched price (SELL/BUYBACK) from Galeri 24.
- **Historical Chart**: Visualize gold price movements over time. **Initial data seeded from Logam Mulia's 5-year history.**
- **Price List**: View detailed price tables for various brands (Antam, UBS, Galeri 24).

### 3.4 Brand Category Management

- **Browse by Brand**: Specialized views to see holdings and current prices grouped by manufacturer (Antam, UBS, Lotus Archi, etc).

---

## 4. Roadmap (Future)

- **Goal Pockets**: Allocate gold assets to specific savings goals (e.g., "Emergency Fund", "Down Payment").
- **Automatic Alerts**: Notification when gold price hits a specific target.

---

> [!NOTE]
> For technical implementation details, financial precision rules, and architecture, refer to [tech-spec.md](file:///c:/Project/emasku/tech-spec.md).
