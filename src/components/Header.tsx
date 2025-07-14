import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center space-x-2 space-x-reverse">
          {/* You can replace this with an actual SVG logo later */}
          <div className="w-8 h-8 bg-primary rounded-full" />
          <h1 className="text-xl font-bold text-slate-800">صرافی کوالا</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
