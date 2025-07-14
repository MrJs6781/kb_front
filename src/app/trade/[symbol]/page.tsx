"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiRefreshCw } from "react-icons/fi";

interface Trade {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
}

const TradePage = () => {
  const params = useParams();
  const symbol = Array.isArray(params.symbol)
    ? params.symbol[0]
    : params.symbol;

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/trades?symbol=${symbol}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch trades");
      }
      const data: Trade[] = await response.json();
      setTrades(data.reverse()); // Show latest trades first
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800">
              آخرین معاملات{" "}
              <span className="text-primary">{symbol?.toUpperCase()}</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={fetchTrades}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-primary bg-blue-100 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                {loading ? "در حال بروزرسانی..." : "به‌روزرسانی"}
              </button>
              <Link
                href="/"
                className="block text-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-hover transition-colors w-full sm:w-auto"
              >
                بازگشت
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-right align-middle">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-sm font-semibold tracking-wide text-slate-600">
                    زمان
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-slate-600">
                    قیمت (USDT)
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-slate-600">
                    مقدار
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td className="p-4 text-center text-slate-500" colSpan={3}>
                      در حال بارگذاری...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td className="p-4 text-center text-danger" colSpan={3}>
                      خطا: {error}
                    </td>
                  </tr>
                )}
                {!loading &&
                  trades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-slate-50">
                      <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                        {new Date(trade.time).toLocaleTimeString("fa-IR")}
                      </td>
                      <td
                        className={`p-3 text-sm font-mono whitespace-nowrap ${
                          trade.isBuyerMaker ? "text-danger" : "text-success"
                        }`}
                      >
                        {parseFloat(trade.price).toFixed(2)}
                      </td>
                      <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                        {parseFloat(trade.qty).toFixed(5)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePage;
