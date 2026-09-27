export interface RentalPriceTier {
  min_days: number;
  price_per_day: number;
}

export function normalizeRentalPriceTiers(value: unknown): RentalPriceTier[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((tier) => ({
      min_days: Number((tier as RentalPriceTier)?.min_days),
      price_per_day: Number((tier as RentalPriceTier)?.price_per_day),
    }))
    .filter((tier) => Number.isInteger(tier.min_days) && tier.min_days >= 1 && Number.isSafeInteger(tier.price_per_day) && tier.price_per_day > 0)
    .sort((a, b) => b.min_days - a.min_days);
}

export function getRentalPriceTiers(specs: unknown): RentalPriceTier[] {
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) return [];
  return normalizeRentalPriceTiers((specs as Record<string, unknown>).rental_price_tiers);
}

export function getRentalDailyPrice(basePrice: number, tiers: RentalPriceTier[], days: number): number {
  return normalizeRentalPriceTiers(tiers).find((tier) => days >= tier.min_days)?.price_per_day ?? basePrice;
}

export function getRentalBaseTotal(basePrice: number, tiers: RentalPriceTier[], days: number): number {
  return getRentalDailyPrice(basePrice, tiers, days) * days;
}

export function formatTierLabel(tier: RentalPriceTier): string {
  return tier.min_days === 1 ? '1 ngày' : `Từ ${tier.min_days} ngày`;
}
