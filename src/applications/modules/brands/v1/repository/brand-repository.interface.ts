/**
 * Brand Repository Interface
 */

import { Brand } from '../domain/brand'

export interface IBrandRepository {
  /**
   * Get all active brands
   */
  getActiveBrands(): Promise<Brand[]>
}
