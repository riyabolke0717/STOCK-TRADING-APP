import { useState, useEffect } from "react";
import { getAllStocks } from "../services/stockService";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [todayChange, setTodayChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  /* 
     ---------------------------------------------------------
     📍 BACKEND INTEGRATION: USER DATA & PORTFOLIO
     ---------------------------------------------------------
     - LOGIC: Instead of localStorage, use an AUTHENTICATED request.
     - DB ACTION: Fetch user holdings from the 'Holdings' collection in MongoDB.
     - BACKEND: Express route `GET /api/users/portfolio` with JWT token.
     ---------------------------------------------------------
  */
  const fetchData = async () => {
    try {
      const allStocks = await getAllStocks();
      setStocks(allStocks.slice(0, 10));

      const portfolio = JSON.parse(localStorage.getItem("portfolio") || "[]");
      let totalValue = 0;
      let invested = 0;

      portfolio.forEach(item => {
        const stock = allStocks.find(s => s.symbol === item.symbol);
        if (stock) {
          totalValue += stock.price * item.quantity;
          invested += item.avgPrice * item.quantity;
        }
      });

      setPortfolioValue(totalValue);
      setTodayChange(totalValue - invested);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [100000, 105000, 98000, 112000, 108000, portfolioValue || 125000],
        fill: true,
        borderColor: "#00d09c",
        backgroundColor: "rgba(0, 208, 156, 0.05)",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10, weight: 'bold' }, color: '#9d9faf' } },
      y: { grid: { color: '#f8f8f9' }, border: { display: false }, ticks: { font: { size: 10, weight: 'bold' }, color: '#9d9faf' } }
    },
  };

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
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-text-dark tracking-tight">Dashboard</h1>
            <p className="text-text-light font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Your performance at a glance</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-[20px] shadow-sm border border-gray-100">
            <button className="px-8 py-2.5 text-xs font-black text-white bg-primary rounded-[14px]">STOCKS</button>
            <button className="px-8 py-2.5 text-xs font-black text-text-light hover:text-text-dark transition-all">MUTUAL FUNDS</button>
          </div>
        </div>

        {/* Top Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-up">
          <SummaryCard title="Total Value" value={`₹${portfolioValue.toLocaleString('en-IN')}`} sub={<span className="text-primary">+12.5% all time</span>} />
          <SummaryCard
            title="Today's Returns"
            value={`${todayChange >= 0 ? '+' : ''}₹${Math.abs(todayChange).toLocaleString('en-IN')}`}
            sub={`(${((todayChange / portfolioValue) * 100 || 0).toFixed(2)}%)`}
            isPositive={todayChange >= 0}
          />
          <SummaryCard title="Active Holdings" value={JSON.parse(localStorage.getItem("portfolio") || "[]").length} sub="Assets in your bag" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-text-dark tracking-tight">Growth Trend</h2>
                <div className="flex space-x-2">
                  {['1W', '1M', '1Y', 'ALL'].map(t => (
                    <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${t === 'ALL' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-[#f8f8f9] text-text-light hover:text-text-dark'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="h-[340px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="p-10 pb-6 flex justify-between items-center">
                <h2 className="text-2xl font-black text-text-dark tracking-tight">Watchlist Activity</h2>
                <Link to="/watchlist" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">View All</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {stocks.slice(0, 5).map((stock) => (
                  <Link key={stock.symbol} to={`/stock/${stock.symbol}`} className="flex items-center justify-between p-10 hover:bg-[#f8f8f9]/50 transition-all group">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-[#f8f8f9] rounded-2xl flex items-center justify-center font-black text-text-dark group-hover:bg-white border border-transparent group-hover:border-primary/20 transition-all text-sm">{stock.symbol.substring(0, 2)}</div>
                      <div>
                        <p className="font-black text-text-dark group-hover:text-primary transition-all text-lg">{stock.name}</p>
                        <p className="text-[10px] font-black text-text-light uppercase tracking-widest">{stock.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-text-dark text-lg tabular-nums">₹{stock.price.toLocaleString('en-IN')}</p>
                      <p className={`text-sm font-black tabular-nums ${stock.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* Quick Actions / IPO */}
            <div className="bg-text-dark rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]"></div>
              <h2 className="text-xl font-black mb-4 relative z-10">New IPO Alert</h2>
              <p className="text-white/60 font-bold text-sm mb-10 leading-relaxed relative z-10">Multiple high-growth companies are filing for IPO this month. Get ready to invest.</p>
              <Link
                to="/resources?type=ipo"
                className="block text-center w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 relative z-10"
              >
                VIEW ACTIVE IPOs
              </Link>
            </div>

            {/* Top Gainer Sidebar */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-xl font-black text-text-dark mb-8 tracking-tight">Market Mood</h2>
              <div className="space-y-6">
                {stocks.filter(s => s.change > 0).slice(0, 4).map(s => (
                  <Link key={s.symbol} to={`/stock/${s.symbol}`} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-[10px] font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">↑</span>
                      <span className="font-black text-text-dark text-sm">{s.symbol}</span>
                    </div>
                    <span className="font-black text-primary text-sm">+{s.changePercent.toFixed(2)}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, sub, isPositive = true }) {
  return (
    <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <p className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4">{title}</p>
      <p className="text-4xl font-black text-text-dark tracking-tight mb-4 group-hover:scale-105 transition-transform origin-left">{value}</p>
      <p className={`text-xs font-black uppercase tracking-widest ${isPositive ? 'text-primary' : 'text-danger'}`}>{sub}</p>
    </div>
  );
}
