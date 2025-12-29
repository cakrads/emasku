# Scraper Project Insights

> **Date**: 2025-12-29
> **Component**: Galeri24 Gold Scraper

This document captures the current state, achievements, risks, and recommended improvements for the gold price scraper.

## ✅ What Was Done Well

1. **Production-Grade Architecture**
    * Clean separation of concerns: Fetching, Deserializing, Parsing, and Persisting.
    * Logic is modular and easy to test or modify without breaking other parts.

2. **Robust Idempotency**
    * Uses `createMany({ skipDuplicates: true })`.
    * Relies on database unique constraints (`brandId`, `priceType`, `denomination`, `priceAt`).
    * Safe to run multiple times per day (only new price/date combinations are inserted).

3. **Observability**
    * Comprehensive logging to `.scrap/logs/` (JSON format).
    * API response includes full, structured execution logs.
    * Logs track specific metrics: items extracted, brand combinations, inserted vs. skipped counts.

4. **Data Integrity**
    * **BigInt Support**: Schema correctly handles large values (1kg gold > 2.8B IDR).
    * **Nuxt Deserialization**: Correctly reverses the complex reference-based array serialization used by the source.

5. **Documentation**
    * Detailed integration guides in `scraper-guide.md`.
    * Database setup and schema handling documented in `database-setup.md`.

## ⚠️ Risks / Missed Items

1. **Log Management**
    * **Issue**: Logs are written indefinitely to `.scrap/logs/`.
    * **Risk**: Disk space usage will grow over months/years.
    * **Missing**: Automated log rotation or cleanup strategy (e.g., delete >30 days).

2. **Alerting**
    * **Issue**: Failures are logged to disk/console but do not actively notify.
    * **Risk**: If the scraper breaks (site change), we might not know until we check manually.
    * **Missing**: Slack/Email notifications on `status: 'error'`.

3. **Strict Type Validation**
    * **Issue**: Deserializer handles `any` data from external source.
    * **Risk**: If source data types change (e.g., price becomes a string or negative), it might lead to runtime errors or bad data.
    * **Missing**: Runtime schema validation (e.g., Zod) on the deserialized payload before processing.

## 🚀 Recommended Improvements

1. **Automated Log Cleanup**
    * Add a utility step in `run-scraper` to delete log files older than X days.

2. **Runtime Validation (Zod)**
    * Validate the *shape* of the data after deserialization.
    * Fail fast with clear error messages if the external source schema changes.

3. **API Security**
    * Secure the `/api/v1/scraper/run` endpoint.
    * Add `Authorization: Bearer <SECRET>` to prevent unauthorized access.

4. **Timezone Standardization**
    * Explicitly handle `priceAt` timezones to prevent off-by-one-day errors if server/DB timezones differ.
