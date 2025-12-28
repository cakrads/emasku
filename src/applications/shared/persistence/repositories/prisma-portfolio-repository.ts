import { GoldAsset } from '../../../modules/portfolio/v1/domain/entity';
import { IPortfolioRepository } from '../../../modules/portfolio/v1/domain/repository';
// import { prisma } from '../prisma-client';
// import { Decimal } from 'decimal.js';

export class PrismaPortfolioRepository implements IPortfolioRepository {
  async save(asset: GoldAsset): Promise<GoldAsset> {
    throw new Error('Method not implemented.');
    /*
    const savedAsset = await prisma.goldAsset.create({
      data: {
        brand: asset.brand,
        weight: asset.weight,
        buyPricePerGram: asset.buyPricePerGram,
        buyDate: asset.buyDate,
      },
    });

    return this.toDomain(savedAsset);
    */
  }

  async findById(id: string): Promise<GoldAsset | null> {
    throw new Error('Method not implemented.');
    /*
    const asset = await prisma.goldAsset.findUnique({
      where: { id },
    });

    if (!asset) return null;
    return this.toDomain(asset);
    */
  }

  async findAll(): Promise<GoldAsset[]> {
    return [];
    /*
    const assets = await prisma.goldAsset.findMany();
    return assets.map(this.toDomain);
    */
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
    /*
    await prisma.goldAsset.delete({
      where: { id },
    });
    */
  }

  async update(asset: GoldAsset): Promise<GoldAsset> {
    throw new Error('Method not implemented.');
    /*
    if (!asset.id) throw new Error('Cannot update asset without ID');

    const updatedAsset = await prisma.goldAsset.update({
      where: { id: asset.id },
      data: {
        brand: asset.brand,
        weight: asset.weight,
        buyPricePerGram: asset.buyPricePerGram,
        buyDate: asset.buyDate,
      },
    });

    return this.toDomain(updatedAsset);
    */
  }

  /*
  private toDomain(prismaAsset: any): GoldAsset {
    return new GoldAsset({
      id: prismaAsset.id,
      brand: prismaAsset.brand,
      weight: new Decimal(prismaAsset.weight.toString()),
      buyPricePerGram: new Decimal(prismaAsset.buyPricePerGram.toString()),
      buyDate: prismaAsset.buyDate,
      createdAt: prismaAsset.createdAt,
      updatedAt: prismaAsset.updatedAt,
    });
  }
  */
}
