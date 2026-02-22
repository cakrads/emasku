/**
 * Nuxt.js __NUXT_DATA__ Deserializer
 * 
 * Resolves reference-based serialization where array indices point to actual values.
 * 
 * Example structure:
 * - Index 3: [4, 16, 22, ...] -> array of item indices
 * - Index 4: { id: 5, price: 6, ... } -> template with refs
 * - Index 5-15: Actual values for item at index 4
 * 
 * This allows efficient serialization by avoiding duplication.
 */

export interface DeserializedGoldPrice {
  id: string
  price: number
  sellingPrice: number
  buybackPrice: number
  description: string | null
  vendorCode: string
  date: string
  denomination: number
  status: string
  createdAt: string
  updatedAt: string
  vendorName: string
}

/**
 * Resolve references in a Nuxt __NUXT_DATA__ serialized array to concrete values.
 *
 * Recursively resolves numeric index references and object properties: when `value` is a number within `data` bounds it is treated as an index reference; when an object is encountered its properties are resolved recursively.
 *
 * @param data - The serialized array containing values and index references.
 * @param value - The value or reference to resolve.
 * @returns The resolved value with index references replaced by their concrete values.
 */
function resolveValue(data: unknown[], value: unknown): unknown {
  if (typeof value === 'number' && value >= 0 && value < data.length) {
    const resolved = data[value]

    // If the resolved value is also a reference (number), recurse
    if (typeof resolved === 'number') {
      return resolveValue(data, resolved)
    }

    // If it's an object, resolve all its properties
    if (typeof resolved === 'object' && resolved !== null && !Array.isArray(resolved)) {
      const resolvedObj: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(resolved)) {
        resolvedObj[key] = resolveValue(data, val)
      }
      return resolvedObj
    }

    return resolved
  }

  // If it's an object, resolve all properties
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const resolvedObj: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      resolvedObj[key] = resolveValue(data, val)
    }
    return resolvedObj
  }

  return value
}

/**
 * Convert a Nuxt.js __NUXT_DATA__ array into a list of structured gold price records.
 *
 * @param data - The raw __NUXT_DATA__ array produced by Nuxt.js; this function expects the item indices to be stored at index `3`.
 * @returns An array of `DeserializedGoldPrice` objects extracted from `data`. Only entries with an `id` and a defined `price` are included; unresolved or malformed entries are skipped.
export function deserializeNuxtData(data: unknown[]): DeserializedGoldPrice[] {
  // Index 3 contains the array of item indices
  const itemIndices = data[3]

  if (!Array.isArray(itemIndices)) {
    console.warn('[Deserializer] Index 3 is not an array, cannot extract items')
    return []
  }

  console.log(`[Deserializer] Found ${itemIndices.length} item indices`)

  const results: DeserializedGoldPrice[] = []

  for (const idx of itemIndices) {
    try {
      // Each index points to an object template with references
      const template = data[idx]

      if (typeof template !== 'object' || template === null) {
        console.warn(`[Deserializer] Index ${idx} is not an object, skipping`)
        continue
      }

      // Resolve all references in the template
      const resolved = resolveValue(data, template) as Record<string, unknown>

      // Validate and convert to DeserializedGoldPrice
      if (resolved.id && resolved.price !== undefined) {
        results.push({
          id: String(resolved.id),
          price: parseFloat(String(resolved.price)) || 0,
          sellingPrice: parseFloat(String(resolved.sellingPrice)) || 0,
          buybackPrice: parseFloat(String(resolved.buybackPrice)) || 0,
          description: (resolved.description as string | null) || null,
          vendorCode: String(resolved.vendorCode || ''),
          date: String(resolved.date || ''),
          denomination: parseFloat(String(resolved.denomination)) || 0,
          status: String(resolved.status || '1'),
          createdAt: String(resolved.createdAt || ''),
          updatedAt: String(resolved.updatedAt || ''),
          vendorName: String(resolved.vendorName || ''),
        })
      }
    } catch (error) {
      console.warn(`[Deserializer] Failed to deserialize item at index ${idx}:`, error)
    }
  }

  console.log(`[Deserializer] Successfully deserialized ${results.length} items`)

  return results
}