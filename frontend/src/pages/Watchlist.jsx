import { useState, useEffect } from "react";
import { getStockBySymbol } from "../services/stockService";
import StockCard from "../components/StockCard";
import { Link } from "react-router-dom";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      const symbols = JSON.parse(savedWatchlist);
      setWatchlist(symbols);
      fetchWatchlistStocks(symbols);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWatchlistStocks = async (symbols) => {
    if (symbols.length === 0) {
      setStocks([]);
      setLoading(false);
      return;
    }
    try {
      const stockPromises = symbols.map(symbol => getStockBySymbol(symbol));
      const stockData = await Promise.all(stockPromises);
      setStocks(stockData);
    } catch (error) {
      console.error("Error fetching watchlist stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (stock) => {
    const newWatchlist = watchlist.filter(s => s !== stock.symbol);
    setWatchlist(newWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
    setStocks(stocks.filter(s => s.symbol !== stock.symbol));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalValue = stocks.reduce((sum, stock) => sum + stock.price, 0);
  const totalChange = stocks.reduce((sum, stock) => sum + stock.change, 0);

  return (
    <div className="min-h-screen bg-[#f8f8f9] pb-20 font-inter">
      <div className="container mx-auto px-4 lg:px-12 max-w-7xl pt-12">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-text-dark tracking-tight">Watchlist</h1>
            <p className="text-text-light font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">
              {stocks.length} Assets tracking
            </p>
          </div>

          {stocks.length > 0 && (
            <div className="bg-white px-8 py-5 rounded-[28px] shadow-sm border border-gray-100 flex items-center space-x-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-text-light uppercase tracking-widest text-center">Summary Value</p>
                <p className="text-xl font-black text-text-dark text-center">₹{totalValue.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-[1px] h-10 bg-gray-100"></div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-text-light uppercase tracking-widest text-center">Today's P&L</p>
                <p className={`text-xl font-black text-center ${totalChange >= 0 ? 'text-primary' : 'text-danger'}`}>
                  {totalChange >= 0 ? "+" : "-"}₹{Math.abs(totalChange).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </div>

        {stocks.length > 0 ? (
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="hidden md:flex items-center px-8 py-5 bg-gray-50/30 border-b border-gray-100">
              <span className="w-1/3 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Company / Symbol</span>
              <span className="flex-1 text-center text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Live Trend</span>
              <span className="w-1/3 text-right text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Current Price</span>
            </div>
            <div className="divide-y divide-gray-50">
              {stocks.map(stock => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onToggleWatchlist={toggleWatchlist}
                  isInWatchlist={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-32 bg-white rounded-[40px] shadow-sm border border-gray-100 mt-12 animate-modal-scale">
            <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-4xl">🔭</div>
            <h2 className="text-3xl font-black text-text-dark tracking-tight mb-6">Nothing to see here</h2>
            <p className="text-text-light font-bold leading-relaxed mb-12 max-w-sm mx-auto">
              You haven't added any assets to your watchlist yet. Follow stocks to track them here.
            </p>
            <Link to="/markets" className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95">
              EXPLORE STOCKS
              <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
