import { fetchJson } from '@/frontend/utils/api-client'

/**
 * Export all user data as a JSON blob for download.
 * Returns a Blob directly since this endpoint streams file content.
 */
export async function exportUserData(): Promise<Blob> {
    const response = await fetch('/api/v1/user/export')
    if (!response.ok) throw new Error('Export failed')
    return response.blob()
}

/**
 * Permanently delete the current user's account and all associated data.
 */
export async function deleteUser(): Promise<void> {
    await fetchJson<void>('/api/v1/user/delete', { method: 'DELETE' })
}
