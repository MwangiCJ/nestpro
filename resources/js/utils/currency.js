// Single place to change the app-wide currency symbol.
export const CURRENCY_SYMBOL = 'KES';

export function formatCurrency(n) {
    return `${CURRENCY_SYMBOL} ${Number(n ?? 0).toFixed(2)}`;
}
