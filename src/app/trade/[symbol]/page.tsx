"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import React from "react";
import Link from "next/link";

const TradePage = () => {
  const router = useRouter();
  const params = useParams();
  const symbol = Array.isArray(params.symbol)
    ? params.symbol[0]
    : params.symbol;

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
                onClick={() => router.refresh()}
                className="px-4 py-2 text-sm font-semibold text-primary bg-blue-100 rounded-md hover:bg-blue-200 transition-colors w-full sm:w-auto"
              >
                به‌روزرسانی
              </button>
              <Link
                href="/"
                className="block text-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-hover transition-colors w-full sm:w-auto"
              >
                بازگشت
              </Link>
            </div>
          </div>

          {/* Trades Table */}
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
                {/* Placeholder Row */}
                <tr className="text-center">
                  <td className="p-4 text-sm text-slate-500" colSpan={3}>
                    در حال بارگذاری لیست معاملات...
                  </td>
                </tr>
                {/* Example of a filled row (for styling reference) */}
                {/* 
                <tr className='hover:bg-slate-50'>
                   <td className='p-3 text-sm text-slate-700 whitespace-nowrap'>1403/05/01 12:34:56</td>
                   <td className='p-3 text-sm text-success whitespace-nowrap'>65,123.45</td>
                   <td className='p-3 text-sm text-slate-700 whitespace-nowrap'>0.0012</td>
                </tr>
                 */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePage;
