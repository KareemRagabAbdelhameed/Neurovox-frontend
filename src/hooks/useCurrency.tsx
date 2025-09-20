import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { currencyService } from '../lib/currencyService';

export function useCurrency() {
  const { i18n } = useTranslation();
  const [currency, setCurrency] = useState(currencyService.getUserCurrency());
  const [symbol, setSymbol] = useState(currencyService.getCurrencySymbol());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update currency when language changes
    const handleLanguageChange = (lng: string) => {
      currencyService.setUserCurrency(lng);
      setCurrency(currencyService.getUserCurrency());
      setSymbol(currencyService.getCurrencySymbol());
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    // Initial fetch of exchange rates
    currencyService.fetchRates().catch(console.error);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const convertFromUSD = async (amount: number | string): Promise<number> => {
    setIsLoading(true);
    try {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      const converted = await currencyService.convertFromUSD(numAmount);
      return converted;
    } finally {
      setIsLoading(false);
    }
  };

  const convertToUSD = async (amount: number | string): Promise<number> => {
    setIsLoading(true);
    try {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      const converted = await currencyService.convertToUSD(numAmount);
      return converted;
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number | string, inLocalCurrency = true): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (inLocalCurrency && currency !== 'USD') {
      // Convert and format in local currency
      return currencyService.formatCurrency(numAmount, currency);
    }
    
    return currencyService.formatCurrency(numAmount, 'USD', 'en-US');
  };

  const formatLocalAmount = async (usdAmount: number | string): Promise<string> => {
    const numAmount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
    
    if (currency === 'USD') {
      return formatAmount(numAmount, false);
    }
    
    const localAmount = await convertFromUSD(numAmount);
    return currencyService.formatCurrency(localAmount, currency);
  };

  return {
    currency,
    symbol,
    isLoading,
    convertFromUSD,
    convertToUSD,
    formatAmount,
    formatLocalAmount,
    setCurrency: (code: string) => {
      const langCode = Object.entries(currencyService.getAllCurrencies()).find(
        ([_, config]) => config.code === code
      )?.[0] || 'en';
      
      currencyService.setUserCurrency(langCode);
      setCurrency(currencyService.getUserCurrency());
      setSymbol(currencyService.getCurrencySymbol());
    }
  };
}