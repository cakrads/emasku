import { GetPortfolioUseCase } from '../usecase/get-portfolio';
import { AddHoldingUseCase } from '../usecase/add-holding';
import { PrismaPortfolioRepository } from '../../../../shared/persistence/repositories/prisma-portfolio-repository';
import { NextResponse } from 'next/server';

const portfolioRepo = new PrismaPortfolioRepository();

export class PortfolioController {
  async getPortfolio() {
    try {
      const useCase = new GetPortfolioUseCase(portfolioRepo);
      const portfolio = await useCase.execute();

      // Transform to DTO if needed, but for now just return the data
      return NextResponse.json(portfolio);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  async addHolding(request: Request) {
    try {
      const data = await request.json();
      const useCase = new AddHoldingUseCase(portfolioRepo);
      const asset = await useCase.execute(data);

      return NextResponse.json(asset, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
