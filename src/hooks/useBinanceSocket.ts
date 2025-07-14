"use client";

import { useState, useEffect } from "react";

export interface TickerData {
  lastPrice: string;
  priceChangePercent: string;
}

let socket: WebSocket | null = null;
let lastTickers: Record<string, TickerData> = {};
let isConnectedGlobal = false;
const listeners = new Set<
  (tickers: Record<string, TickerData>, isConnected: boolean) => void
>();
let currentSubscriptions = new Set<string>();

const WEBSOCKET_URL = "wss://stream.binance.com:443/ws";

const connectSocket = () => {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = () => {
    isConnectedGlobal = true;
    if (currentSubscriptions.size > 0) {
      const params = Array.from(currentSubscriptions).map(
        (s) => `${s.toLowerCase()}@ticker`
      );
      socket?.send(JSON.stringify({ method: "SUBSCRIBE", params, id: 1 }));
    }
    listeners.forEach((listener) => listener(lastTickers, isConnectedGlobal));
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.e === "24hrTicker") {
      lastTickers = {
        ...lastTickers,
        [message.s]: {
          lastPrice: parseFloat(message.c).toFixed(2),
          priceChangePercent: parseFloat(message.P).toFixed(2),
        },
      };
      listeners.forEach((listener) => listener(lastTickers, isConnectedGlobal));
    }
  };

  socket.onclose = () => {
    isConnectedGlobal = false;
    listeners.forEach((listener) => listener(lastTickers, isConnectedGlobal));
    socket = null;
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
    isConnectedGlobal = false;
    listeners.forEach((listener) => listener(lastTickers, isConnectedGlobal));
    socket?.close();
  };
};

const manageSubscriptions = (symbols: string[]) => {
  const newSymbols = new Set(symbols);

  const symbolsToUnsubscribe = [...currentSubscriptions].filter(
    (s) => !newSymbols.has(s)
  );
  const symbolsToSubscribe = [...newSymbols].filter(
    (s) => !currentSubscriptions.has(s)
  );

  if (socket?.readyState === WebSocket.OPEN) {
    if (symbolsToUnsubscribe.length > 0) {
      const params = symbolsToUnsubscribe.map(
        (s) => `${s.toLowerCase()}@ticker`
      );
      socket.send(JSON.stringify({ method: "UNSUBSCRIBE", params, id: 2 }));
      symbolsToUnsubscribe.forEach((s) => delete lastTickers[s]);
    }
    if (symbolsToSubscribe.length > 0) {
      const params = symbolsToSubscribe.map((s) => `${s.toLowerCase()}@ticker`);
      socket.send(JSON.stringify({ method: "SUBSCRIBE", params, id: 1 }));
    }
  }

  currentSubscriptions = newSymbols;
};

export const useBinanceSocket = (watchlist: string[]) => {
  const [tickers, setTickers] =
    useState<Record<string, TickerData>>(lastTickers);
  const [isConnected, setIsConnected] = useState<boolean>(isConnectedGlobal);

  useEffect(() => {
    const componentListener = (
      newTickers: Record<string, TickerData>,
      newConnectionState: boolean
    ) => {
      setTickers(() => ({ ...newTickers }));
      setIsConnected(newConnectionState);
    };

    listeners.add(componentListener);
    connectSocket();

    return () => {
      listeners.delete(componentListener);
    };
  }, []);

  useEffect(() => {
    manageSubscriptions(watchlist);
  }, [watchlist]);

  return { tickers, isConnected };
};
