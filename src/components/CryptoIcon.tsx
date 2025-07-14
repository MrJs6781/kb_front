import React from "react";
import Image from "next/image";
import { cryptoIconMap, fallbackIcon } from "@/lib/cryptoIcons";

interface CryptoIconProps {
  symbol: string;
  width?: number;
  height?: number;
}

const CryptoIcon: React.FC<CryptoIconProps> = ({
  symbol,
  width = 32,
  height = 32,
}) => {
  const baseCurrency = symbol.replace(/USDT$/, "");

  const iconSrc = cryptoIconMap[baseCurrency] || fallbackIcon;

  return (
    <Image
      src={iconSrc}
      alt={`${symbol} icon`}
      width={width}
      height={height}
      className="rounded-full"
    />
  );
};

export default CryptoIcon;
