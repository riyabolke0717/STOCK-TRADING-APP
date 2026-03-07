import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getStockBySymbol, getStockHistory } from "../services/stockService";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function StockDetail() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1M");
  const [watchlist, setWatchlist] = useState([]);
  const [qty, setQty] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');
  const [orderLoading, setOrderLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage (updated from MongoDB)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);

    // Listen for auth changes
    const handleAuthChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setCurrentUser(updatedUser);
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  const fetchStockData = useCallback(async () => {
    try {
      const [stockData, historyData] = await Promise.all([
        getStockBySymbol(symbol),
        getStockHistory(symbol, period)
      ]);
      setStock(stockData);
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, [fetchStockData]);

  const toggleWatchlist = () => {
    const newWatchlist = watchlist.includes(symbol)
      ? watchlist.filter(s => s !== symbol)
      : [...watchlist, symbol];
    setWatchlist(newWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
  };

  const handleOrder = async () => {
    if (!currentUser) {
      toast.error("Please login to place an order");
      return;
    }

    if (!stock || qty <= 0) {
      toast.error("Invalid order");
      return;
    }

    setOrderLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const endpoint = tradeType === "BUY" ? "/api/trade/buy" : "/api/trade/sell";

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser._id,
          stockName: stock.name || symbol,
          stockSymbol: stock.symbol || symbol,
          quantity: Number(qty),
          price: stock.price,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update user balance in localStorage
        const updatedUser = {
          ...currentUser,
          balance: result.newBalance,
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        window.dispatchEvent(new Event("authChange"));

        toast.success(`${tradeType} order placed: ${qty} shares of ${stock.symbol || symbol} at ₹${stock.price.toLocaleString("en-IN")}`);
      } else {
        toast.error(result.message || "Order failed.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Order failed. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  const isInWatchlist = watchlist.includes(symbol);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stock) return <div className="p-20 text-center">Stock not found</div>;

  const isPositive = stock.change >= 0;

  const chartData = {
    labels: history.map(h => h.date || ''),
    datasets: [
      {
        fill: true,
        data: history.map(h => h.price),
        borderColor: isPositive ? '#00d09c' : '#eb5b3c',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, isPositive ? 'rgba(0, 208, 156, 0.1)' : 'rgba(235, 91, 60, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#44475b',
        titleFont: { size: 10, weight: 'bold' },
        bodyFont: { size: 12, weight: 'bold' },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString('en-IN')} `
        }
      },
    },
    scales: {
      x: { display: false },
      y: {
        display: true,
        position: 'right',
        grid: { display: false },
        ticks: {
          font: { size: 10, weight: 'bold' },
          color: '#7c7e8c',
          callback: (value) => value.toLocaleString('en-IN')
        }
      },
    },
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 lg:px-12 max-w-7xl pt-8">

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[10px] font-bold text-text-light uppercase tracking-widest mb-8">
          <Link to="/markets" className="hover:text-primary transition-colors">STOCKS</Link>
          <span className="text-gray-200">/</span>
          <span className="text-text-dark">{stock.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-black text-primary shadow-sm overflow-hidden">
                  <img src={`https://storage.googleapis.com/abc-logos/${stock.symbol.toLowerCase()}.png`} alt="" className="w-full h-full object-cover hidden" />
                  <span>{stock.symbol[0]}</span>
                </div >
                <div>
                  <h1 className="text-2xl font-bold text-text-dark">{stock.name}</h1>
                  <p className="text-xs font-bold text-text-light mt-1 uppercase tracking-widest">{stock.symbol} • NSE</p>
                </div>
              </div >
              <div className="mt-6 md:mt-0 text-left md:text-right">
                <p className="text-3xl font-black text-text-dark tabular-nums">₹{stock.price.toLocaleString('en-IN')}</p>
                <p className={`text-md font-bold mt-1 ${isPositive ? "text-primary" : "text-danger"}`}>
                  {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div >

            {/* Chart Area */}
            < div className="space-y-6" >
              <div className="flex items-center space-x-2 no-scrollbar overflow-x-auto">
                {['1D', '1W', '1M', '1Y', '5Y', 'ALL'].map(t => (
                  <button
                    key={t}
                    onClick={() => setPeriod(t)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${period === t ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-light hover:bg-gray-50'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="h-[400px] w-full relative pt-4">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div >

            {/* Performance Slider Section (Placeholder for range bars) */}
            < div className="grid grid-cols-1 md:grid-cols-2 gap-12" >
              <div className="space-y-8">
                <h3 className="text-xs font-bold text-text-light uppercase tracking-[0.2em]">Performance</h3>
                <div className="space-y-6">
                  <RangeBar label="Today's Low" highLabel="Today's High" low={stock.dayLow} high={stock.dayHigh} current={stock.price} info="The lowest and highest price at which a stock has traded during the current trading day." />
                  <RangeBar label="52W Low" highLabel="52W High" low={stock.dayLow * 0.8} high={stock.dayHigh * 1.5} current={stock.price} info="The lowest and highest price at which a stock has traded over the past 52 weeks." />
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-xs font-bold text-text-light uppercase tracking-[0.2em]">Market Depth</h3>
                <div className="grid grid-cols-2 gap-8">
                  <DepthSide label="Buy" price={stock.price * 0.9992} qty={450} color="primary" total={500} />
                  <DepthSide label="Sell" price={stock.price * 1.0008} qty={320} color="danger" total={500} />
                </div>
              </div>
            </div >

            {/* Fundamentals Grid */}
            < div className="space-y-8" >
              <h3 className="text-xs font-bold text-text-light uppercase tracking-[0.2em]">Fundamentals</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
                <Metric label="Market Cap" value={`₹${stock.marketCap}`} info="Total market value of a company's outstanding shares of stock." />
                <Metric label="P/E Ratio" value="24.50" info="Price-to-Earnings ratio indicates how much investors are willing to pay per rupee of earnings." />
                <Metric label="ROE" value="18.4%" info="Return on Equity measures financial performance calculated by dividing net income by shareholders' equity." />
                <Metric label="Div. Yield" value="1.25%" info="Dividend yield is the financial ratio that shows how much a company pays out in dividends each year relative to its stock price." />
                <Metric label="Book Value" value="142.50" info="The net asset value of a company calculated as total assets minus intangible assets and liabilities." />
                <Metric label="P/B Ratio" value="3.45" info="Price-to-Book ratio compares a firm's market capitalization to its book value." />
                <Metric label="Face Value" value="10.00" info="The nominal value of a security stated by the issuer." />
              </div>
            </div >

          </div >

          {/* Right Sidebar: Order Panel */}
          < div className="lg:col-span-4" >
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setTradeType('BUY')}
                  className={`flex-1 py-4 text-xs font-black tracking-widest transition-all border-b-2 ${tradeType === 'BUY' ? 'text-primary border-primary bg-primary/5' : 'text-text-light border-transparent hover:bg-gray-50'}`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setTradeType('SELL')}
                  className={`flex-1 py-4 text-xs font-black tracking-widest transition-all border-b-2 ${tradeType === 'SELL' ? 'text-danger border-danger bg-danger/5' : 'text-text-light border-transparent hover:bg-gray-50'}`}
                >
                  SELL
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">Type</p>
                    <p className="text-sm font-bold text-text-dark">Delivery</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">Qty</p>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-20 text-right bg-gray-50 rounded px-2 py-1 text-sm font-bold text-text-dark outline-none focus:ring-1 ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-text-light">Price</span>
                  <span className="text-text-dark italic">Market</span>
                </div>

                <div className="pt-8 border-t border-gray-50 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">Balance</span>
                    <span className="text-sm font-bold text-text-dark">₹{currentUser?.balance?.toLocaleString('en-IN') || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">Approx. Required</span>
                    <span className="text-xl font-black text-text-dark">₹{(stock.price * qty).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={orderLoading}
                  className={`w-full py-4 rounded-xl font-black text-sm tracking-widest transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 ${tradeType === 'BUY' ? 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark' : 'bg-danger text-white shadow-danger/20 hover:bg-danger-dark'}`}
                >
                  {orderLoading ? 'Processing...' : `${tradeType} ${symbol}`}
                </button>

                <button
                  onClick={toggleWatchlist}
                  className="w-full flex items-center justify-center space-x-2 text-[10px] font-bold text-text-light hover:text-primary transition-colors pt-2"
                >
                  <svg className={`w-4 h-4 ${isInWatchlist ? 'text-primary fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>{isInWatchlist ? 'ALREADY IN WATCHLIST' : 'ADD TO WATCHLIST'}</span>
                </button>
              </div>
            </div>
          </div >
        </div >
      </div >
    </div >
  );
}

function Metric({ label, value, info }) {
  const navigate = useNavigate();
  const slug = label.toLowerCase().includes('pe') ? 'pe-ratio' : 'market-cap';
  return (
    <div
      className={`space-y-1 ${info ? 'cursor-pointer' : ''}`}
      onClick={() => info && navigate(`/resources?type=${slug}`)}
    >
      <p className="text-[10px] font-bold text-text-light uppercase tracking-wider flex items-center gap-1">
        {label}
        {info && <span className="text-[8px] opacity-40">ⓘ</span>}
      </p>
      <p className="text-sm font-black text-text-dark">{value}</p>
    </div>
  );
}

function RangeBar({ label, highLabel, low, high, current, info }) {
  const navigate = useNavigate();
  const percent = ((current - low) / (high - low)) * 100;
  return (
    <div
      className={`space-y-4 ${info ? 'cursor-pointer group/range' : ''}`}
      onClick={() => info && navigate("/resources?type=pe-ratio")}
    >
      <div className="flex justify-between items-center text-[10px] font-bold text-text-light uppercase tracking-widest">
        <span className="group-hover/range:text-primary transition-colors">{label}</span>
        <span className="group-hover/range:text-primary transition-colors">{highLabel}</span>
      </div>
      <div className="h-1.5 bg-gray-50 rounded-full relative">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md z-10 transition-all duration-700"
          style={{ left: `${Math.min(Math.max(percent, 0), 100)}%`, transform: 'translate(-50%, -50%)' }}
        ></div>
        <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
      </div>
      <div className="flex justify-between text-[10px] font-black text-text-dark tabular-nums">
        <span>₹{low.toLocaleString('en-IN')}</span>
        <span>₹{high.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

function DepthSide({ label, price, qty, color, total }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[8px] font-black text-text-light uppercase tracking-[0.2em] pb-1 border-b border-gray-100">
        <span>{label}</span>
        <span>QTY</span>
      </div>
      {[1, 2, 3, 4, 5].map(i => {
        const itemQty = qty - (i * 15);
        const itemPrice = price + (color === 'primary' ? -i * 0.05 : i * 0.05);
        const barWidth = (itemQty / total) * 100;
        return (
          <div key={i} className="relative group flex justify-between items-center py-1.5">
            <div className={`absolute inset-y-0 left-0 ${color === 'primary' ? 'bg-primary/5' : 'bg-danger/5'} transition-all`} style={{ width: `${barWidth}%` }}></div>
            <span className={`relative text-[10px] font-bold tabular-nums ${color === 'primary' ? 'text-primary' : 'text-danger'}`}>₹{itemPrice.toFixed(2)}</span>
            <span className="relative text-[10px] font-bold text-text-dark tabular-nums">{itemQty}</span>
          </div>
        );
      })}
    </div>
  );
}
