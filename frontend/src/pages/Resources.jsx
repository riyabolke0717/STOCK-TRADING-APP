import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

const CONTENT = {
    'nifty-50': {
        title: "NIFTY 50 Index",
        desc: "The NIFTY 50 is a benchmark financial index representing the weighted average of 50 of the largest and most liquid Indian companies listed on the National Stock Exchange (NSE).",
        sections: [
            { subtitle: "Key Characteristics", text: "It covers 13 sectors of the Indian economy and is used for benchmarking fund portfolios, index funds, and ETFs." },
            { subtitle: "How it's Calculated", text: "Calculated using a free-float market capitalization weighted method, where the level of the index reflects the total market value of all the stocks in the index relative to a particular base period." }
        ]
    },
    'sensex': {
        title: "SENSEX Index",
        desc: "The S&P BSE SENSEX is the benchmark index of the Bombay Stock Exchange (BSE), comprising 30 prominent and liquid companies listed on the BSE.",
        sections: [
            { subtitle: "Significance", text: "It is one of the oldest stock market indices in India and is widely regarded as the pulse of the Indian stock market." },
            { subtitle: "Selection Criteria", text: "Stocks are selected based on market capitalization, liquidity, and continuity after a rigorous review process by the Index Committee." }
        ]
    },
    'market-cap': {
        title: "Understanding Market Cap",
        desc: "Market Capitalization (Market Cap) refers to the total dollar market value of a company's outstanding shares of stock.",
        sections: [
            { subtitle: "Formula", text: "Market Cap = Current Stock Price x Total Number of Outstanding Shares." },
            { subtitle: "Categories", text: "Large-cap (₹20,000 Cr+), Mid-cap (₹5,000 Cr - ₹20,000 Cr), and Small-cap (below ₹5,000 Cr)." }
        ]
    },
    'pe-ratio': {
        title: "P/E Ratio Explained",
        desc: "The Price-to-Earnings (P/E) ratio is a key valuation metric that compares a company's stock price to its earnings per share.",
        sections: [
            { subtitle: "What it tells you", text: "A high P/E could mean that a stock's price is high relative to earnings and possibly overvalued. Conversely, a low P/E might indicate that the current stock price is low relative to earnings." },
            { subtitle: "Usage", text: "Investors use P/E ratios to determine the relative value of a company's shares in an apples-to-apples comparison." }
        ]
    },
    'security': {
        title: "Bank-Grade Security",
        desc: "Nexxtrade employs state-of-the-art security measures to ensure your funds and data are protected at all times.",
        sections: [
            { subtitle: "Encryption", text: "All data transmissions are secured with 256-bit SSL encryption, the same level used by global financial institutions." },
            { subtitle: "Authentication", text: "Mandatory Two-Factor Authentication (2FA) for all login attempts and transaction requests ensures that only you can access your account." }
        ]
    },
    'trust': {
        title: "Trusted by Millions",
        desc: "Over 4 Crore investors trust Nexxtrade for their wealth creation journey.",
        sections: [
            { subtitle: "Regulation", text: "Nexxtrade is a SEBI registered entity and complies with all regulatory requirements of NSE and BSE." },
            { subtitle: "Transparency", text: "We maintain 100% transparency in our fee structure and execution policies. No hidden charges, ever." }
        ]
    },
    'ipo': {
        title: "Initial Public Offering (IPO)",
        desc: "An IPO is the process by which a private company lists its shares on a public stock exchange, allowing the general public to buy shares for the first time.",
        sections: [
            { subtitle: "Why Invest in IPOs?", text: "IPOs offer an opportunity to invest in potentially high-growth companies at an early stage. It's often where 'multi-bagger' journeys begin." },
            { subtitle: "The Process", text: "Companies file an RHP with SEBI. Investors apply during a 3-day window, and if demand exceeds supply, allotment is done proportionately or via lottery." }
        ]
    },
    'pro-terminal': {
        title: "Nexxtrade Pro 915 Terminal",
        desc: "Designed for elite traders who demand speed and precision. The 915 Terminal is our most advanced trading suite.",
        sections: [
            { subtitle: "Scalabiltiy & Speed", text: "Built on a high-throughput architecture that can handle 10,000+ orders per second with sub-millisecond latency." },
            { subtitle: "Advanced Toolset", text: "Includes multi-monitor support, drag-and-drop order slicing, and full API integration for algorithmic trading." }
        ]
    },
    'stocks': {
        title: "Equity Investing (Stocks)",
        desc: "Build long-term wealth by owning pieces of the world's most successful companies.",
        sections: [
            { subtitle: "Why Stocks?", text: "Equities historically outperform most asset classes over the long term. Own a share in company profits and growth through capital appreciation and dividends." },
            { subtitle: "How to Start", text: "Analyze fundamentals like P/E ratio and Market Cap, then use our high-speed terminal to place orders instantly with zero commission on delivery." }
        ]
    },
    'fo': {
        title: "Futures & Options (F&O)",
        desc: "Master the markets with advanced derivative instruments for hedging and speculation.",
        sections: [
            { subtitle: "Leverage Power", text: "F&O allows you to control large contract values with a fraction of the capital (margin), magnifying your potential returns." },
            { subtitle: "Risk Management", text: "Use options to protect your portfolio against market downturns or generate income through premium collection strategies like covered calls." }
        ]
    },
    'mf': {
        title: "Mutual Funds",
        desc: "Professional wealth management for everyone. Let experts manage your money while you relax.",
        sections: [
            { subtitle: "Diversification", text: "Invest in a basket of diversified assets across Equity, Debt, and Hybrid categories to minimize risk." },
            { subtitle: "SIP Investing", text: "Start with as little as ₹100 per month. Systematic Investment Plans (SIP) help you build a massive corpus using the power of compounding." }
        ]
    },
    'us-stocks': {
        title: "US Equity Markets",
        desc: "Invest in global giants like Apple, Google, and Amazon directly from India.",
        sections: [
            { subtitle: "Global Diversification", text: "Protect your portfolio against domestic market volatility and rupee depreciation by owning dollar-denominated assets." },
            { subtitle: "Fractional Investing", text: "No need to buy a full share. Start with as little as $1 and grow your global portfolio at your own pace." }
        ]
    },
    'fd': {
        title: "Fixed Deposits (FD)",
        desc: "Secure, predictable returns with the safety of traditional banking.",
        sections: [
            { subtitle: "Safety First", text: "Enjoy guaranteed returns regardless of stock market fluctuations. Ideal for short-term goals and emergency funds." },
            { subtitle: "Flexibility", text: "Choose from multiple tenures and interest payout options. Withdraw anytime with minimal exit loads." }
        ]
    },
    'careers': {
        title: "Careers at Nexxtrade",
        desc: "Help us build the future of Indian fintech. We're looking for stars to join the mission.",
        sections: [
            { subtitle: "Our Culture", text: "We value ownership, transparency, and speed. We're a 'default-to-open' organization where the best ideas win." },
            { subtitle: "Open Roles", text: "We're always hiring for Engineering, Product, Design, and Quant Research. Build products that impact 4Cr+ lives." }
        ]
    },
    'media': {
        title: "Media & Press",
        desc: "Stay updated with Nexxtrade's latest news, press releases, and corporate announcements.",
        sections: [
            { subtitle: "Company News", text: "Read about our latest funding rounds, partnership announcements, and feature launches that are disrupting the industry." },
            { subtitle: "Brand Assets", text: "Download official logos, executive headshots, and brand guidelines for media use." }
        ]
    },
    'privacy': {
        title: "Privacy & Data Protection",
        desc: "Control over your data is a fundamental human right. At Nexxtrade, we treat it as such.",
        sections: [
            { subtitle: "Data Handling", text: "Your personal and financial data is encrypted at rest and in transit. We never sell your data to third-party advertisers." },
            { subtitle: "Your Rights", text: "You have full control over your data. Requests for data deletion or portability are handled within 24 hours." }
        ]
    },
    'help': {
        title: "Help & Support Center",
        desc: "We're here to help you at every step of your financial journey.",
        sections: [
            { subtitle: "Customer Support", text: "Reach out to our support team via live chat in the app or email us at support@nexxtrade.com. We typically respond within 15 minutes." },
            { subtitle: "FAQs", text: "Visit our comprehensive knowledge base for instant answers on account setup, stock orders, and withdrawal processes." }
        ]
    },
    'explore-stocks': {
        title: "Explore the Share Market",
        desc: "Knowledge is the greatest asset in the stock market. Learn how to discover and analyze investment opportunities.",
        sections: [
            { subtitle: "Finding Opportunities", text: "Use filters like high-growth sectors, dividend-paying companies, or stocks hitting 52-week highs to narrow down your search." },
            { subtitle: "Next Steps", text: "Once you find a stock, dive into its financials, check peer comparisons, and view analyst ratings on the Stock Detail page." }
        ]
    },
    'etf': {
        title: "Exchange Traded Funds (ETFs)",
        desc: "ETFs combine the diversification of a mutual fund with the real-time tradability of a stock.",
        sections: [
            { subtitle: "How ETFs Work", text: "An ETF is a basket of securities that tracks an underlying index (like Nifty 50 or Gold). You can buy and sell units throughout the trading day at live market prices." },
            { subtitle: "Benefits", text: "Lower expense ratios compared to most mutual funds, and no lock-in periods. Perfect for tracking long-term index growth with full liquidity." }
        ]
    },
    'top-gainers': {
        title: "Understanding Top Gainers",
        desc: "Top Gainers are stocks that have seen the highest percentage increase in price during the current trading session.",
        sections: [
            { subtitle: "Why it Matters", text: "Gainers often highlight where the 'smart money' is flowing. High upward movement can indicate positive news, strong quarterly results, or a sector-wide rally." },
            { subtitle: "Investor Tip", text: "While high gains are exciting, always check if the movement is backed by solid fundamentals or just short-term speculation before jumping in." }
        ]
    },
    'top-losers': {
        title: "Understanding Top Losers",
        desc: "Top Losers are stocks that have declined the most in value during the trading day.",
        sections: [
            { subtitle: "Market Sentiment", text: "A stock appearing in the losers list might be reacting to negative news, poor earnings, or a broader market correction. It can also point to institutional profit-booking." },
            { subtitle: "Contrarian View", text: "For value investors, the losers list can sometimes reveal 'oversold' quality stocks that are now trading at attractive valuations." }
        ]
    },
    '52w-high': {
        title: "52-Week High Breakdown",
        desc: "The 52-week high is the highest price at which a stock has traded during the previous year.",
        sections: [
            { subtitle: "Technical Strength", text: "When a stock breaks its 52-week high, it often signals strong 'momentum.' This suggests that the stock is in a sustained uptrend with high buyer demand." },
            { subtitle: "Resistance & Breakouts", text: "Traders watch these levels closely. A breakout above a 52-week high is considered a bullish signal in technical analysis." }
        ]
    },
    'option-chain': {
        title: "Mastering the Option Chain",
        desc: "The Option Chain is the heartbeat of derivative trading, showing all available option contracts for a specific security.",
        sections: [
            { subtitle: "Calls vs Puts", text: "View open interest (OI), volume, and Greeks for both bullish (Calls) and bearish (Puts) positions across multiple strike prices." },
            { subtitle: "ATM, ITM, and OTM", text: "Understand the moneyness of options. At-the-Money (ATM), In-the-Money (ITM), and Out-of-the-Money (OTM) help you decide the risk-reward ratio for your trade." }
        ]
    },
    'trading-strategies': {
        title: "F&O Trading Strategies",
        desc: "Level up from simple buying to advanced multi-leg strategies for every market condition.",
        sections: [
            { subtitle: "Bullish & Bearish", text: "Learn to deploy Bull Call Spreads or Bear Put Spreads to limit your risk while maintaining upside potential." },
            { subtitle: "Neutral Strategies", text: "Profit from market stagnation or high volatility using Iron Condors and Straddles. Ideal for 'sideways' markets or result-day plays." }
        ]
    },
    'pcr-ratio': {
        title: "Put/Call Ratio (PCR)",
        desc: "The PCR is a powerful sentiment indicator used to gauge the overall mood of the market.",
        sections: [
            { subtitle: "Interpreting PCR", text: "A PCR above 1.0 typically suggests bearish sentiment (more Puts being bought), while a PCR below 1.0 suggests bullishness." },
            { subtitle: "Contrarian Indicator", text: "Extreme values (e.g., PCR > 1.6) often act as contrarian signals, suggesting the market is 'oversold' and a bounce back might be imminent." }
        ]
    },
    'index-futures': {
        title: "Index Futures Trading",
        desc: "Trade the movement of entire market indices like NIFTY 50 and BANK NIFTY.",
        sections: [
            { subtitle: "Broad Exposure", text: "Index futures allow you to take a position on the health of the entire economy rather than individual stocks." },
            { subtitle: "Hedging Power", text: "Institutional investors use index futures to hedge their entire equity portfolios against broad market downturns." }
        ]
    },
    'stock-futures': {
        title: "Single Stock Futures",
        desc: "Gain high-leverage exposure to individual blue-chip stocks without owning the underlying shares.",
        sections: [
            { subtitle: "Contract Details", text: "Each stock future has a fixed lot size and expiry date (usually the last Thursday of the month)." },
            { subtitle: "Cash vs Physical", text: "Trading futures requires maintaining a margin. Always be aware of the daily MTM (Mark-to-Market) settlements to avoid margin calls." }
        ]
    }
};

export default function Resources() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type") || 'nifty-50';
    const data = CONTENT[type] || CONTENT['nifty-50'];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

    return (
        <div className="min-h-screen bg-[#f8f8f9] py-20 font-inter">
            <div className="container mx-auto px-4 lg:px-12 max-w-4xl">
                <Link to="/markets" className="inline-flex items-center text-primary font-black text-xs uppercase tracking-widest mb-10 hover:translate-x--1 transition-transform">
                    ← Back to Markets
                </Link>

                <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-sm border border-gray-100 animate-fade-in">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Nexxtrade Insights</p>
                    <h1 className="text-4xl md:text-5xl font-black text-text-dark tracking-tight leading-tight mb-8">
                        {data.title}
                    </h1>
                    <p className="text-xl text-text-light font-medium leading-relaxed mb-12">
                        {data.desc}
                    </p>

                    <div className="space-y-12">
                        {data.sections.map((sec, i) => (
                            <div key={i} className="space-y-4">
                                <h3 className="text-xl font-black text-text-dark">{sec.subtitle}</h3>
                                <p className="text-text-light leading-loose font-medium">
                                    {sec.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 pt-10 border-t border-gray-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
                        <div className="text-center sm:text-left">
                            <p className="font-black text-text-dark">Ready to take the next step?</p>
                            <p className="text-sm text-text-light font-medium">Join 4Cr+ investors on Nexxtrade today.</p>
                        </div>
                        <Link to="/register" className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all">
                            Open Free Account
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs font-bold text-text-light/50 uppercase tracking-widest">
                        Disclaimer: Information provided is for educational purposes only.
                    </p>
                </div>
            </div>
        </div>
    );
}
