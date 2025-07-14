import Header from "@/components/Header";
import WatchList from "@/components/WatchList";
import CurrencyList from "@/components/CurrencyList";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content: Currency List */}
          <div className="lg:col-span-2">
            <CurrencyList />
          </div>

          {/* Sidebar: Watchlist */}
          <div className="lg:col-span-1">
            <WatchList />
          </div>
        </div>
      </div>
    </div>
  );
}
