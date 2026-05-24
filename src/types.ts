export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  country: string;
  rateToIdr: number; // For interactive visual calculation rate
}

export const FAMOUS_CURRENCIES: Currency[] = [
  { code: 'IDR', symbol: 'Rp', name: 'Rupiah', flag: '🇮🇩', country: 'Indonesia', rateToIdr: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', country: 'United States', rateToIdr: 16250 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', country: 'Eurozone', rateToIdr: 17620 },
  { code: 'GBP', symbol: '£', name: 'Pound Sterling', flag: '🇬🇧', country: 'United Kingdom', rateToIdr: 20680 },
  { code: 'JPY', symbol: '¥', name: 'Yen', flag: '🇯🇵', country: 'Japan', rateToIdr: 104.5 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', country: 'Australia', rateToIdr: 10810 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', country: 'Singapore', rateToIdr: 12080 },
];
