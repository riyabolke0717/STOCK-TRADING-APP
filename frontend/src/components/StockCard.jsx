import { Link } from "react-router-dom";

export default function StockCard({ stock, onToggleWatchlist, isInWatchlist }) {
  const isPositive = stock.change >= 0;

  return (
    <div className="group bg-white hover:bg-[#f8f8f9]/50 transition-all duration-500 relative font-inter">
      <Link to={`/stock/${stock.symbol}`} className="flex items-center justify-between px-10 py-7 cursor-pointer">
        {/* Left: Company Info */}
        <div className="flex items-center min-w-[300px]">
          <div className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center mr-6 bg-white shadow-sm shrink-0 group-hover:border-primary/30 transition-all group-hover:scale-110 duration-500">
            <span className="font-black text-[13px] text-text-dark group-hover:text-primary">{stock.symbol.substring(0, 2)}</span>
          </div>
          <div className="truncate pr-6">
            <h3 className="font-black text-text-dark truncate text-lg tracking-tight group-hover:text-primary transition-colors">{stock.name}</h3>
            <p className="text-[10px] font-black text-text-light uppercase tracking-[0.15em] mt-1.5">{stock.symbol} • NIFTY 50</p>
          </div>
        </div>

        {/* Center: Fake Sparkline (Refined) */}
        <div className="hidden lg:flex flex-1 justify-center items-center px-10">
          <div className="w-40 h-10 flex items-end justify-between space-x-[4px] opacity-10 group-hover:opacity-40 transition-all duration-700">
            {[4, 12, 8, 15, 10, 22, 18, 28, 24, 32, 28, 40].map((h, i) => (
              <div key={i} className={`w-[2px] rounded-full ${isPositive ? 'bg-primary' : 'bg-danger'}`} style={{ height: `${(isPositive ? h : 44 - h)}px` }}></div>
            ))}
          </div>
        </div>

        {/* Right: Price Info */}
        <div className="text-right min-w-[160px]">
          <p className="font-black text-text-dark text-xl tabular-nums tracking-tighter">₹{stock.price.toLocaleString('en-IN')}</p>
          <div className={`text-sm flex items-center justify-end font-black mt-1.5 tabular-nums ${isPositive ? "text-primary" : "text-danger"}`}>
            {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
      </Link>

      {/* Watchlist Quick Action (Refined) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[190px] lg:right-[220px] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWatchlist(stock);
          }}
          className={`p-3 rounded-2xl transition-all border border-gray-100 shadow-sm ${isInWatchlist ? 'bg-primary/5 border-primary/20' : 'bg-white hover:bg-gray-50'}`}
          title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <svg className={`w-5 h-5 ${isInWatchlist ? 'text-primary fill-current' : 'text-text-light hover:text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
