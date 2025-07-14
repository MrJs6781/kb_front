"use client";

import React, { useEffect, useRef } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import { useBinanceSocket } from "@/hooks/useBinanceSocket"; // Replaced with the new hook
import { FiTrash2 } from "react-icons/fi";
import Image from "next/image";

const getIconSymbol = (pair: string) => {
  return pair.replace(/USDT$/, "").toLowerCase();
};

const WatchList = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { tickers, isConnected } = useBinanceSocket(watchlist); // Using the new hook

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">واچ لیست</h2>
        <div className="flex items-center space-x-2 space-x-reverse">
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
            const iconSymbol = getIconSymbol(symbol);

            return (
              <div
                key={symbol}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex-1 flex items-center gap-3">
                  <Image
                    src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@main/svg/color/${iconSymbol}.svg`}
                    alt={`${symbol} icon`}
                    width={24}
                    height={24}
                    unoptimized
                  />
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
                  <div className="flex-1 text-center text-slate-400 text-sm animate-pulse">
                    در حال اتصال...
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
      )}
    </section>
  );
};

export default WatchList;
