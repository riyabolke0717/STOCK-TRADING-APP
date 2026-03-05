import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { searchStocks } from "../services/stockService";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    if (query.length < 2) return;

    setIsLoading(true);
    try {
      const searchResults = await searchStocks(query);
      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleResultClick = () => {
    setQuery("");
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search stocks, companies..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {results.map((stock) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
              onClick={handleResultClick}
              className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-semibold text-gray-800">{stock.symbol}</p>
                <p className="text-sm text-gray-600">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">₹{stock.price.toLocaleString('en-IN')}</p>
                <p className={`text-sm ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No stocks found matching "{query}"
        </div>
      )}
    </div>
  );
}
