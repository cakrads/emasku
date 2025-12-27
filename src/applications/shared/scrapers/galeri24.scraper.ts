import { Decimal } from 'decimal.js';

export interface ScrapedPrice {
  pricePerGram: Decimal;
  recordedAt: Date;
}

export class Galeri24Scraper {
  private url = 'https://galeri24.co.id/harga-emas';

  async scrape(): Promise<ScrapedPrice> {
    const response = await fetch(this.url, { next: { revalidate: 3600 } });
    const html = await response.text();

    // Extract __NUXT_DATA__
    const match = html.match(/<script id="__NUXT_DATA__" type="application\/json">(.+?)<\/script>/);
    if (!match) {
      throw new Error('Could not find __NUXT_DATA__ in Galeri24 page');
    }

    const data = JSON.parse(match[1]);

    // Logic to find the price in the data array depends on the index, 
    // which we previously analyzed. Let's assume for now we search for "emas_perhiasan" or similar.
    // Based on previous analysis, we look for the price value.
    // For this example, I'll use a placeholder logic that needs to be refined.

    const priceValue = this.extractPriceFromData(data);

    return {
      pricePerGram: new Decimal(priceValue),
      recordedAt: new Date(),
    };
  }

  private extractPriceFromData(data: any[]): number {
    // This is a simplified version of the logic we'd need.
    // We search for a large number that looks like a gold price (e.g. 1,000,000+)
    const potentialPrices = data.filter(v => typeof v === 'number' && v > 500000 && v < 2000000);
    if (potentialPrices.length === 0) throw new Error('Could not extract price from Galeri24 data');

    // Usually the first high number is the "Harga Jual" or similar.
    return potentialPrices[0];
  }
}
