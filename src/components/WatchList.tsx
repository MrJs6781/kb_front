"use client";

import React, { useEffect, useRef } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import { useBinanceSocket } from "@/hooks/useBinanceSocket";
import { FiTrash2 } from "react-icons/fi";
import CryptoIcon from "./CryptoIcon";

const WatchList = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { tickers, isConnected } = useBinanceSocket(watchlist);

  const prevTickersRef = useRef<typeof tickers>({});
  useEffect(() => {
    prevTickersRef.current = tickers;
  }, [tickers]);

  const getPriceChangeDirection = (symbol: string) => {
    const prevPrice = prevTickersRef.current[symbol]?.lastPrice;
    const currentPrice = tickers[symbol]?.lastPrice;
    if (!prevPrice || !currentPrice) return "unchanged";
    if (currentPrice > prevPrice) return "up";
    if (currentPrice < prevPrice) return "down";
    return "unchanged";
  };

  return (
    <section className="bg-surface p-4 rounded-lg shadow-sm sticky top-[70px]">
      {/* هدر واچ‌لیست */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">واچ لیست</h2>
        {/* نمایش وضعیت اتصال */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold ${
              isConnected ? "text-success" : "text-danger"
            }`}
          >
            {isConnected ? "متصل" : "قطع"}
          </span>
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-success" : "bg-danger"
            }`}
          />
        </div>
      </div>

      {watchlist.length > 0 ? (
        <div className="space-y-3 max-h-[calc(100vh-150px)] overflow-y-auto">
          {watchlist.map((symbol) => {
            const data = tickers[symbol];
            const changeDirection = getPriceChangeDirection(symbol);

            const priceColorClass =
              changeDirection === "up"
                ? "text-success"
                : changeDirection === "down"
                ? "text-danger"
                : "text-foreground";

            const changeColorClass =
              data && parseFloat(data.priceChangePercent) >= 0
                ? "text-success"
                : "text-danger";

            return (
              <div
                key={symbol}
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CryptoIcon symbol={symbol} width={28} height={28} />
                  <span className="font-semibold text-foreground text-sm">
                    {symbol}
                  </span>
                </div>
                {data ? (
                  <div className="text-left font-mono" dir="ltr">
                    <p
                      className={`font-semibold transition-colors duration-200 ${priceColorClass}`}
                    >
                      ${data.lastPrice}
                    </p>
                    <p className={`text-xs ${changeColorClass}`}>
                      {data.priceChangePercent}%
                    </p>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm animate-pulse">
                    ...
                  </div>
                )}
                <button
                  onClick={() => removeFromWatchlist(symbol)}
                  className="text-muted-foreground hover:text-danger p-2 rounded-full transition-colors"
                  aria-label={`حذف ${symbol} از واچ‌لیست`}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        // حالتی که واچ‌لیست خالی است
        <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg">
          <div className="text-center">
            <h3 className="text-foreground font-semibold">
              واچ لیست شما خالی است
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              ارزهای مورد علاقه خود را اضافه کنید.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default WatchList;
