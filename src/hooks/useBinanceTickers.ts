"use client";

import { useState, useEffect } from "react";

export interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

export const useBinanceTickers = (symbols: string[]) => {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length === 0) {
      setLoading(false);
      setTickers({});
      return;
    }

    const fetchTickers = async () => {
      try {
        const symbolsParam = JSON.stringify(symbols);
        // Using the 24hr Ticker API as it provides price change percentage
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`,
          { mode: "no-cors" }
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data: any[] = await response.json();

        const newTickers: Record<string, TickerData> = {};
        data.forEach((item) => {
          newTickers[item.symbol] = {
            symbol: item.symbol,
            lastPrice: parseFloat(item.lastPrice).toFixed(2),
            priceChangePercent: parseFloat(item.priceChangePercent).toFixed(2),
          };
        });

        setTickers(newTickers);
        setError(null);
      } catch (e: any) {
        setError(e.message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTickers(); // Initial fetch
    const interval = setInterval(fetchTickers, 3000); // Fetch every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [JSON.stringify(symbols)]); // Effect dependency on the stringified symbols array

  return { tickers, loading, error };
};
