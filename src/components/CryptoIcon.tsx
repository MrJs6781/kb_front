import React from "react";
import Image from "next/image";
import { cryptoIconMap, fallbackIcon } from "@/lib/cryptoIcons";

interface CryptoIconProps {
  symbol: string; // نماد کامل ارز، مانند "BTCUSDT"
  width?: number;
  height?: number;
}

/**
 * این کامپوننت یک آیکون برای یک ارز دیجیتال نمایش می‌دهد.
 * اگر آیکون اختصاصی برای ارز وجود داشته باشد، آن را نمایش می‌دهد، در غیر این صورت از یک آیکون پیش‌فرض استفاده می‌کند.
 */
const CryptoIcon: React.FC<CryptoIconProps> = ({
  symbol,
  width = 32,
  height = 32,
}) => {
  // استخراج نام اصلی ارز از نماد کامل (مثلا 'BTC' از 'BTCUSDT')
  // این یک پیاده‌سازی ساده است، می‌توان آن را برای پشتیبانی از ارزهای دیگر مانند BUSD و ... کامل‌تر کرد.
  const baseCurrency = symbol.replace(/USDT$/, "");

  // پیدا کردن آیکون مربوطه از دیکشنری یا استفاده از آیکون پیش‌فرض
  const iconSrc = cryptoIconMap[baseCurrency] || fallbackIcon;

  return (
    <Image
      src={iconSrc}
      alt={`${symbol} icon`}
      width={width}
      height={height}
      className="rounded-full" // برای نمایش بهتر آیکون‌ها
    />
  );
};

export default CryptoIcon;
