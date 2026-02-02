# Gold Portfolio Tracker — API Contract (v1)

> This document defines the **public API contract** for the Gold Portfolio Tracker (Emasku).
> It is designed for **financial correctness**, **vibe-code friendliness**, and **strict auditability**.

---

## 0. Endpoint Summary

| Domain | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Market** | `GET` | `/prices/spot` | Historical spot price series (charts). |
| **Market** | `GET` | `/prices/today` | Current sell & buyback prices grouped by brand. |
| **Master** | `GET` | `/brands` | List supported brands (ANTAM, UBS, etc). |
| **Portfolio** | `GET` | `/portfolio/summary` | Portfolio aggregate metrics (PNL, Total Grams). |
| **Portfolio** | `GET` | `/portfolio` | List holdings with current real-time valuation. |
| **Portfolio** | `POST` | `/portfolio` | Add new gold holding. |
| **Portfolio** | `POST` | `/portfolio/{id}/sell` | Mark a holding as SOLD (Soft Close). |
| **System** | `POST` | `/scraper/run` | Trigger on-demand price scraping (Auth required). |

---

## 1. Global Conventions

### 1.1 Standard Response Envelope

All endpoints MUST return responses in the following standard structure:

```json
{
  "code": 200,
  "success": true,
  "message": "Human readable summary",
  "data": {},
  "details": {}
}
```

### Field Semantics

| Field | Description |
| :--- | :--- |
| `code` | Numeric HTTP status code (200, 201, 400, 401, 404, 500). |
| `success` | Boolean flag for easy frontend conditional logic. |
| `message` | User-friendly message (e.g., for Toast notifications). |
| `data` | The primary business payload. |
| `details` | Supplementary info (pagination, diagnostics, validation errors). |

---

### 1.2 Security & Limits

To ensure service quality, Public Market APIs are protected by the following mechanisms:

### Rate Limiting

- **Spot Prices** (`/prices/spot`): 20 requests/minute
- **Today Prices** (`/prices/today`): 60 requests/minute
- Limits are applied per `IP + API Key` combination.
- Exceeding limits returns `429 Too Many Requests`.

### Caching

- Responses include `Cache-Control` headers (CDN aware).
- Historical data is cached for **15 minutes**.
- Live price data is cached for **60 seconds**.

### Public API Key

- Header: `x-public-key`
- Required in Production environments.
- Format: `emasku_pub_v1_<client>_<id>`

---

## 2. Market APIs (Public)

These endpoints expose **market truth**, agnostic of specific user ownership.

## 2.1 Spot Price Time Series (Chart)

**Purpose**: Fetch historical price data for charting (e.g., 7d, 30d, 1y). This endpoint sources data from the `GoldDailyClose` table (Daily Close at 23:59 WIB).

**Endpoint**: `GET /prices/spot`

### Query Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| brand | string | yes | Brand code (e.g., `ANTAM`). |
| from | ISO date | yes | Start date (UTC). |
| to | ISO date | yes | End date (UTC). |
| denomination | number | no | Weight in gram (default: 1). |

### Response Example

```json
{
  "code": 200,
  "success": true,
  "message": "Spot price series retrieved",
  "data": {
    "brand": "ANTAM",
    "priceType": "SELL",
    "denominationGram": 1,
    "currency": "IDR",
    "series": [
      {
        "priceAt": "2020-01-01T00:00:00Z",
        "price": 750000
      }
    ]
  },
  "details": {
    "totalPoints": 1,
  }
}
```

---

## 2.2 Today Prices (Sell & Buyback)

**Purpose**: Get current detailed pricing tables for all brands.

**Endpoint**: `GET /prices/today`

### Query Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| brand | string | no | Filter by brand. |
| denomination | number | no | Filter by gram. |

### Response Example

```json
{
  "code": 200,
  "success": true,
  "message": "Current prices retrieved",
  "data": {
    "date": "2025-01-01",
    "currency": "IDR",
    "brands": [
      {
        "brand": "ANTAM",
        "prices": [
          {
            "denominationGram": 1,
            "sellPrice": 1050000,
            "buybackPrice": 980000
          },
          {
            "denominationGram": 2,
            "sellPrice": 2080000,
            "buybackPrice": 1960000
          }
        ]
      }
    ]
  },
  "details": {
    "source": "Galeri 24 Scraper",
    "fetchedAt": "2025-01-01T08:00:00Z"
  }
}
```

---

## 3. Portfolio APIs (Authenticated)

These endpoints expose **user-owned holdings** and their **derived valuations**.

## 3.1 Portfolio Summary (Dashboard)

**Purpose**: High-level PNL and asset totals for the dashboard header.

**Endpoint**: `GET /portfolio/summary`

### Response Example

```json
{
  "code": 200,
  "success": true,
  "message": "Portfolio summary computed",
  "data": {
    "totalBuyValue": 19000000,
    "totalCurrentValue": 19600000,
    "totalPnL": 600000,
    "pnlPercentage": 3.15,
    "totalWeightGram": 20.5
  },
  "details": {
    "holdingCount": 12,
    "lastUpdated": "2025-01-01T09:30:00Z"
  }
}
```

---

## 3.2 List Portfolio Holdings

**Purpose**: Detailed view of all individual gold purchases with real-time valuation.

**Endpoint**: `GET /portfolio`

### Response Example

```json
{
  "code": 200,
  "success": true,
  "message": "Portfolio retrieved",
  "data": {
    "currency": "IDR",
    "items": [
      {
        "id": "cuid_1",
        "brand": "ANTAM",
        "denominationGram": 5,
        "quantity": 2,
        "avgBuyPrice": 950000,
        "currentBuybackPrice": 980000,
        "currentValue": 9800000,
        "unrealizedPnL": 300000
      }
    ]
  },
  "details": {
    "totalItems": 1,
    "valuationMethod": "LATEST_BUYBACK",
    "priceAsOf": "2025-01-01T08:00:00Z"
  }
}
```

---

## 3.3 Add Gold Holding

**Endpoint**: `POST /portfolio`

### Request Body

```json
{
  "brand": "ANTAM",
  "denominationGram": 5,
  "quantity": 2,
  "buyPrice": 950000,
  "buyDate": "2023-06-01"
}
```

### Response Example

```json
{
  "code": 201,
  "success": true,
  "message": "Holding added successfully",
  "data": {
    "id": "cuid_example",
    "status": "CREATED"
  },
  "details": {
    "auditLogId": "log_12345",
    "serverTime": "2025-01-01T10:00:00Z"
  }
}
```

---

## 3.4 Sell Holding (Soft Close)

**Purpose**: Record a sale. This marks the holding as SOLD so it no longer counts towards active portfolio weight but remains as a historical record.

**Endpoint**: `POST /portfolio/{id}/sell`

### Request Body

```json
{
  "sellPrice": 1050000,
  "sellDate": "2025-01-01"
}
```

### Response Example

```json
{
  "code": 200,
  "success": true,
  "message": "Holding marked as sold",
  "data": {
    "id": "cuid_example",
    "realizedPnL": 100000,
    "status": "SOLD"
  },
  "details": {
    "processingTimeMs": 45
  }
}
```

---

## 4. Master Data APIs

## 4.1 List Brands

**Endpoint**: `GET /brands`

### Response Example

```json
{
  "code": 200,
  "success": true,
  "message": "Supported brands retrieved",
  "data": {
    "items": [
      {
        "code": "ANTAM",
        "name": "Antam",
        "isActive": true
      },
      {
        "code": "UBS",
        "name": "UBS Gold",
        "isActive": true
      }
    ]
  },
  "details": {
    "totalAvailable": 4
  }
}
```

---

## 5. Error Response Standard

In case of a failure, the `details` field provides deep diagnostic info.

### Response Example

```json
{
  "code": 400,
  "success": false,
  "message": "Validation failed",
  "data": null,
  "details": {
    "errorType": "VALIDATION_ERROR",
    "errors": [
      {
        "field": "quantity",
        "issue": "must_be_positive",
        "received": -1
      }
    ],
    "traceId": "tx_abc123"
  }
}
```

---

## 6. Technical Decisions (Rationale)

- **Backend-Driven Valuation**: All money and PNL calculations happen in the Application Layer.
- **Fixed Currency**: IDR is the system invariant. No multi-currency in v1.
- **Immutable History**: Market prices are immutable facts; transactions are mutable but audited.
- **Time Semantics**: All timestamps are ISO 8601 (UTC).

---

## 7. Versioning Policy

- Breaking changes → `/api/v2`
- Backward-compatible additions stay in v1.
- v1 contracts are stable and auditable.

---

> This document is the source of truth for the API layer implementation.
