// Currency conversion service with real exchange rates
// import { i18n } from 'i18next';

export interface CurrencyRates {
  USD: number;
  EUR: number;
  GBP: number;
  JPY: number;
  CNY: number;
  INR: number;
  KRW: number;
  BRL: number;
  RUB: number;
  AED: number;
  SAR: number;
  EGP: number;
  NGN: number;
  ZAR: number;
  CAD: number;
  AUD: number;
  MXN: number;
  ARS: number;
  TRY: number;
  IDR: number;
}

interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

// Currency configurations mapped to languages
export const currencyConfigs: Record<string, CurrencyConfig> = {
  en: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', decimals: 2 },
  es: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'es-ES', decimals: 2 },
  zh: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', decimals: 2 },
  fr: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'fr-FR', decimals: 2 },
  de: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', decimals: 2 },
  ja: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', decimals: 0 },
  ar: { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', locale: 'ar-SA', decimals: 2 },
  ru: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU', decimals: 2 },
  pt: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', decimals: 2 },
  ko: { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR', decimals: 0 },
};

class CurrencyService {
  private rates: CurrencyRates | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds
  private userCurrency: string = 'USD';
  private userLocale: string = 'en-US';

  constructor() {
    // Initialize from localStorage or default
    const savedCurrency = localStorage.getItem('userCurrency');
    const savedLocale = localStorage.getItem('userLocale');
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    
    if (savedCurrency && savedLocale) {
      this.userCurrency = savedCurrency;
      this.userLocale = savedLocale;
    } else {
      const config = currencyConfigs[currentLang] || currencyConfigs.en;
      this.userCurrency = config.code;
      this.userLocale = config.locale;
    }
  }

  async fetchRates(): Promise<CurrencyRates> {
    const now = Date.now();
    
    // Return cached rates if still valid
    if (this.rates && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.rates;
    }

    try {
      // Use exchangerate-api for real-time rates
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
      const data = await response.json();
      
      this.rates = {
        USD: 1,
        EUR: data.rates.EUR || 0.92,
        GBP: data.rates.GBP || 0.79,
        JPY: data.rates.JPY || 149.50,
        CNY: data.rates.CNY || 7.24,
        INR: data.rates.INR || 83.12,
        KRW: data.rates.KRW || 1298.50,
        BRL: data.rates.BRL || 4.89,
        RUB: data.rates.RUB || 89.50,
        AED: data.rates.AED || 3.67,
        SAR: data.rates.SAR || 3.75,
        EGP: data.rates.EGP || 30.90,
        NGN: data.rates.NGN || 790.50,
        ZAR: data.rates.ZAR || 18.43,
        CAD: data.rates.CAD || 1.36,
        AUD: data.rates.AUD || 1.52,
        MXN: data.rates.MXN || 16.90,
        ARS: data.rates.ARS || 818.50,
        TRY: data.rates.TRY || 28.92,
        IDR: data.rates.IDR || 15650,
      };
      
      this.lastFetch = now;
      localStorage.setItem('currencyRates', JSON.stringify(this.rates));
      localStorage.setItem('currencyRatesTimestamp', now.toString());
      
      return this.rates!;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      
      // Try to load from localStorage
      const cachedRates = localStorage.getItem('currencyRates');
      if (cachedRates) {
        this.rates = JSON.parse(cachedRates);
        return this.rates!;
      }
      
      // Fallback to default rates
      return this.getDefaultRates();
    }
  }

  private getDefaultRates(): CurrencyRates {
    return {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.50,
      CNY: 7.24,
      INR: 83.12,
      KRW: 1298.50,
      BRL: 4.89,
      RUB: 89.50,
      AED: 3.67,
      SAR: 3.75,
      EGP: 30.90,
      NGN: 790.50,
      ZAR: 18.43,
      CAD: 1.36,
      AUD: 1.52,
      MXN: 16.90,
      ARS: 818.50,
      TRY: 28.92,
      IDR: 15650,
    };
  }

  async convertFromUSD(amount: number, toCurrency: string = this.userCurrency): Promise<number> {
    const rates = await this.fetchRates();
    const rate = rates[toCurrency as keyof CurrencyRates] || 1;
    return amount * rate;
  }

  async convertToUSD(amount: number, fromCurrency: string = this.userCurrency): Promise<number> {
    const rates = await this.fetchRates();
    const rate = rates[fromCurrency as keyof CurrencyRates] || 1;
    return amount / rate;
  }

  formatCurrency(amount: number, currency?: string, locale?: string): string {
    const currencyCode = currency || this.userCurrency;
    const localeCode = locale || this.userLocale;
    
    const config = Object.values(currencyConfigs).find(c => c.code === currencyCode) || currencyConfigs.en;
    
    try {
      return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
      }).format(amount);
    } catch {
      // Fallback formatting
      return `${config.symbol}${amount.toFixed(config.decimals)}`;
    }
  }

  setUserCurrency(languageCode: string) {
    const config = currencyConfigs[languageCode] || currencyConfigs.en;
    this.userCurrency = config.code;
    this.userLocale = config.locale;
    
    localStorage.setItem('userCurrency', this.userCurrency);
    localStorage.setItem('userLocale', this.userLocale);
  }

  getUserCurrency(): string {
    return this.userCurrency;
  }

  getUserLocale(): string {
    return this.userLocale;
  }

  getCurrencySymbol(): string {
    const config = Object.values(currencyConfigs).find(c => c.code === this.userCurrency);
    return config?.symbol || '$';
  }

  getAllCurrencies(): CurrencyConfig[] {
    return Object.values(currencyConfigs);
  }
}

export const currencyService = new CurrencyService();