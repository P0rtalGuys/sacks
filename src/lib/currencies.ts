export interface CurrencyOption {
  code: string
  label: string
  symbol: string
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'THB', label: 'Thai Baht', symbol: '฿' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
  { code: 'KRW', label: 'South Korean Won', symbol: '₩' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$' },
  { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'PHP', label: 'Philippine Peso', symbol: '₱' },
  { code: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'VND', label: 'Vietnamese Dong', symbol: '₫' },
  { code: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', label: 'Mexican Peso', symbol: 'MX$' },
  { code: 'CHF', label: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SEK', label: 'Swedish Krona', symbol: 'kr' },
  { code: 'NZD', label: 'New Zealand Dollar', symbol: 'NZ$' },
]
