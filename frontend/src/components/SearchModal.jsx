import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-modal-scale"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className="p-5 border-b border-gray-100 flex items-center">
                    <svg className="w-6 h-6 text-primary mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-grow text-xl bg-transparent border-none outline-none text-text-dark font-medium placeholder-gray-400"
                        placeholder="Search stocks, mutual funds, ETFs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex items-center space-x-3">
                        <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200 rounded">ESC</kbd>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {!searchQuery && (
                    <div className="flex px-5 py-4 space-x-3 bg-gray-50/50">
                        {['All', 'Stocks', 'Mutual Funds', 'F&O'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === tab
                                    ? 'bg-white text-primary border border-primary/20'
                                    : 'text-text-light hover:bg-white hover:text-text-dark border border-transparent'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="max-h-[65vh] overflow-y-auto p-6">
                    {!searchQuery ? (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Popular on Nexxtrade</h3>
                                <button className="text-[10px] font-bold text-primary hover:underline">Clear History</button>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                                {[
                                    { name: 'HDFC Bank', symbol: 'HDFCBANK', price: '1,420.50', up: true, category: 'Stock' },
                                    { name: 'Reliance Industries', symbol: 'RELIANCE', price: '2,950.00', up: true, category: 'Stock' },
                                    { name: 'Infosys', symbol: 'INFY', price: '1,640.20', up: false, category: 'Stock' },
                                    { name: 'Tata Motors', symbol: 'TATAMOTORS', price: '980.75', up: true, category: 'Stock' },
                                    { name: 'Zomato Ltd', symbol: 'ZOMATO', price: '160.25', up: true, category: 'Stock' }
                                ].map((item) => (
                                    <Link
                                        key={item.symbol}
                                        to={`/stock/${item.symbol}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center mr-4 bg-white shadow-sm group-hover:border-primary/20">
                                                <span className="font-black text-xs text-primary">{item.symbol[0]}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-text-dark text-sm group-hover:text-primary transition-colors">{item.name}</div>
                                                <div className="text-[10px] font-bold text-text-light uppercase tracking-wider">{item.symbol} • {item.category}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-text-dark">₹{item.price}</div>
                                            <div className={`text-[10px] font-bold ${item.up ? 'text-primary' : 'text-danger'}`}>{item.up ? '↑' : '↓'} Trending</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-text-dark font-bold">Search for "{searchQuery}"</p>
                            <p className="text-sm text-text-light mt-2">Press Enter to see all results in stocks and funds</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
