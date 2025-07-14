"use client";

import { useState, useEffect, useRef } from "react";

export interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

interface BinanceSocketData {
  s: string; // Symbol
  c: string; // Close price
  P: string; // Price change percent
}

const WEBSOCKET_URL = "wss://stream.binance.com:443/ws";
let subscriptionIdCounter = 1;

export const useBinanceSocket = (symbols: string[]) => {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  // Effect for Connection Management: Runs ONLY ONCE on mount/unmount.
  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    socketRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = (error) => console.error("WebSocket Error:", error);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message && message.s) {
        const data: BinanceSocketData = message;
        setTickers((prev) => ({
          ...prev,
          [data.s]: {
            symbol: data.s,
            lastPrice: parseFloat(data.c).toFixed(2),
            priceChangePercent: parseFloat(data.P).toFixed(2),
          },
        }));
      }
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []); // <-- Empty dependency array is CRITICAL for a single, stable connection.

  // Effect for Subscription Management: Runs whenever symbols or connection status change.
  useEffect(() => {
    const ws = socketRef.current;
    if (!ws || !isConnected) return;

    // Logic to subscribe to new symbols and unsubscribe from old ones
    const subscribedSymbols = new Set(Object.keys(tickers));
    const newSymbols = symbols.filter((s) => !subscribedSymbols.has(s));
    const oldSymbols = [...subscribedSymbols].filter(
      (s) => !symbols.includes(s)
    );

    if (newSymbols.length > 0) {
      const params = newSymbols.map((s) => `${s.toLowerCase()}@ticker`);
      ws.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params,
          id: subscriptionIdCounter++,
        })
      );
    }

    if (oldSymbols.length > 0) {
      const params = oldSymbols.map((s) => `${s.toLowerCase()}@ticker`);
      ws.send(
        JSON.stringify({
          method: "UNSUBSCRIBE",
          params,
          id: subscriptionIdCounter++,
        })
      );

      // Also remove from the displayed tickers immediately
      setTickers((prev) => {
        const newState = { ...prev };
        oldSymbols.forEach((s) => delete newState[s]);
        return newState;
      });
    }
  }, [symbols, isConnected, tickers]);

  return { tickers, isConnected };
};
