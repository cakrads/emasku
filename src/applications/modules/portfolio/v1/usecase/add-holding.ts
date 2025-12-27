import { GoldAsset } from '../domain/entity';
import { IPortfolioRepository } from '../domain/repository';
import { Decimal } from 'decimal.js';

export interface AddHoldingRequest {
  brand: string;
  weight: number;
  buyPricePerGram: number;
  buyDate: string;
}

export class AddHoldingUseCase {
  constructor(private portfolioRepo: IPortfolioRepository) { }

  async execute(request: AddHoldingRequest): Promise<GoldAsset> {
    const asset = new GoldAsset({
      brand: request.brand,
      weight: new Decimal(request.weight),
      buyPricePerGram: new Decimal(request.buyPricePerGram),
      buyDate: new Date(request.buyDate),
    });

    return await this.portfolioRepo.save(asset);
  }
}
