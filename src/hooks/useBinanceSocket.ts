"use client";

import { useState, useEffect, useRef } from "react";

export interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

// Type for the raw data from Binance WebSocket stream
interface BinanceSocketData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Close price (last price)
  P: string; // Price change percent
  // ... other fields are available but not used
}

export const useBinanceSocket = (symbols: string[]) => {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // If there are no symbols, close any existing connection and clear tickers
    if (symbols.length === 0) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setTickers({});
      return;
    }

    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    );

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.data) {
        const data: BinanceSocketData = message.data;
        setTickers((prevTickers) => ({
          ...prevTickers,
          [data.s]: {
            symbol: data.s,
            lastPrice: parseFloat(data.c).toFixed(2),
            priceChangePercent: parseFloat(data.P).toFixed(2),
          },
        }));
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsConnected(false);
    };

    socketRef.current = ws;

    // Cleanup function to close the socket when the component unmounts or symbols change
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [JSON.stringify(symbols)]); // Re-connect if the list of symbols changes

  return { tickers, isConnected };
};
