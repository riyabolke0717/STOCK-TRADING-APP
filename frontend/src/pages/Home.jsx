import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const STATS = [
  { value: "4Cr+", label: "Registered Users", icon: "👥", detail: "Nexxtrade is trusted by over 4 Crore registered users across India for their investment journeys. Our community is one of the fastest-growing in the fintech space." },
  { value: "₹0", label: "Account Opening Fee", icon: "🎉", detail: "Start your investment journey for free. No hidden account opening or maintenance charges. We believe in transparency and zero entry barriers." },
  { value: "₹1500Cr+", label: "Daily Volume", icon: "📈", detail: "High liquidity platform processing over ₹1500 Crores in transaction volume every day, ensuring your orders are executed at the best possible prices." },
  { value: "24/7", label: "Customer Support", icon: "🛡️", detail: "Expert support team available around the clock to assist you via call, email, or live chat. Your financial security is our priority." },
];

const PRODUCTS = [
  {
    icon: "📈",
    title: "Stocks",
    desc: "Invest directly in India's top companies. Zero commission, instant execution. NSE & BSE listed.",
    badge: "Most Popular",
    color: "from-emerald-50 to-green-50",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    link: "/resources?type=stocks",
  },
  {
    icon: "🌿",
    title: "Mutual Funds",
    desc: "Start SIPs from just ₹100. Choose from 5000+ direct & regular funds with expert recommendations.",
    badge: "New",
    color: "from-orange-50 to-amber-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    link: "/resources?type=mf",
  },
  {
    icon: "🌎",
    title: "US Stocks",
    desc: "Own fractional shares of Apple, Tesla, Meta & Amazon. Invest globally from India.",
    badge: "Popular",
    color: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    link: "/resources?type=us-stocks",
  },
  {
    icon: "📊",
    title: "F&O",
    desc: "Trade Futures & Options on NIFTY, BANKNIFTY and top stocks with advanced analytics.",
    badge: "",
    color: "from-purple-50 to-violet-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    link: "/resources?type=fo",
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Order Execution",
    desc: "Orders placed in under 50ms with direct market access. Zero delays, maximum efficiency.",
    link: "/markets",
  },
  {
    icon: "🔒",
    title: "Bank-Grade Security",
    desc: "Your investments are secured with 256-bit SSL encryption, 2FA and SEBI regulation.",
    link: "/resources?type=security",
  },
  {
    icon: "🧠",
    title: "AI-Powered Insights",
    desc: "Smart portfolio suggestions, risk analysis, and market alerts powered by machine learning.",
    link: "/dashboard",
  },
  {
    icon: "📱",
    title: "Mobile-First Platform",
    desc: "Manage your full portfolio from iOS and Android with real-time push notifications.",
    link: "/calculator?type=sip",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Software Engineer, Bengaluru",
    avatar: "PS",
    color: "bg-primary",
    quote: "Nexxtrade completely transformed how I invest. The UI is so clean and intuitive — I started my SIP journey in under 5 minutes!",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    role: "Financial Analyst, Mumbai",
    avatar: "RM",
    color: "bg-blue-500",
    quote: "As a professional, I need accurate data fast. Nexxtrade's real-time charts and market depth are best-in-class.",
    rating: 5,
  },
  {
    name: "Ananya Reddy",
    role: "Entrepreneur, Hyderabad",
    avatar: "AR",
    color: "bg-purple-500",
    quote: "Started with ₹500 and grew to a diversified portfolio. The guided onboarding made investing feel simple.",
    rating: 5,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!(user && token));
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-inter">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-48 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-20">

            {/* LEFT COPY */}
            <div className="lg:w-[52%] text-center lg:text-left space-y-8 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Trusted by 4 Crore+ investors</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-text-dark leading-[1.05] tracking-tight">
                Smart Investing,{" "}
                <span className="relative">
                  <span className="text-primary">Simplified.</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10 Q75 2 150 8 Q225 14 298 6" stroke="hsla(192, 64%, 23%, 1.00)" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-text-light max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Nexxtrade is India's most trusted investment platform for{" "}
                <strong className="text-text-dark">Stocks</strong>,{" "}
                <strong className="text-text-dark">Mutual Funds</strong>, and{" "}
                <strong className="text-text-dark">US Equities</strong> — zero commission, SEBI regulated.
              </p>

              {!isLoggedIn ? (
                <div className="max-w-md mx-auto lg:mx-0 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden bg-white border border-gray-100 p-2">
                    <input
                      type="email"
                      placeholder="Enter your email to get started"
                      className="flex-grow px-5 py-4 outline-none text-base font-medium text-text-dark placeholder-gray-300 bg-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Link
                      to={`/register${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                      className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-black text-sm transition-all whitespace-nowrap shadow-lg shadow-primary/30 hover:shadow-primary/50"
                    >
                      Get Started Free →
                    </Link>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 pt-2">
                    <button
                      onClick={() => navigate("/resources?type=trust")}
                      className="text-[10px] text-text-light font-bold hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      🔒 No credit card required
                    </button>
                    <button
                      onClick={() => navigate("/resources?type=trust")}
                      className="text-[10px] text-text-light font-bold hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      🚀 Account opens in 5 mins
                    </button>
                    <button
                      onClick={() => navigate("/resources?type=trust")}
                      className="text-[10px] text-text-light font-bold hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      📄 100% paperless
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-2xl shadow-primary/30"
                >
                  Go to Dashboard →
                </Link>
              )}

            </div>

            {/* RIGHT HERO IMAGE */}
            <div className="lg:w-[45%] relative animate-slide-up flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-[60px] blur-3xl scale-110" />
              <img
                src="/hero.png"
                alt="Nexxtrade Platform"
                className="relative z-10 w-full max-w-[560px] drop-shadow-2xl rounded-3xl hover:scale-[1.02] transition-transform duration-700"
              />
              {/* Floating stat cards */}
              <div className="absolute top-4 -left-6 bg-white rounded-2xl shadow-2xl border border-gray-50 px-5 py-4 z-20 animate-pulse-soft">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">R</div>
                  <div>
                    <p className="text-[11px] font-black text-text-dark">RELIANCE</p>
                    <p className="text-[10px] font-black text-primary">▲ +2.45%</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-10 -right-6 bg-white rounded-2xl shadow-2xl border border-gray-50 px-5 py-4 z-20 animate-pulse-soft" style={{ animationDelay: '1s' }}>
                <p className="text-[10px] font-black text-text-light uppercase tracking-widest mb-1">Portfolio Value</p>
                <p className="text-xl font-black text-text-dark">₹4,28,500</p>
                <p className="text-[11px] font-black text-primary">↑ +₹12,400 today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────── */}
      <section className="bg-gradient-to-r from-text-dark to-[#2d2f3e] py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="space-y-2 cursor-pointer group"
                onClick={() => navigate("/resources?type=trust")}
              >
                <div className="text-3xl group-hover:scale-125 transition-transform duration-300">{s.icon}</div>
                <p className="text-4xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{s.value}</p>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────── */}
      <section className="py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="text-center mb-20">
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Our Product Suite</p>
            <h2 className="text-4xl md:text-6xl font-black text-text-dark tracking-tight leading-tight">
              Everything you need <br />
              <span className="text-primary">to grow your wealth.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <Link
                key={p.title}
                to={p.link}
                className={`bg-gradient-to-br ${p.color} p-8 rounded-[32px] group hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-white hover:shadow-2xl relative overflow-hidden`}
              >
                {p.badge && (
                  <span className={`absolute top-5 right-5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${p.badge === "Most Popular" ? "bg-primary text-white" : p.badge === "New" ? "bg-orange-500 text-white" : "bg-text-dark text-white"}`}>
                    {p.badge}
                  </span>
                )}
                <div className={`w-14 h-14 ${p.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {p.icon}
                </div>
                <h3 className="text-2xl font-black text-text-dark mb-3 tracking-tight">{p.title}</h3>
                <p className="text-text-light font-medium text-sm leading-relaxed">{p.desc}</p>
                <div className="mt-8 flex items-center text-xs font-black text-text-dark group-hover:text-primary transition-colors">
                  Explore <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXXTRADE PRO TERMINAL (915 INSPIRATION) ── */}
      <section className="py-32 bg-[#0d0e12] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>NEW: NEXXTRADE PRO 915</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                Trading Terminal <br />
                <span className="text-primary">Built for Speed.</span>
              </h2>
              <p className="text-lg text-white/50 font-medium leading-relaxed max-w-lg">
                Experience the 915 Terminal — a professional-grade trading engine designed for the high-frequency trader. Zero-latency charts, advanced option chains, and lightning-fast execution.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { label: "0-Latency Charts", icon: "📊" },
                  { label: "Pro Indicators", icon: "📈" },
                  { label: "Bulk Orders", icon: "⚡" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <span className="text-sm">{f.icon}</span>
                    <span className="text-xs font-black text-white/80 uppercase tracking-widest">{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8 text-center lg:text-left">
                <Link
                  to="/resources?type=pro-terminal"
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-black text-sm transition-all transform hover:scale-105 shadow-2xl shadow-primary/20"
                >
                  Try Pro Terminal →
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75" />
              <img
                src="/terminal.png"
                alt="Nexxtrade Pro Terminal"
                className="relative z-10 w-full rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SCALPER MODE (MOBILE DARK THEME) ────────── */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
            <div className="lg:w-[45%]">
              <div className="relative inline-block w-full">
                <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full scale-50" />
                <img
                  src="/mobile.png"
                  alt="Scalper Mode Mobile"
                  className="relative z-10 w-[380px] mx-auto drop-shadow-[0_45px_100px_rgba(0,0,0,0.4)] hover:rotate-3 transition-transform duration-1000"
                />
              </div>
            </div>
            <div className="lg:w-[55%] space-y-8">
              <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">Mobile Exclusive</p>
              <h2 className="text-4xl md:text-6xl font-black text-text-dark leading-tight tracking-tight">
                One-tap Trade with <br />
                <span className="text-primary italic">Scalper Mode.</span>
              </h2>
              <p className="text-lg text-text-light font-medium leading-relaxed">
                Speed is the only edge in active trading. Nexxtrade's Scalper Mode for mobile brings the power of a terminal to the palm of your hand. Dedicated Buy/Sell zones and instant order slicing.
              </p>
              <div className="space-y-6 pt-4">
                {[
                  { title: "Instant Execution", desc: "No second taps. Just tap and trade." },
                  { title: "Live Market Depth", desc: "Real-time visibility into bid-ask spreads." },
                  { title: "One-Click Exit", desc: "Square off all positions in a single gesture." },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <div className="bg-primary/10 w-6 h-6 rounded-lg flex items-center justify-center text-primary text-[10px] shrink-0 mt-1 font-black">✓</div>
                    <div>
                      <h4 className="font-black text-text-dark text-sm uppercase tracking-wide">{f.title}</h4>
                      <p className="text-text-light text-sm font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="bg-[#f8f8f9] py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <img
                src="/features.png"
                alt="Platform Features"
                className="w-full max-w-lg mx-auto drop-shadow-xl rounded-3xl hover:scale-[1.01] transition-transform duration-700"
              />
            </div>
            <div className="lg:w-1/2 space-y-12">
              <div>
                <p className="text-xs font-black text-primary uppercase tracking-[0.25em] mb-4">Why Nexxtrade?</p>
                <h2 className="text-4xl font-black text-text-dark tracking-tight leading-tight">
                  Built for the modern <br />Indian investor.
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {FEATURES.map((f) => (
                  <Link key={f.title} to={f.link || "/markets"} className="group p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-xl hover:border-primary/10 transition-all duration-500 block">
                    <div className="text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                    <h4 className="font-black text-text-dark mb-2 text-lg group-hover:text-primary transition-colors">{f.title}</h4>
                    <p className="text-text-light text-sm font-medium leading-relaxed">{f.desc}</p>
                    <span className="mt-4 text-xs font-black text-text-light group-hover:text-primary inline-flex items-center gap-1">Learn more <span className="group-hover:translate-x-1 transition-transform">→</span></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-center mb-20">
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">What our users say</p>
            <h2 className="text-4xl md:text-5xl font-black text-text-dark tracking-tight">
              Loved by millions.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-[32px] p-10 border border-gray-100 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-1">
                <div className="flex items-center space-x-4 mb-8">
                  <div className={`w-12 h-12 ${t.color} rounded-2xl flex items-center justify-center font-black text-white text-sm`}>{t.avatar}</div>
                  <div>
                    <p className="font-black text-text-dark">{t.name}</p>
                    <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <div className="flex space-x-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-text-dark font-medium leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────── */}
      <section className="py-32 bg-gradient-to-br from-text-dark via-[#2d2f3e] to-[#1a1b28] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        </div>
        <div className="container mx-auto px-6 max-w-4xl text-center relative">
          <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">Start Today. It's Free.</p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-8">
            Your wealth journey <br />
            <span className="text-primary">starts at ₹100.</span>
          </h2>
          <p className="text-white/60 font-medium text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Join 4 Crore+ investors who trust Nexxtrade for their financial growth. Zero commissions. Full control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-105 shadow-2xl shadow-primary/40"
            >
              Create Free Account →
            </Link>
            <Link
              to="/resources?type=trust"
              className="inline-flex items-center justify-center border border-white/20 text-white hover:bg-white/10 px-12 py-5 rounded-2xl font-black text-lg transition-all"
            >
              Learn More
            </Link>
          </div>
          <p className="text-white/30 text-xs font-bold mt-10 uppercase tracking-widest">
            SEBI Registered · NSE · BSE · AMFI · ABML/AIFM
          </p>
        </div>
      </section>

    </div>
  );
}
