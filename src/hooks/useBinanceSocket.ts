"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
  const subscribedSymbolsRef = useRef<Set<string>>(new Set());

  const manageSubscriptions = useCallback(
    (
      ws: WebSocket,
      symbolsToManage: string[],
      method: "SUBSCRIBE" | "UNSUBSCRIBE"
    ) => {
      if (symbolsToManage.length === 0) return;

      const params = symbolsToManage.map((s) => `${s.toLowerCase()}@ticker`);
      ws.send(JSON.stringify({ method, params, id: subscriptionIdCounter++ }));

      symbolsToManage.forEach((s) => {
        if (method === "SUBSCRIBE") {
          subscribedSymbolsRef.current.add(s);
        } else {
          subscribedSymbolsRef.current.delete(s);
          // Also remove from the displayed tickers
          setTickers((prev) => {
            const newState = { ...prev };
            delete newState[s];
            return newState;
          });
        }
      });
    },
    []
  );

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Subscribe to initial symbols
      const newSymbols = symbols.filter(
        (s) => !subscribedSymbolsRef.current.has(s)
      );
      manageSubscriptions(ws, newSymbols, "SUBSCRIBE");
    };

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

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => setIsConnected(false);

    // This is the cleanup function that runs when the component unmounts.
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once.

  useEffect(() => {
    const ws = socketRef.current;
    if (!ws || !isConnected) return;

    const currentSymbolsSet = new Set(symbols);
    const toUnsubscribe = [...subscribedSymbolsRef.current].filter(
      (s) => !currentSymbolsSet.has(s)
    );
    const toSubscribe = [...currentSymbolsSet].filter(
      (s) => !subscribedSymbolsRef.current.has(s)
    );

    manageSubscriptions(ws, toUnsubscribe, "UNSUBSCRIBE");
    manageSubscriptions(ws, toSubscribe, "SUBSCRIBE");
  }, [symbols, isConnected, manageSubscriptions]);

  return { tickers, isConnected };
};
