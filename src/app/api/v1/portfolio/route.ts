import { PortfolioController } from '@/applications/modules/portfolio/v1/http/controller';
import { NextRequest } from 'next/server';

const controller = new PortfolioController();

export async function GET() {
  return await controller.getPortfolio();
}

export async function POST(request: NextRequest) {
  return await controller.addHolding(request);
}
