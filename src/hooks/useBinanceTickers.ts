"use client";

import { useState, useEffect, useMemo } from "react";

export interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

// A more specific type for the raw data from Binance API
interface BinanceRawTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  // We don't need other properties, so no index signature is required.
}

export const useBinanceTickers = (symbols: string[]) => {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the stringified symbols to prevent re-renders
  const symbolsString = useMemo(() => JSON.stringify(symbols), [symbols]);

  useEffect(() => {
    if (symbols.length === 0) {
      setLoading(false);
      setTickers({});
      return;
    }

    const fetchTickers = async () => {
      try {
        const symbolsParam = symbolsString;
        // Using the 24hr Ticker API as it provides price change percentage
        // Removed { mode: "no-cors" } as it makes the response body opaque
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data: BinanceRawTicker[] = await response.json();

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
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
          console.error(e);
        } else {
          setError("An unknown error occurred");
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickers(); // Initial fetch
    const interval = setInterval(fetchTickers, 3000); // Fetch every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [symbolsString, symbols.length]); // Use the memoized string and length as dependency

  return { tickers, loading, error };
};
