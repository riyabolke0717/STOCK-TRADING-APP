import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchModal from "./SearchModal";

export default function Navbar({ authState, setAuthState }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = authState?.currentUser;

  // Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth sync
  useEffect(() => {
    const handleAuthChange = () => {
      const user = localStorage.getItem("currentUser");
      const token = localStorage.getItem("authToken");
      if (setAuthState) {
        setAuthState({
          isAuthenticated: !!(user && token),
          currentUser: user ? JSON.parse(user) : null
        });
      }
    };
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [setAuthState]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    setIsUserMenuOpen(false);
    if (setAuthState) {
      setAuthState({ isAuthenticated: false, currentUser: null });
    }
    window.dispatchEvent(new Event('authChange'));
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const NAV_LINKS = [
    {
      label: "Stocks",
      key: "stocks",
      path: "/markets",
      mega: {
        Invest: [
          { icon: "📈", label: "Market Overview", to: "/markets" },
          { icon: "🔝", label: "Top Gainers", to: "/resources?type=top-gainers" },
          { icon: "📉", label: "Top Losers", to: "/resources?type=top-losers" },
          { icon: "🔥", label: "52-Week High", to: "/resources?type=52w-high" },
        ],
        Trade: [
          { icon: "📊", label: "F&O Terminal", to: "/markets?tab=fo" },
          { icon: "⚡", label: "Intraday picks", to: "/markets?filter=intraday" },
          { icon: "⭐", label: "My Watchlist", to: "/watchlist" },
        ],
      }
    },
    {
      label: "F&O",
      key: "fo",
      path: "/markets?tab=fo",
      mega: {
        Options: [
          { icon: "📊", label: "Option Chain", to: "/resources?type=option-chain" },
          { icon: "🎯", label: "Strategies", to: "/resources?type=trading-strategies" },
          { icon: "📉", label: "Put/Call Ratio", to: "/resources?type=pcr-ratio" },
        ],
        Futures: [
          { icon: "🔮", label: "Index Futures", to: "/resources?type=index-futures" },
          { icon: "🏢", label: "Stock Futures", to: "/resources?type=stock-futures" },
        ],
      }
    },
    {
      label: "Mutual Funds",
      key: "mf",
      path: "/markets?tab=mf",
      mega: {
        "By Goal": [
          { icon: "💰", label: "High Returns", to: "/resources?type=mf" },
          { icon: "🛡️", label: "Tax Saving (ELSS)", to: "/resources?type=mf" },
          { icon: "🏦", label: "Better than FD", to: "/resources?type=fd" },
        ],
        "By Type": [
          { icon: "🌿", label: "Equity Funds", to: "/resources?type=mf" },
          { icon: "📊", label: "Debt Funds", to: "/resources?type=mf" },
          { icon: "🔄", label: "Hybrid Funds", to: "/resources?type=mf" },
        ],
      }
    },
    {
      label: "More",
      key: "more",
      path: null,
      mega: {
        Calculators: [
          { icon: "🔢", label: "SIP Calculator", to: "/calculator?type=sip" },
          { icon: "💹", label: "Brokerage Calculator", to: "/calculator?type=brokerage" },
          { icon: "📈", label: "SWP Calculator", to: "/calculator?type=swp" },
          { icon: "💰", label: "Lumpsum Calculator", to: "/calculator?type=lumpsum" },
        ],
        Resources: [
          { icon: "🛡️", label: "Trust & Safety", to: "/resources?type=trust" },
          { icon: "🔒", label: "Bank Security", to: "/resources?type=security" },
          { icon: "📖", label: "Investment Guide", to: "/resources?type=nifty-50" },
        ],
      }
    },
  ];

  return (
    <>
      <nav className="bg-white text-text-dark shadow-sm sticky top-0 z-[60] border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-12 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center h-full">
            <Link to="/" className="flex items-center mr-8 group shrink-0">
              <img
                src="/logo.png"
                alt="Nexxtrade"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none' }} className="items-center space-x-2">
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="10" fill="hsla(184, 51%, 69%, 1.00)" />
                  <path d="M10 28 L17 18 L22 23 L29 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xl font-black text-text-dark tracking-tighter">Nexxtrade</span>
              </div>
            </Link>

            {/* Nav Links with Mega Menus */}
            <div className="hidden md:flex h-full items-center space-x-1">
              {NAV_LINKS.map((nav) => (
                <div
                  key={nav.key}
                  className="h-full flex items-center px-3 relative cursor-pointer"
                  onMouseEnter={() => setActiveMenu(nav.key)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {nav.path ? (
                    <Link
                      to={nav.path}
                      className={`font-semibold text-sm flex items-center gap-1 transition-colors ${isActive(nav.path) ? 'text-primary' : 'text-text-dark hover:text-primary'}`}
                    >
                      {nav.label}
                      <svg className="w-3 h-3 opacity-40 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </Link>
                  ) : (
                    <span className="font-semibold text-sm flex items-center gap-1 text-text-dark hover:text-primary transition-colors">
                      {nav.label}
                      <svg className="w-3 h-3 opacity-40 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  )}
                  {nav.path && isActive(nav.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                  )}

                  {/* Mega Menu */}
                  {activeMenu === nav.key && nav.mega && (
                    <div className="absolute top-16 left-0 min-w-[400px] bg-white shadow-2xl rounded-2xl border border-gray-100 animate-slide-down p-6 z-[70]">
                      <div className={`grid grid-cols-${Object.keys(nav.mega).length} gap-6`}>
                        {Object.entries(nav.mega).map(([section, items]) => (
                          <div key={section}>
                            <h4 className="text-[9px] font-black text-text-light uppercase tracking-[0.2em] mb-4 pb-2 border-b border-gray-50">{section}</h4>
                            <ul className="space-y-1">
                              {items.map((item) => (
                                <li key={item.label}>
                                  <Link
                                    to={item.to}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-text-dark hover:bg-primary/5 hover:text-primary transition-all group"
                                  >
                                    <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Center Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div
              className="w-full flex items-center bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all rounded-xl px-4 py-2.5 cursor-text text-gray-400 group"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg className="w-4 h-4 mr-3 group-hover:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm flex-1 truncate">Search stocks, MFs, ETFs...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded shadow-sm shrink-0">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile search */}
            <button className="lg:hidden p-2 text-text-dark hover:text-primary" onClick={() => setIsSearchOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Quick action pill */}
                <Link
                  to="/markets"
                  className="hidden md:inline-flex items-center px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs hover:bg-primary hover:text-white transition-all"
                >
                  + Invest
                </Link>

                {/* User avatar */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <svg className="w-3 h-3 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 animate-slide-down z-[80]">
                      {/* User Info */}
                      <div className="px-5 pb-3 mb-1 border-b border-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-sm">
                            {currentUser.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-black text-text-dark text-sm">{currentUser.name}</p>
                            <p className="text-[10px] text-text-light font-bold truncate">{currentUser.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        {[
                          { icon: "📊", label: "Dashboard", to: "/dashboard" },
                          { icon: "💼", label: "My Portfolio", to: "/portfolio" },
                          { icon: "⭐", label: "Watchlist", to: "/watchlist" },
                          { icon: "💰", label: "Wallet", to: "/wallet" },
                          { icon: "👤", label: "Profile", to: "/profile" },
                        ].map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-5 py-3 text-sm font-semibold text-text-dark hover:bg-gray-50 hover:text-primary transition-all"
                          >
                            <span className="mr-3 text-base">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-1 border-t border-gray-50">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-5 py-3 text-sm font-black text-danger hover:bg-red-50 transition-all"
                        >
                          <span className="mr-3">🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex font-black text-sm text-text-dark hover:text-primary transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-all duration-300 font-black text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-px"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
