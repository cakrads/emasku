import { Decimal } from 'decimal.js';

export interface GoldAssetProps {
  id?: string;
  brand: string;
  weight: Decimal;
  buyPricePerGram: Decimal;
  buyDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GoldAsset {
  private props: GoldAssetProps;

  constructor(props: GoldAssetProps) {
    this.validate(props);
    this.props = props;
  }

  private validate(props: GoldAssetProps) {
    if (props.weight.lessThanOrEqualTo(0)) {
      throw new Error('Weight must be greater than 0');
    }
    if (props.buyPricePerGram.lessThanOrEqualTo(0)) {
      throw new Error('Buy price must be greater than 0');
    }
  }

  get id() { return this.props.id; }
  get brand() { return this.props.brand; }
  get weight() { return this.props.weight; }
  get buyPricePerGram() { return this.props.buyPricePerGram; }
  get buyDate() { return this.props.buyDate; }

  /**
   * Calculates the total buy price of this asset.
   */
  public calculateTotalBuyPrice(): Decimal {
    return this.props.weight.times(this.props.buyPricePerGram);
  }

  /**
   * Calculates the current value based on a given gold price per gram.
   */
  public calculateCurrentValue(currentPricePerGram: Decimal): Decimal {
    return this.props.weight.times(currentPricePerGram);
  }

  /**
   * Calculates the profit/loss (absolute value).
   */
  public calculateProfitLoss(currentPricePerGram: Decimal): Decimal {
    const currentValue = this.calculateCurrentValue(currentPricePerGram);
    const totalBuyPrice = this.calculateTotalBuyPrice();
    return currentValue.minus(totalBuyPrice);
  }

  /**
   * Calculates the profit/loss percentage relative to the buy price.
   */
  public calculateProfitLossPercentage(currentPricePerGram: Decimal): Decimal {
    const totalBuyPrice = this.calculateTotalBuyPrice();
    if (totalBuyPrice.isZero()) return new Decimal(0);

    const profitLoss = this.calculateProfitLoss(currentPricePerGram);
    return profitLoss.dividedBy(totalBuyPrice).times(100);
  }
}
