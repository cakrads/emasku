import { GoldAsset } from './entity';

export interface IPortfolioRepository {
  save(asset: GoldAsset): Promise<GoldAsset>;
  findById(id: string): Promise<GoldAsset | null>;
  findAll(): Promise<GoldAsset[]>;
  delete(id: string): Promise<void>;
  update(asset: GoldAsset): Promise<GoldAsset>;
}
