import React from "react";
import Link from "next/link";

/**
 * کامپوننت هدر اصلی اپلیکیشن
 * این هدر به صورت ثابت در بالای صفحه باقی می‌ماند و با سایه از محتوا جدا می‌شود.
 */
const Header = () => {
  return (
    <header className="bg-white/80 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* لوگوی موقت برنامه */}
          <div className="w-8 h-8 bg-primary rounded-full" />
          <h1 className="text-xl font-bold text-foreground">صرافی کوالا</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
