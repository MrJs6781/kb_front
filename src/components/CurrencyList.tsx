"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import CryptoIcon from "./CryptoIcon"; // Using the new robust component

// A predefined list of popular currency pairs
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
  "UNIUSDT", // Added more coins
];

const CurrencyList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToWatchlist, isSymbolInWatchlist } = useWatchlist();

  const filteredCurrencies = ALL_CURRENCIES.filter((currency) =>
    currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="p-1">
      <h2 className="text-xl font-bold mb-4 text-slate-800">لیست ارزها</h2>
      <div className="mb-4 sticky top-[80px] z-40">
        <input
          type="text"
          placeholder="جستجوی نام ارز..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="space-y-2">
        {filteredCurrencies.length > 0 ? (
          filteredCurrencies.map((currency) => {
            const isInWatchlist = isSymbolInWatchlist(currency);
            return (
              <div
                key={currency}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <CryptoIcon symbol={currency} width={28} height={28} />
                  <span className="font-bold text-slate-700">{currency}</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse gap-3">
                  <button
                    onClick={() => addToWatchlist(currency)}
                    disabled={isInWatchlist}
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-hover transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {isInWatchlist ? "اضافه شد" : "افزودن"}
                  </button>
                  <Link href={`/trade/${currency.toLowerCase()}`}>
                    <p className="block px-4 py-2 text-sm font-semibold text-primary bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                      مشاهده تریدها
                    </p>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-slate-500 py-10 bg-white rounded-lg shadow-sm">
            <p>ارزی با این مشخصات یافت نشد.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CurrencyList;
