import { useState, useEffect } from "react";
import { getAllStocks } from "../services/stockService";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = () => {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      if (user && user.portfolio) {
        // Map backend schema keys 'avg_price' to local 'avgPrice' for mapping
        const mappedPortfolio = user.portfolio.map(item => ({
          ...item,
          avgPrice: item.avg_price || item.avgPrice
        }));
        setPortfolio(mappedPortfolio);
      } else {
        setPortfolio([]);
      }
    };

    fetchHoldings();

    // Listen to changes (e.g., if a purchase happened in another tab)
    window.addEventListener('authChange', fetchHoldings);

    fetchStocks();

    return () => window.removeEventListener('authChange', fetchHoldings);
  }, []);

  const fetchStocks = async () => {
    try {
      const allStocks = await getAllStocks();
      setStocks(allStocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  const portfolioWithDetails = portfolio.map(item => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    if (!stock) return null;
    const currentValue = stock.price * item.quantity;
    const investedValue = item.avgPrice * item.quantity;
    const pnl = currentValue - investedValue;
    const pnlPercent = (pnl / investedValue) * 100;
    return { ...item, stock, currentValue, investedValue, pnl, pnlPercent };
  }).filter(Boolean);

  const totalInvested = portfolioWithDetails.reduce((sum, item) => sum + item.investedValue, 0);
  const totalCurrent = portfolioWithDetails.reduce((sum, item) => sum + item.currentValue, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f9] pb-24 font-inter">
      <div className="container mx-auto px-4 lg:px-12 max-w-7xl pt-12">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-text-dark tracking-tight">Investments</h1>
            <p className="text-text-light font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">
              Your holdings overview
            </p>
          </div>

          {portfolio.length > 0 && (
            <div className="bg-white px-10 py-6 rounded-[32px] shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-text-light uppercase tracking-widest">Invested</p>
                <p className="text-xl font-black text-text-dark">₹{totalInvested.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-text-light uppercase tracking-widest">Current</p>
                <p className="text-xl font-black text-text-dark">₹{totalCurrent.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-text-light uppercase tracking-widest">Returns</p>
                <p className={`text-xl font-black ${totalPnL >= 0 ? 'text-primary' : 'text-danger'}`}>
                  {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-text-light uppercase tracking-widest">Total %</p>
                <p className={`text-xl font-black ${totalPnLPercent >= 0 ? 'text-primary' : 'text-danger'}`}>
                  {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>

        {portfolio.length > 0 ? (
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-text-dark tracking-tight">Your Holdings</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/30 text-left">
                    <th className="px-10 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Stock</th>
                    <th className="px-10 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em] text-right">Qty</th>
                    <th className="px-10 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em] text-right">Avg. Price</th>
                    <th className="px-10 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em] text-right">LTP</th>
                    <th className="px-10 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em] text-right">Profit / Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {portfolioWithDetails.map((item) => (
                    <tr key={item.symbol} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-10 py-8">
                        <Link to={`/stock/${item.symbol}`} className="flex items-center space-x-5">
                          <div className="w-12 h-12 bg-[#f8f8f9] rounded-xl flex items-center justify-center font-black text-text-dark group-hover:bg-white border border-transparent group-hover:border-primary/20 transition-all text-sm">
                            {item.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-black text-text-dark group-hover:text-primary transition-all">{item.stock.name}</p>
                            <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">{item.symbol}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-10 py-8 text-right font-bold text-text-dark">{item.quantity}</td>
                      <td className="px-10 py-8 text-right font-bold text-text-light tabular-nums">₹{item.avgPrice.toLocaleString('en-IN')}</td>
                      <td className="px-10 py-8 text-right font-black text-text-dark tabular-nums">₹{item.stock.price.toLocaleString('en-IN')}</td>
                      <td className="px-10 py-8 text-right">
                        <p className={`font-black tabular-nums ${item.pnl >= 0 ? 'text-primary' : 'text-danger'}`}>
                          {item.pnl >= 0 ? '+' : ''}₹{item.pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-[10px] font-black ${item.pnl >= 0 ? 'text-primary/60' : 'text-danger/60'}`}>
                          {item.pnl >= 0 ? '+' : ''}{item.pnlPercent.toFixed(2)}%
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-10 bg-[#f8f8f9]/50 text-center">
              <Link to="/markets" className="inline-flex items-center text-primary font-black hover:underline group">
                <span>EXPLORE MORE GROWTH STOCKS</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center py-32 bg-white rounded-[48px] shadow-sm border border-gray-100 mt-8 animate-modal-scale">
            <div className="w-24 h-24 bg-[#f8f8f9] rounded-[32px] flex items-center justify-center mx-auto mb-10 text-5xl">🌱</div>
            <h2 className="text-3xl font-black text-text-dark tracking-tight mb-6">Empty Greenhouse</h2>
            <p className="text-text-light max-w-sm mx-auto font-bold mb-12 leading-relaxed">Your portfolio is where your seeds grow into trees. Start investing to build your wealth.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/markets" className="bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95">
                Start Investing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
