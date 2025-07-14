import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white/80 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full" />
          <h1 className="text-xl font-bold text-foreground">صرافی کوالا</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
