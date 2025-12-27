import { GoldAsset } from '../domain/entity';
import { IPortfolioRepository } from '../domain/repository';

export class GetPortfolioUseCase {
  constructor(private portfolioRepo: IPortfolioRepository) { }

  async execute(): Promise<GoldAsset[]> {
    return await this.portfolioRepo.findAll();
  }
}
