import { PropertyData } from "@/types/property";

export function mapProperty(row: any): PropertyData {
  return {
    ...row,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    newListing: row.new_listing,
    salePrice: row.sale_price,
    rentPrice: row.rent_price,
    saleCurrency: row.sale_currency,
    rentCurrency: row.rent_currency,
    rentPeriod: row.rent_period as "daily" | "weekly" | "monthly" | "yearly" | "custom" | undefined,
    rentPeriodLabel: row.rent_period_label,
  };
}