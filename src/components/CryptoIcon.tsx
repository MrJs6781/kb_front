'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CryptoIconProps {
  symbol: string;
  width: number;
  height: number;
  className?: string;
}

const getIconSymbol = (pair: string) => {
    return pair.replace(/USDT$/, '').toLowerCase();
}

const CryptoIcon: React.FC<CryptoIconProps> = ({ symbol, ...props }) => {
  const iconSymbol = getIconSymbol(symbol);
  
  // Using a more reliable CDN
  const initialSrc = `https://cryptoicons.co/svg/color/${iconSymbol}.svg`;
  
  // A simple, generic placeholder SVG used as a fallback
  const fallbackSrc = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2UyZThmMCIgLz48dGV4dCB4PSI1MCIgeT0iNjgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRhM2I4Ij4/PC90ZXh0Pjwvc3ZnPg==`;

  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <Image
      src={imgSrc}
      alt={`${symbol} icon`}
      unoptimized
      onError={() => {
        if(imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
};

export default CryptoIcon; 