/**
 * POST /api/v1/portfolio/bulk-sell
 * 
 * Sells multiple holdings with a single sell price.
 * Requires authentication.
 */

import { NextRequest } from 'next/server'
import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PortfolioController } from '@/applications/modules/portfolio/v1/delivery/http/portfolio-controller'

export const POST = async (req: NextRequest) => {
    return wrapController(async () => {
        const controller = new PortfolioController()
        return controller.bulkSellHoldings(req)
    })(req)
}
