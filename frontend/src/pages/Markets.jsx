import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllStocks, getMarketOverview } from "../services/stockService";
import StockCard from "../components/StockCard";

export default function Markets() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [marketOverview, setMarketOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Stocks");

  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stocksData, overviewData] = await Promise.all([
        getAllStocks(),
        getMarketOverview()
      ]);
      setStocks(stocksData);
      setMarketOverview(overviewData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (stock) => {
    const newWatchlist = watchlist.includes(stock.symbol)
      ? watchlist.filter(s => s !== stock.symbol)
      : [...watchlist, stock.symbol];
    setWatchlist(newWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f9] pb-20">
      <div className="container mx-auto px-4 lg:px-12 max-w-7xl">

        {/* Indices Slider */}
        <div className="py-8 overflow-x-auto no-scrollbar flex space-x-4">
          {marketOverview && (
            <>
              <IndexChip name="NIFTY 50" value={marketOverview.nifty.value} change={marketOverview.nifty.change} percent={marketOverview.nifty.changePercent} />
              <IndexChip name="SENSEX" value={marketOverview.sensex.value} change={marketOverview.sensex.change} percent={marketOverview.sensex.changePercent} />
              <IndexChip name="BANK NIFTY" value={47850.40} change={-245.20} percent={-0.51} />
              <IndexChip name="FIN NIFTY" value={21200.15} change={115.30} percent={0.54} />
              <IndexChip name="MIDCAP SELECT" value={10540.80} change={45.20} percent={0.43} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">

            {/* Explore Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <Link to="/resources?type=explore-stocks" className="text-xl font-bold text-text-dark hover:text-primary transition-colors flex items-center group">
                  Explore Stocks
                  <span className="ml-2 text-xs font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">Learn Focus →</span>
                </Link>
                <div className="flex space-x-2">
                  {['Stocks', 'Mutual Funds', 'ETFs'].map(cat => (
                    <Link
                      key={cat}
                      to={`/resources?type=${cat === 'Mutual Funds' ? 'mf' : cat.toLowerCase()}`}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-gray-50'}`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ExploreCard icon="🚀" label="Top Gainers" color="text-primary" bg="bg-primary/5" link="/resources?type=top-gainers" />
                <ExploreCard icon="🔻" label="Top Losers" color="text-danger" bg="bg-danger/5" link="/resources?type=top-losers" />
                <ExploreCard icon="📈" label="52W High" color="text-blue-500" bg="bg-blue-50/50" link="/resources?type=52w-high" />
                <ExploreCard icon="📊" label="ETFs" color="text-purple-500" bg="bg-purple-50/50" link="/resources?type=etf" />
              </div>
            </div>

            {/* Stocks Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-text-dark">Stocks in Focus</h2>
                <button className="text-sm font-bold text-primary hover:underline">View All</button>
              </div>

              <div className="divide-y divide-gray-50">
                {stocks.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={watchlist.includes(stock.symbol)}
                  />
                ))}
              </div>

              <button className="w-full py-5 text-sm font-bold text-primary hover:bg-gray-50 transition-colors border-t border-gray-50">
                SHOW MORE
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Most Bought */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-md font-bold text-text-dark mb-6">Most Bought on Nexxtrade</h3>
              <div className="space-y-5">
                {stocks.slice(0, 4).map(s => (
                  <Link key={s.symbol} to={`/stock/${s.symbol}`} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-primary border border-gray-100 group-hover:border-primary/20 transition-all">
                        {s.symbol[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-dark group-hover:text-primary transition-colors">{s.name.split(' ')[0]}</p>
                        <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">{s.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-dark">₹{s.price.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] font-bold text-primary">+{s.changePercent.toFixed(2)}%</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* F&O Tools Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-md font-bold text-text-dark mb-6">F&O Tools</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Link to="/resources?type=option-chain" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 group transition-all">
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                  <span className="text-[10px] font-black text-text-dark uppercase tracking-widest text-center">Option Chain</span>
                </Link>
                <Link to="/resources?type=trading-strategies" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 group transition-all">
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎯</span>
                  <span className="text-[10px] font-black text-text-dark uppercase tracking-widest text-center">Strategies</span>
                </Link>
              </div>
              <div className="space-y-3">
                <Link to="/resources?type=pcr-ratio" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 group transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📉</span>
                    <span className="text-xs font-bold text-text-dark uppercase tracking-widest">Put/Call Ratio</span>
                  </div>
                  <span className="text-primary text-xs font-black">VIEW</span>
                </Link>
                <Link to="/resources?type=index-futures" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 group transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔮</span>
                    <span className="text-xs font-bold text-text-dark uppercase tracking-widest">Index Futures</span>
                  </div>
                  <span className="text-primary text-xs font-black">VIEW</span>
                </Link>
                <Link to="/resources?type=stock-futures" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 group transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏢</span>
                    <span className="text-xs font-bold text-text-dark uppercase tracking-widest">Stock Futures</span>
                  </div>
                  <span className="text-primary text-xs font-black">VIEW</span>
                </Link>
              </div>
            </div>

            {/* F&O Section (Active Quotes) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-md font-bold text-text-dark">F&O Live Quotes</h3>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">LIVE</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-text-dark group-hover:text-primary transition-colors">NIFTY 21 MAR 22000 CE</p>
                    <p className="text-xs font-bold text-primary">₹145.20</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">Oi: 2.4L</p>
                    <p className="text-[10px] font-bold text-primary">+12.4%</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-text-dark group-hover:text-primary transition-colors">BANKNIFTY 21 MAR 47500 PE</p>
                    <p className="text-xs font-bold text-danger">₹230.45</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">Oi: 1.8L</p>
                    <p className="text-[10px] font-bold text-danger">-8.2%</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function IndexChip({ name, value, change, percent }) {
  const navigate = useNavigate();
  const isPos = change >= 0;

  const showIndexInfo = () => {
    const slugs = {
      'NIFTY 50': 'nifty-50',
      'SENSEX': 'sensex',
      'BANK NIFTY': 'nifty-50',
      'FIN NIFTY': 'nifty-50',
      'MIDCAP SELECT': 'nifty-50'
    };
    navigate(`/resources?type=${slugs[name] || 'nifty-50'}`);
  };

  return (
    <div
      onClick={showIndexInfo}
      className="bg-white rounded-[24px] border border-gray-100 p-5 min-w-[200px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <p className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-3 group-hover:text-primary transition-colors">{name}</p>
      <div className="flex justify-between items-end">
        <p className="text-lg font-black text-text-dark tracking-tighter">₹{value.toLocaleString('en-IN')}</p>
        <p className={`text-[11px] font-black ${isPos ? 'text-primary' : 'text-danger'} flex items-center`}>
          {isPos ? '▲' : '▼'} {percent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

function ExploreCard({ icon, label, color, bg, link }) {
  return (
    <Link to={link} className={`${bg} ${color} p-6 rounded-3xl hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group border border-transparent hover:border-current/10`}>
      <span className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-500">{icon}</span>
      <span className="text-[11px] font-black leading-tight uppercase tracking-widest">{label}</span>
    </Link>
  );
}
