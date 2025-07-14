"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import CryptoIcon from "./CryptoIcon";
import { FiCheckCircle } from "react-icons/fi"; // آیکون برای نشان دادن اضافه شدن

const ALL_CURRENCIES = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "SOLUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "MATICUSDT",
  "DOTUSDT",
  "AVAXUSDT",
  "SHIBUSDT",
  "LINKUSDT",
  "UNIUSDT",
];

const CurrencyList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToWatchlist, isSymbolInWatchlist } = useWatchlist();

  const filteredCurrencies = ALL_CURRENCIES.filter((currency) =>
    currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-foreground">لیست ارزها</h2>
      <div className="mb-6 sticky top-[70px] z-40 py-2 bg-white/80 backdrop-blur-sm">
        <input
          type="text"
          placeholder="جستجوی نام ارز..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-surface rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* استفاده از گرید برای نمایش کارتی */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        {filteredCurrencies.length > 0 ? (
          filteredCurrencies.map((currency) => {
            const isInWatchlist = isSymbolInWatchlist(currency);
            return (
              <div
                key={currency}
                className="relative bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col p-4"
              >
                {/* نشانگر اضافه شدن به واچ‌لیست */}
                {isInWatchlist && (
                  <div className="absolute top-3 right-3 text-success">
                    <FiCheckCircle size={20} />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <CryptoIcon symbol={currency} width={40} height={40} />
                  <span className="font-bold text-lg text-foreground">
                    {currency}
                  </span>
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => addToWatchlist(currency)}
                    disabled={isInWatchlist}
                    className={`w-full btn text-xs ${
                      isInWatchlist
                        ? "bg-emerald-50 text-success cursor-default"
                        : "btn-primary"
                    }`}
                  >
                    {isInWatchlist ? "اضافه شد" : "افزودن به واچ‌لیست"}
                  </button>
                  <Link
                    href={`/trade/${currency.toLowerCase()}`}
                    className="w-full btn bg-slate-200 text-slate-800 hover:bg-slate-300 text-sm"
                  >
                    مشاهده تریدها
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 bg-surface rounded-lg shadow-sm">
            <p className="text-muted-foreground">
              ارزی با این مشخصات یافت نشد.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CurrencyList;
