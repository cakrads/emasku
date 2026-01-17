'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export interface FilterState {
  brand: string | null
  status: 'active' | 'sold' | 'all'
  sortBy: 'date' | 'value'
  sortOrder: 'asc' | 'desc'
  pageIndex: number
  pageSize: number
}

export function useUrlFilters(initialState: Partial<FilterState> = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const defaultState: FilterState = {
    brand: null,
    status: 'active',
    sortBy: 'date',
    sortOrder: 'desc',
    pageIndex: 0,
    pageSize: 10,
    ...initialState,
  }

  // Helper to get value from URL with type safety and fallback
  const getParam = useCallback(
    <T extends string>(name: string, fallback: T, allowed?: T[]): T => {
      const val = searchParams.get(name) as T | null
      if (val && (!allowed || allowed.includes(val))) return val
      return fallback
    },
    [searchParams]
  )

  // Derived state from URL
  const filters: FilterState = {
    brand: searchParams.get('brand'),
    status: getParam<'active' | 'sold' | 'all'>('status', defaultState.status, ['active', 'sold', 'all']),
    sortBy: getParam<'date' | 'value'>('sort', defaultState.sortBy, ['date', 'value']),
    sortOrder: getParam<'asc' | 'desc'>('order', defaultState.sortOrder, ['asc', 'desc']),
    pageIndex: Math.max(0, parseInt(searchParams.get('page') || '1') - 1),
    pageSize: parseInt(searchParams.get('size') || defaultState.pageSize.toString()),
  }

  // Update URL manually
  const updateUrl = useCallback(
    (newFilters: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString())

      const merged = { ...filters, ...newFilters }

      // Set or delete params based on whether they match defaults
      if (merged.brand) params.set('brand', merged.brand)
      else params.delete('brand')

      if (merged.status !== defaultState.status) params.set('status', merged.status)
      else params.delete('status')

      if (merged.sortBy !== defaultState.sortBy) params.set('sort', merged.sortBy)
      else params.delete('sort')

      if (merged.sortOrder !== defaultState.sortOrder) params.set('order', merged.sortOrder)
      else params.delete('order')

      // Only set page if > 1 to keep URL clean
      if (merged.pageIndex > 0) params.set('page', (merged.pageIndex + 1).toString())
      else params.delete('page')

      // Only set size if differs from default
      if (merged.pageSize !== defaultState.pageSize) params.set('size', merged.pageSize.toString())
      else params.delete('size')

      const queryString = params.toString()
      const url = `${pathname}${queryString ? `?${queryString}` : ''}`

      // Use push to allow users to use the browser Back button to revert filters
      router.push(url, { scroll: false })
    },
    [searchParams, pathname, router, filters, defaultState]
  )

  return {
    filters,
    updateUrl,
    setBrand: (brand: string | null) => updateUrl({ brand, pageIndex: 0 }),
    setStatus: (status: 'active' | 'sold' | 'all') => updateUrl({ status, pageIndex: 0 }),
    setSort: (sortBy: 'date' | 'value', sortOrder: 'asc' | 'desc') => updateUrl({ sortBy, sortOrder }),
    setPagination: (pageIndex: number, pageSize: number) => updateUrl({ pageIndex, pageSize }),
  }
}
