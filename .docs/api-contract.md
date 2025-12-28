# Gold Price & Portfolio API — Contract (v1)

Base URL:

```
/api/v1
```

---

## 1. Price APIs

### 1.1 Get Spot Price Time Series

**Endpoint**

```
GET /price/spot
```

**Query Params**

| Name         | Type     | Required | Description                 |
| ------------ | -------- | -------- | --------------------------- |
| brand        | string   | yes      | Brand code (e.g. `ANTAM`)   |
| from         | ISO date | yes      | Start date (UTC)            |
| to           | ISO date | yes      | End date (UTC)              |
| denomination | number   | no       | Weight in gram (default: 1) |

**Response**

```json
{
  "brand": "ANTAM",
  "priceType": "SPOT",
  "denominationGram": 1,
  "currency": "IDR",
  "data": [
    {
      "priceAt": "2020-01-01T00:00:00Z",
      "price": 750000
    }
  ]
}
```

---

### 1.2 Get Today Prices (Sell & Buyback)

**Endpoint**

```
GET /price/today
```

**Query Params**

| Name         | Type   | Required | Description     |
| ------------ | ------ | -------- | --------------- |
| brand        | string | no       | Filter by brand |
| denomination | number | no       | Weight in gram  |

**Response**

```json
{
  "date": "2025-01-01",
  "currency": "IDR",
  "items": [
    {
      "brand": "ANTAM",
      "denominationGram": 1,
      "sellPrice": 1050000,
      "buybackPrice": 980000
    }
  ]
}
```

---

## 2. Portfolio APIs

> Requires authentication

### 2.1 Add Gold Holding

**Endpoint**

```
POST /portfolio
```

**Body**

```json
{
  "brand": "ANTAM",
  "denominationGram": 5,
  "quantity": 2,
  "buyPrice": 950000,
  "buyDate": "2023-06-01"
}
```

**Response**

```json
{
  "id": "cuid",
  "status": "CREATED"
}
```

---

### 2.2 List Portfolio With Current Valuation

**Endpoint**

```
GET /portfolio
```

**Response**

```json
{
  "currency": "IDR",
  "items": [
    {
      "brand": "ANTAM",
      "denominationGram": 5,
      "quantity": 2,
      "avgBuyPrice": 950000,
      "currentBuybackPrice": 980000,
      "currentValue": 9800000,
      "unrealizedPnL": 300000
    }
  ]
}
```

---

### 2.3 Portfolio Summary

**Endpoint**

```
GET /portfolio/summary
```

**Response**

```json
{
  "totalBuyValue": 19000000,
  "totalCurrentValue": 19600000,
  "totalPnL": 600000,
  "pnlPercentage": 3.15
}
```

---

## 3. Brand APIs

### 3.1 List Brands

**Endpoint**

```
GET /brands
```

**Response**

```json
{
  "items": [
    {
      "code": "ANTAM",
      "name": "Antam",
      "isActive": true
    }
  ]
}
```

---

## 4. Design Notes (Important)

* All prices are **immutable historical facts**
* Currency is fixed to **IDR** in v1
* Timezone is **UTC**
* Aggregation & valuation are handled in **backend**
* Frontend should be display-only (no financial math)

---

## 5. Versioning Policy

* Breaking changes → new version (`/api/v2`)
* Backward-compatible additions stay in v1
* v1 contracts are stable and auditable
