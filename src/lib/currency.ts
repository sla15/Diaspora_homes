import { CURRENCIES, CurrencyCode } from '../types';

export const formatPrice = (price: number, currencyCode: CurrencyCode) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  
  // If the original price is in GMD (which is our base in the data), we convert it
  // For this demo, we assume all prices in PROPERTIES are in GMD
  const convertedPrice = price * currency.rate;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code === 'GMD' ? 'USD' : currency.code, // Intl doesn't support GMD symbol well sometimes, but let's try
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedPrice).replace('USD', 'D').replace('XOF', 'CFA'); // Custom replacements for symbols if needed
};

// A more robust version that handles GMD specifically
export const displayPrice = (price: number, targetCurrencyCode: CurrencyCode) => {
  const targetCurrency = CURRENCIES.find(c => c.code === targetCurrencyCode) || CURRENCIES[0];
  const convertedPrice = price * targetCurrency.rate;
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedPrice);
  
  return `${targetCurrency.symbol} ${formatted}`;
};
