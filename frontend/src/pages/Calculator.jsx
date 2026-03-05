import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const CALCULATORS = [
    { key: "sip", label: "SIP Calculator", icon: "🔢", color: "bg-primary/10 text-primary" },
    { key: "lumpsum", label: "Lumpsum", icon: "💰", color: "bg-blue-50 text-blue-500" },
    { key: "swp", label: "SWP Calculator", icon: "📈", color: "bg-purple-50 text-purple-500" },
    { key: "brokerage", label: "Brokerage", icon: "💹", color: "bg-orange-50 text-orange-500" },
];

function formatINR(num) {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
}

function SIPCalculator() {
    const [monthly, setMonthly] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const months = years * 12;
    const r = rate / 100 / 12;
    const invested = monthly * months;
    const maturity = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    const returns = maturity - invested;

    return (
        <div className="space-y-8">
            <Slider label="Monthly Investment" value={monthly} min={500} max={100000} step={500} onChange={setMonthly} format={(v) => `₹${v.toLocaleString("en-IN")}`} />
            <Slider label="Expected Annual Return" value={rate} min={1} max={30} step={0.5} onChange={setRate} format={(v) => `${v}%`} />
            <Slider label="Time Period" value={years} min={1} max={30} step={1} onChange={setYears} format={(v) => `${v} yr`} />

            <ResultCard invested={invested} returns={returns} maturity={maturity} />
        </div>
    );
}

function LumpsumCalculator() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const maturity = principal * Math.pow(1 + rate / 100, years);
    const returns = maturity - principal;

    return (
        <div className="space-y-8">
            <Slider label="Investment Amount" value={principal} min={1000} max={10000000} step={1000} onChange={setPrincipal} format={(v) => `₹${v.toLocaleString("en-IN")}`} />
            <Slider label="Expected Annual Return" value={rate} min={1} max={30} step={0.5} onChange={setRate} format={(v) => `${v}%`} />
            <Slider label="Time Period" value={years} min={1} max={40} step={1} onChange={setYears} format={(v) => `${v} yr`} />

            <ResultCard invested={principal} returns={returns} maturity={maturity} />
        </div>
    );
}

function SWPCalculator() {
    const [corpus, setCorpus] = useState(1000000);
    const [withdrawal, setWithdrawal] = useState(10000);
    const [rate, setRate] = useState(8);

    const r = rate / 100 / 12;
    // How long corpus lasts
    const n = -Math.log(1 - (corpus * r) / withdrawal) / Math.log(1 + r);
    const years = isFinite(n) && n > 0 ? (n / 12).toFixed(1) : "∞";
    const totalWithdrawn = isFinite(n) && n > 0 ? withdrawal * n : 0;

    return (
        <div className="space-y-8">
            <Slider label="Total Corpus" value={corpus} min={100000} max={50000000} step={50000} onChange={setCorpus} format={(v) => formatINR(v)} />
            <Slider label="Monthly Withdrawal" value={withdrawal} min={1000} max={200000} step={1000} onChange={setWithdrawal} format={(v) => `₹${v.toLocaleString("en-IN")}`} />
            <Slider label="Expected Annual Return" value={rate} min={1} max={20} step={0.5} onChange={setRate} format={(v) => `${v}%`} />

            <div className="bg-[#f8f8f9] rounded-3xl p-8 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-text-light">Corpus lasts for</span>
                    <span className="text-2xl font-black text-primary">{years} years</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-text-light">Total withdrawn</span>
                    <span className="text-lg font-black text-text-dark">{isFinite(n) && n > 0 ? formatINR(totalWithdrawn) : "Corpus grows indefinitely"}</span>
                </div>
            </div>
        </div>
    );
}

function BrokerageCalculator() {
    const [buyPrice, setBuyPrice] = useState(1500);
    const [sellPrice, setSellPrice] = useState(1600);
    const [qty, setQty] = useState(10);

    const turnover = (buyPrice + sellPrice) * qty;
    const brokerage = Math.min(20, (turnover * 0.0003));
    const stt = sellPrice * qty * 0.001;
    const exchange = turnover * 0.0000345;
    const gst = (brokerage + exchange) * 0.18;
    const sebi = turnover * 0.000001;
    const totalCharges = brokerage + stt + exchange + gst + sebi;
    const grossPnl = (sellPrice - buyPrice) * qty;
    const netPnl = grossPnl - totalCharges;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="text-[10px] font-black text-text-light uppercase tracking-widest mb-2 block">Buy Price (₹)</label>
                    <input type="number" value={buyPrice} onChange={e => setBuyPrice(+e.target.value)} className="w-full bg-[#f8f8f9] border border-gray-100 rounded-2xl px-5 py-4 font-black text-text-dark text-xl outline-none focus:border-primary transition-all" />
                </div>
                <div>
                    <label className="text-[10px] font-black text-text-light uppercase tracking-widest mb-2 block">Sell Price (₹)</label>
                    <input type="number" value={sellPrice} onChange={e => setSellPrice(+e.target.value)} className="w-full bg-[#f8f8f9] border border-gray-100 rounded-2xl px-5 py-4 font-black text-text-dark text-xl outline-none focus:border-primary transition-all" />
                </div>
                <div>
                    <label className="text-[10px] font-black text-text-light uppercase tracking-widest mb-2 block">Quantity</label>
                    <input type="number" value={qty} onChange={e => setQty(+e.target.value)} className="w-full bg-[#f8f8f9] border border-gray-100 rounded-2xl px-5 py-4 font-black text-text-dark text-xl outline-none focus:border-primary transition-all" />
                </div>
            </div>

            <div className="bg-[#f8f8f9] rounded-3xl p-8 space-y-3">
                {[
                    { label: "Brokerage", val: brokerage },
                    { label: "STT", val: stt },
                    { label: "Exchange Charges", val: exchange },
                    { label: "GST (18%)", val: gst },
                    { label: "SEBI Charges", val: sebi },
                ].map(item => (
                    <div key={item.label} className="flex justify-between">
                        <span className="text-sm font-bold text-text-light">{item.label}</span>
                        <span className="text-sm font-bold text-text-dark">₹{item.val.toFixed(2)}</span>
                    </div>
                ))}
                <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-black text-text-dark">Total Charges</span>
                        <span className="font-black text-danger">₹{totalCharges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-black text-text-dark">Net P&L</span>
                        <span className={`text-xl font-black ${netPnl >= 0 ? "text-primary" : "text-danger"}`}>
                            {netPnl >= 0 ? "+" : ""}₹{netPnl.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Slider({ label, value, min, max, step, onChange, format }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-text-light">{label}</label>
                <span className="text-lg font-black text-primary">{format(value)}</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={(e) => onChange(+e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "hsla(192, 64%, 23%, 1.00)" }}
            />
            <div className="flex justify-between mt-1">
                <span className="text-[10px] text-text-light font-bold">{format(min)}</span>
                <span className="text-[10px] text-text-light font-bold">{format(max)}</span>
            </div>
        </div>
    );
}

function ResultCard({ invested, returns, maturity }) {
    const pct = Math.round((returns / invested) * 100);
    return (
        <div className="bg-[#f8f8f9] rounded-3xl p-8 space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text-light">Invested Amount</span>
                <span className="text-lg font-black text-text-dark">{formatINR(invested)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text-light">Est. Returns</span>
                <span className="text-lg font-black text-primary">+{formatINR(returns)} ({pct}%)</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-black text-text-dark">Total Value</span>
                <span className="text-2xl font-black text-text-dark">{formatINR(maturity)}</span>
            </div>
            {/* Visual bar */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                <div className="bg-primary transition-all duration-700 rounded-full" style={{ width: `${Math.min(100, (invested / maturity) * 100)}%` }} />
                <div className="bg-emerald-300 flex-1 rounded-r-full" />
            </div>
            <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary inline-block" />Invested</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-300 inline-block" />Returns</span>
            </div>
        </div>
    );
}

export default function Calculator() {
    const [searchParams] = useSearchParams();
    const initialType = searchParams.get("type") || "sip";
    const [active, setActive] = useState(initialType);

    const components = { sip: <SIPCalculator />, lumpsum: <LumpsumCalculator />, swp: <SWPCalculator />, brokerage: <BrokerageCalculator /> };

    return (
        <div className="min-h-screen bg-[#f8f8f9] py-16 pb-32 font-inter">
            <div className="container mx-auto px-4 lg:px-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">Free Tools</p>
                    <h1 className="text-4xl md:text-5xl font-black text-text-dark tracking-tight">Investment Calculators</h1>
                    <p className="text-text-light font-medium mt-4">Plan your financial future with accurate projections</p>
                </div>

                {/* Calculator selector */}
                <div className="flex flex-wrap gap-3 mb-10 justify-center">
                    {CALCULATORS.map((c) => (
                        <button
                            key={c.key}
                            onClick={() => setActive(c.key)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${active === c.key
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "bg-white text-text-light border border-gray-100 hover:border-primary/30 hover:text-primary"
                                }`}
                        >
                            <span>{c.icon}</span> {c.label}
                        </button>
                    ))}
                </div>

                {/* Calculator Panel */}
                <div className="bg-white rounded-[40px] p-10 md:p-14 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black text-text-dark mb-10 tracking-tight">
                        {CALCULATORS.find(c => c.key === active)?.label}
                    </h2>
                    {components[active]}

                    <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => window.location.href = "/register"}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-base transition-all shadow-xl shadow-primary/20 hover:-translate-y-px"
                        >
                            Start Investing Now →
                        </button>
                        <button
                            onClick={() => window.location.href = "/markets"}
                            className="flex-1 border border-gray-100 hover:border-primary/30 text-text-dark hover:text-primary py-5 rounded-2xl font-black text-base transition-all"
                        >
                            Explore Markets
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
