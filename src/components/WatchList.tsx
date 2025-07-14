"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import { useBinanceTickers } from "@/hooks/useBinanceTickers";
import { FiTrash2 } from "react-icons/fi";

const WatchList = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { tickers, loading, error } = useBinanceTickers(watchlist);

  // State to track price changes for visual feedback
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
    <section className="bg-white p-4 rounded-lg shadow-sm sticky top-[80px]">
      <h2 className="text-xl font-bold mb-4 text-slate-800">واچ لیست</h2>

      {loading && watchlist.length > 0 && (
        <p className="text-slate-500 text-center">در حال بارگذاری قیمت‌ها...</p>
      )}
      {error && (
        <p className="text-danger text-center">
          خطا در دریافت اطلاعات: {error}
        </p>
      )}

      {!loading && watchlist.length > 0 ? (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {watchlist.map((symbol) => {
            const data = tickers[symbol];
            const changeDirection = getPriceChangeDirection(symbol);
            const priceColorClass =
              changeDirection === "up"
                ? "text-success"
                : changeDirection === "down"
                ? "text-danger"
                : "text-slate-700";

            const changeColorClass =
              data && parseFloat(data.priceChangePercent) >= 0
                ? "text-success"
                : "text-danger";

            return (
              <div
                key={symbol}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-bold text-slate-700">{symbol}</span>
                </div>
                {data ? (
                  <div className="flex-1 text-center" dir="ltr">
                    <p
                      className={`font-mono font-semibold transition-colors duration-300 ${priceColorClass}`}
                    >
                      ${data.lastPrice}
                    </p>
                    <p className={`text-sm font-mono ${changeColorClass}`}>
                      {data.priceChangePercent}%
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 text-center text-slate-400 text-sm">
                    Loading...
                  </div>
                )}
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => removeFromWatchlist(symbol)}
                    className="text-slate-500 hover:text-danger p-2 rounded-full transition-colors"
                    aria-label={`Remove ${symbol} from watchlist`}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg">
            <div className="text-center">
              <h3 className="text-slate-700 font-semibold">
                واچ لیست شما خالی است
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                ارزهای مورد علاقه خود را اضافه کنید.
              </p>
            </div>
          </div>
        )
      )}
    </section>
  );
};

export default WatchList;
