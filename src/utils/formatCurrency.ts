/**
 * Format currency values with Vietnamese Dong (VND) formatting
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Format currency values with custom currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: VND)
 * @param locale - Locale code (default: vi-VN)
 * @returns Formatted currency string
 */
export const formatCurrencyWithLocale = (
  amount: number,
  currency: string = "VND",
  locale: string = "vi-VN"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Format number with thousands separator
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};
