/**
 * Format currency in IDR
 * 
 * Supports locale for number formatting (dots vs commas),
 * but always uses IDR currency code.
 */
export function formatCurrency(value: number, locale: string = 'id-ID'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}
