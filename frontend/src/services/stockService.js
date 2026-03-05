// Stock Service for fetching live stock data
// Using mock data with realistic stock information
// Can be easily replaced with real API calls
/* 
   ---------------------------------------------------------
   📍 BACKEND CONNECTION POINT (NODE.JS / EXPRESS)
   ---------------------------------------------------------
   - DEVELOPER NOTE: Replace the MOCK_STOCKS logic with `axios` or `fetch`
   - ENDPOINT: http://localhost:5000/api/stocks
   - MONGODB LOGIC: The backend should query the 'Stocks' collection 
     and return real-time price updates via WebSockets or polling.
   ---------------------------------------------------------
*/

const MOCK_STOCKS = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    price: 2456.80,
    change: 23.45,
    changePercent: 0.96,
    volume: "2.5M",
    marketCap: "16.5T",
    sector: "Energy",
    dayHigh: 2478.90,
    dayLow: 2434.50,
    open: 2435.20,
    previousClose: 2433.35
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd.",
    price: 3456.20,
    change: -12.30,
    changePercent: -0.35,
    volume: "1.2M",
    marketCap: "12.7T",
    sector: "IT",
    dayHigh: 3489.00,
    dayLow: 3445.80,
    open: 3478.50,
    previousClose: 3468.50
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    price: 1456.75,
    change: 8.90,
    changePercent: 0.61,
    volume: "3.1M",
    marketCap: "6.1T",
    sector: "IT",
    dayHigh: 1467.80,
    dayLow: 1445.20,
    open: 1448.00,
    previousClose: 1447.85
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    price: 1654.30,
    change: -5.40,
    changePercent: -0.33,
    volume: "4.2M",
    marketCap: "9.2T",
    sector: "Banking",
    dayHigh: 1667.90,
    dayLow: 1648.50,
    open: 1660.00,
    previousClose: 1659.70
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    price: 945.60,
    change: 12.80,
    changePercent: 1.37,
    volume: "5.8M",
    marketCap: "6.6T",
    sector: "Banking",
    dayHigh: 952.40,
    dayLow: 938.20,
    open: 940.00,
    previousClose: 932.80
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 654.25,
    change: -3.15,
    changePercent: -0.48,
    volume: "8.9M",
    marketCap: "5.8T",
    sector: "Banking",
    dayHigh: 661.00,
    dayLow: 651.80,
    open: 658.00,
    previousClose: 657.40
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd.",
    price: 876.40,
    change: 15.60,
    changePercent: 1.81,
    volume: "2.3M",
    marketCap: "4.9T",
    sector: "Telecom",
    dayHigh: 882.50,
    dayLow: 865.20,
    open: 868.00,
    previousClose: 860.80
  },
  {
    symbol: "ITC",
    name: "ITC Ltd.",
    price: 423.85,
    change: 2.45,
    changePercent: 0.58,
    volume: "6.7M",
    marketCap: "5.3T",
    sector: "FMCG",
    dayHigh: 428.90,
    dayLow: 420.50,
    open: 422.00,
    previousClose: 421.40
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank Ltd.",
    price: 1756.90,
    change: -18.30,
    changePercent: -1.03,
    volume: "1.5M",
    marketCap: "3.5T",
    sector: "Banking",
    dayHigh: 1780.00,
    dayLow: 1750.20,
    open: 1775.00,
    previousClose: 1775.20
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd.",
    price: 2345.60,
    change: 28.90,
    changePercent: 1.25,
    volume: "1.8M",
    marketCap: "3.2T",
    sector: "Construction",
    dayHigh: 2356.80,
    dayLow: 2320.40,
    open: 2325.00,
    previousClose: 2316.70
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd.",
    price: 2345.80,
    change: -8.20,
    changePercent: -0.35,
    volume: "890K",
    marketCap: "5.5T",
    sector: "FMCG",
    dayHigh: 2360.00,
    dayLow: 2340.50,
    open: 2355.00,
    previousClose: 2354.00
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd.",
    price: 6789.40,
    change: 45.60,
    changePercent: 0.68,
    volume: "450K",
    marketCap: "4.1T",
    sector: "NBFC",
    dayHigh: 6820.00,
    dayLow: 6750.20,
    open: 6760.00,
    previousClose: 6743.80
  }
];

// Simulate live price updates
const simulateLiveUpdate = (stock) => {
  const volatility = 0.002; // 0.2% volatility
  const change = (Math.random() - 0.5) * 2 * volatility * stock.price;
  const newPrice = stock.price + change;
  const priceChange = newPrice - stock.previousClose;
  const changePercent = (priceChange / stock.previousClose) * 100;

  return {
    ...stock,
    price: Number(newPrice.toFixed(2)),
    change: Number(priceChange.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2))
  };
};

// Get all stocks with simulated live updates
export const getAllStocks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedStocks = MOCK_STOCKS.map(simulateLiveUpdate);
      resolve(updatedStocks);
    }, 500); // Simulate network delay
  });
};

// Get stock by symbol
export const getStockBySymbol = (symbol) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const stock = MOCK_STOCKS.find(s => s.symbol === symbol.toUpperCase());
      if (stock) {
        resolve(simulateLiveUpdate(stock));
      } else {
        reject(new Error('Stock not found'));
      }
    }, 300);
  });
};

// Search stocks by name or symbol
export const searchStocks = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = MOCK_STOCKS.filter(stock =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered.map(simulateLiveUpdate));
    }, 300);
  });
};

// Get market overview
export const getMarketOverview = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sensex: {
          value: 72560.80,
          change: 245.60,
          changePercent: 0.34
        },
        nifty: {
          value: 21945.30,
          change: 78.90,
          changePercent: 0.36
        },
        topGainers: MOCK_STOCKS.filter(s => s.change > 0).slice(0, 5),
        topLosers: MOCK_STOCKS.filter(s => s.change < 0).slice(0, 5)
      });
    }, 400);
  });
};

// Get stock history (mock data for charts)
export const getStockHistory = (symbol, period = '1M') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stock = MOCK_STOCKS.find(s => s.symbol === symbol.toUpperCase());
      if (!stock) {
        resolve([]);
        return;
      }

      // Generate mock historical data
      const days = period === '1D' ? 24 : period === '1W' ? 7 : period === '1M' ? 30 : 365;
      const history = [];
      let currentPrice = stock.price;

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
        currentPrice += change;

        history.push({
          date: date.toISOString().split('T')[0],
          price: Number(currentPrice.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
      }

      resolve(history);
    }, 500);
  });
};
