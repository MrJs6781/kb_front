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

const WEBSOCKET_URL = "wss://stream.binance.com:9443/ws";
let subscriptionIdCounter = 1;

export const useBinanceSocket = (symbols: string[]) => {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const subscribedSymbolsRef = useRef<Set<string>>(new Set());
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateSubscriptions = useCallback((currentSymbols: string[]) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const currentSymbolsSet = new Set(currentSymbols);
    const toUnsubscribe = [...subscribedSymbolsRef.current].filter(
      (s) => !currentSymbolsSet.has(s)
    );
    const toSubscribe = [...currentSymbolsSet].filter(
      (s) => !subscribedSymbolsRef.current.has(s)
    );

    if (toUnsubscribe.length > 0) {
      const params = toUnsubscribe.map((s) => `${s.toLowerCase()}@ticker`);
      ws.send(
        JSON.stringify({
          method: "UNSUBSCRIBE",
          params,
          id: subscriptionIdCounter++,
        })
      );
      toUnsubscribe.forEach((s) => subscribedSymbolsRef.current.delete(s));
    }

    if (toSubscribe.length > 0) {
      const params = toSubscribe.map((s) => `${s.toLowerCase()}@ticker`);
      ws.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params,
          id: subscriptionIdCounter++,
        })
      );
      toSubscribe.forEach((s) => subscribedSymbolsRef.current.add(s));
    }
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current) {
      // A connection is already open or being established
      return;
    }

    const ws = new WebSocket(WEBSOCKET_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // After connecting, subscribe to the current symbols
      updateSubscriptions(symbols);
      // Start sending pongs to keep connection alive
      if (heartbeatIntervalRef.current)
        clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ method: "PONG" }));
        }
      }, 60 * 1000); // Send a pong every minute
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Ticker data from stream has a 's' property (symbol)
      if (message && message.s) {
        const data: BinanceSocketData = message;
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

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      subscribedSymbolsRef.current.clear();
      // Cleanup interval on close
      if (heartbeatIntervalRef.current)
        clearInterval(heartbeatIntervalRef.current);
      // Optional: implement reconnection logic here
      console.log("WebSocket disconnected. Attempting to reconnect...");
      socketRef.current = null; // Clear the ref to allow reconnection
      setTimeout(connect, 5000); // Reconnect after 5 seconds
    };
  }, [symbols, updateSubscriptions]);

  useEffect(() => {
    connect();

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        // We close the socket on unmount, not on symbol change
        socketRef.current.onclose = null; // Prevent reconnection logic from firing on unmount
        socketRef.current.close();
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [connect]);

  // Effect to handle subscription updates when symbols change
  useEffect(() => {
    updateSubscriptions(symbols)
  }, [symbols, updateSubscriptions])

  return { tickers, isConnected };
};
