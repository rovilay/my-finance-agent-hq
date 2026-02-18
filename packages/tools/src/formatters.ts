/**
 * Formatting utilities for financial and tax data
 */

/**
 * Format a number as Canadian currency (CAD)
 * @param amount - The numeric amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number as a percentage with 2 decimal places
 * @param value - The numeric value to format
 * @returns Formatted percentage string (e.g., "12.34%")
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
