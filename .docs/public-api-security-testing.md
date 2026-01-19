# Public API Security - Testing Guide

## Prerequisites

```bash
# Start dev server
npm run dev
```

---

## 1. Test User-Agent Blocking

**Expected**: Blocked requests return `403 Forbidden`

```bash
# ❌ Should be BLOCKED (curl UA)
curl http://localhost:3000/api/v1/prices/today
res: {"code":403,"success":false,"message":"Forbidden","data":null}

# ❌ Should be BLOCKED (empty UA)
curl -H "User-Agent: " http://localhost:3000/api/v1/prices/today
res: {"code":403,"success":false,"message":"Forbidden","data":null}

# ✅ Should PASS (browser-like UA)
# Note: Only passes if ENFORCE_PUBLIC_API_KEY is NOT set or set to false
curl -H "User-Agent: Mozilla/5.0 Chrome" http://localhost:3000/api/v1/prices/today
```

---

## 2. Test API Key Validation

> ⚠️ **Important**: API key validation is **SKIPPED by default** in development.
>
> It is only enforced when:
>
> - `ENFORCE_PUBLIC_API_KEY=true` in `.env`, OR
> - Running in production (`NODE_ENV=production`)
>
> **If you get 401 unexpectedly**, check if you have `ENFORCE_PUBLIC_API_KEY=true` in your `.env`.

### Without enforcement (default dev mode)

```bash
# ✅ Should PASS without x-public-key header
curl -H "User-Agent: Mozilla/5.0 Chrome" http://localhost:3000/api/v1/prices/today
```

### With enforcement enabled

```bash
# First, add to .env: ENFORCE_PUBLIC_API_KEY=true
# Then restart dev server

# ❌ Should return 401 (no key)
curl -H "User-Agent: Mozilla/5.0" http://localhost:3000/api/v1/prices/today

# ❌ Should return 401 (invalid key format)
curl -H "User-Agent: Mozilla/5.0" \
     -H "x-public-key: invalid_key" \
     http://localhost:3000/api/v1/prices/today

# ✅ Should PASS (valid key)
curl -H "User-Agent: Mozilla/5.0" \
     -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
     http://localhost:3000/api/v1/prices/today
```

---

## 3. Test Rate Limiting

> Requires Upstash Redis configured in `.env`

```bash
# Add to .env:
# UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
# UPSTASH_REDIS_REST_TOKEN=xxx

# Run 61+ requests to trigger limit
for i in {1..65}; do
  echo "Request $i"
  curl -s -o /dev/null -w "%{http_code}\n" \
       -H "User-Agent: Mozilla/5.0" \
       -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
       http://localhost:3000/api/v1/prices/today
done

# After ~60 requests, should see: 429
```

**Check rate limit headers:**

```bash
curl -I -H "User-Agent: Mozilla/5.0" \
        -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
        http://localhost:3000/api/v1/prices/today

# Look for:
# X-RateLimit-Limit: 60
# X-RateLimit-Remaining: 59
# X-RateLimit-Reset: <timestamp>
```

---

## 4. Test Cache Headers

> If `ENFORCE_PUBLIC_API_KEY=true`, add `-H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>"` to all commands below.

```bash
curl -I -H "User-Agent: Mozilla/5.0" \
        -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
        http://localhost:3000/api/v1/prices/today

# Should see:
# Cache-Control: public, s-maxage=60, stale-while-revalidate=30
# X-RateLimit-Limit: 60
# X-RateLimit-Remaining: XX

curl -I -H "User-Agent: Mozilla/5.0" \
        -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
        "http://localhost:3000/api/v1/prices/spot?brand=ANTAM&range=30d"

# Should see:
# Cache-Control: public, s-maxage=900, stale-while-revalidate=60
```

---

## 5. Test Predefined Ranges (Anti-Scraping)

> If `ENFORCE_PUBLIC_API_KEY=true`, add `-H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>"` to all commands below.

```bash
# ✅ Valid range
curl -H "User-Agent: Mozilla/5.0" \
     -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
     "http://localhost:3000/api/v1/prices/spot?brand=ANTAM&range=30d"

# ✅ All valid ranges: 7d, 30d, 90d, 1y, 5y
curl -H "User-Agent: Mozilla/5.0" \
     -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
     "http://localhost:3000/api/v1/prices/spot?brand=ANTAM&range=5y"

# ❌ Invalid range (should return 400)
curl -H "User-Agent: Mozilla/5.0" \
     -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
     "http://localhost:3000/api/v1/prices/spot?brand=ANTAM&range=100d"

# ❌ Old from/to params no longer work
curl -H "User-Agent: Mozilla/5.0" \
     -H "x-public-key: <NEXT_PUBLIC_API_KEY_WEB>" \
     "http://localhost:3000/api/v1/prices/spot?brand=ANTAM&from=2020-01-01&to=2025-01-01"
```

---

## 6. Test in Browser (Network Tab)

1. Open DevTools → Network tab
2. Navigate to `/prices/history`
3. Find request to `/api/v1/prices/spot`
4. Check:
   - Request has `range=5y` (not from/to)
   - Response has `Cache-Control` header
   - Response has `X-RateLimit-*` headers (if Redis configured)

---

## Quick Checklist

| Feature | Test Command | Expected |
|---------|--------------|----------|
| UA Block | `curl http://localhost:3000/api/v1/prices/today` | 403 |
| Valid UA | `curl -H "User-Agent: Mozilla/5.0" ...` | 200 |
| Rate Limit | 65 rapid requests | 429 after ~60 |
| Cache Header | `curl -I ...` | `s-maxage=60` |
| Range Param | `?range=30d` | 200 |
| Invalid Range | `?range=100d` | 400 |
