import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";

export default function Wallet() {
    const [amount, setAmount] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const response = await fetch("http://localhost:5000/api/wallet/transactions", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setTransactions(data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        setCurrentUser(user);

        const handleAuthChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            setCurrentUser(updatedUser);
        };

        window.addEventListener('authChange', handleAuthChange);
        fetchTransactions();

        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    const handleDeposit = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return toast.error("Please enter a valid amount.");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:5000/api/wallet/deposit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ amount: Number(amount) })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Successfully deposited ₹${amount}`);
                setAmount('');

                // Update local storage balance
                const updatedUser = { ...currentUser, balance: data.newBalance };
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
                window.dispatchEvent(new Event("authChange"));

                fetchTransactions();
            } else {
                toast.error(data.message || "Deposit failed");
            }
        } catch (error) {
            console.error("Deposit error:", error);
            toast.error("Failed to process deposit");
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
            return toast.error("Please enter a valid amount.");
        }

        if (Number(withdrawAmount) > userBalance) {
            return toast.error("Insufficient balance for withdrawal.");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:5000/api/wallet/withdraw", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ amount: Number(withdrawAmount) })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Successfully withdrew ₹${withdrawAmount}`);
                setWithdrawAmount('');
                setShowWithdrawModal(false);

                // Update local storage balance
                const updatedUser = { ...currentUser, balance: data.newBalance };
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
                window.dispatchEvent(new Event("authChange"));

                fetchTransactions();
            } else {
                toast.error(data.message || "Withdrawal failed");
            }
        } catch (error) {
            console.error("Withdraw error:", error);
            toast.error("Failed to process withdrawal");
        } finally {
            setLoading(false);
        }
    };

    const userBalance = currentUser?.balance ?? 0;

    // Calculate invested money
    const investedAmount = currentUser?.portfolio?.reduce((sum, item) => sum + (item.avg_price || item.avgPrice) * item.quantity, 0) || 0;

    return (
        <div className="min-h-screen bg-[#f8f8f9] pb-24 font-inter relative">
            <div className="container mx-auto px-4 lg:px-12 max-w-5xl pt-12">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Balance Card */}
                    <div className="flex-1 space-y-10">
                        <div className="bg-white rounded-[48px] p-12 shadow-sm border border-gray-100 animate-slide-up">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <p className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-3">Available Balance</p>
                                    <h1 className="text-5xl font-black text-text-dark tracking-tighter">₹{userBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                                </div>
                                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-3xl">💰</div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-12">
                                <div className="p-8 bg-[#f8f8f9] rounded-3xl border border-gray-50 hover:border-primary/20 transition-all cursor-pointer group">
                                    <p className="text-[10px] font-black text-text-light uppercase tracking-widest mb-2">Used for stocks</p>
                                    <p className="text-lg font-black text-text-dark group-hover:text-primary transition-colors">₹{investedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="p-8 bg-[#f8f8f9] rounded-3xl border border-gray-50 hover:border-danger/20 transition-all cursor-pointer group">
                                    <p className="text-[10px] font-black text-text-light uppercase tracking-widest mb-2">Withdrawable</p>
                                    <p className="text-lg font-black text-text-dark group-hover:text-danger transition-colors">₹{userBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-gray-50">
                                <h3 className="text-xl font-black text-text-dark tracking-tight">Add Money to Wallet</h3>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-text-dark">₹</span>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        className="w-full bg-[#f8f8f9] border-2 border-transparent focus:border-primary/30 outline-none px-12 py-6 rounded-[24px] text-2xl font-black text-text-dark transition-all placeholder:text-gray-300"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['+1000', '+5000', '+10000'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(prev => (parseInt(prev || 0) + parseInt(val.replace('+', ''))).toString())}
                                            className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-text-light hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all"
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleDeposit}
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-6 rounded-[24px] font-black text-lg transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95">
                                    {loading ? 'PROCESSING...' : 'ADD MONEY'}
                                </button>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-text-dark tracking-tight">Wallet Transactions</h2>
                                <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Download History</button>
                            </div>
                            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                                {transactions.length === 0 ? (
                                    <div className="p-10 text-center text-text-light font-bold">No recent transactions found.</div>
                                ) : (
                                    transactions.map(trx => (
                                        <TransactionItem
                                            key={trx._id}
                                            type={trx.type === 'deposit' ? 'Add' : 'Withdraw'}
                                            status="Success"
                                            amount={`${trx.type === 'deposit' ? '+' : '-'} ₹${trx.amount.toLocaleString('en-IN')}`}
                                            date={new Date(trx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Side Info */}
                    <div className="w-full md:w-80 space-y-8">
                        <div className="bg-text-dark rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -mr-16 -mt-16"></div>
                            <h3 className="text-lg font-black mb-4 relative z-10">Smart Withdrawal</h3>
                            <p className="text-white/60 font-medium text-sm mb-8 leading-relaxed relative z-10">Get your funds credited back to your bank account within 2 hours with our express payouts.</p>
                            <button
                                onClick={() => setShowWithdrawModal(true)}
                                className="w-full bg-white text-text-dark py-4 rounded-2xl font-black text-xs hover:bg-primary hover:text-white transition-all relative z-10">
                                WITHDRAW FUNDS
                            </button>
                        </div>

                        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                            <h4 className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-6">Payment Methods</h4>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 p-4 bg-[#f8f8f9] rounded-2xl">
                                    <span className="text-xl">💳</span>
                                    <div>
                                        <p className="text-sm font-black text-text-dark">HDFC Bank •••• 1234</p>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Primary UPI</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-4 rounded-2xl text-[10px] font-black text-text-light hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all uppercase tracking-widest">
                                Manage Methods
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-text-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-md animate-modal-scale relative">
                        <button
                            onClick={() => setShowWithdrawModal(false)}
                            className="absolute top-8 right-8 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-text-light hover:bg-danger/10 hover:text-danger hover:rotate-90 transition-all">
                            ✕
                        </button>
                        <h2 className="text-2xl font-black text-text-dark tracking-tight mb-2">Withdraw Funds</h2>
                        <p className="text-sm font-bold text-text-light mb-8">Available: ₹{userBalance.toLocaleString('en-IN')}</p>

                        <div className="relative mb-8">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-text-dark">₹</span>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                className="w-full bg-[#f8f8f9] border-2 border-transparent focus:border-primary/30 outline-none px-12 py-5 rounded-[20px] text-2xl font-black text-text-dark transition-all placeholder:text-gray-300"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={loading || !withdrawAmount}
                            className="w-full bg-text-dark hover:bg-black disabled:bg-text-light text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95">
                            {loading ? 'PROCESSING...' : 'CONFIRM WITHDRAWAL'}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

function TransactionItem({ type, status, amount, date, sub, isPending = false }) {
    return (
        <div className="p-10 flex items-center justify-between hover:bg-[#f8f8f9]/50 transition-all group">
            <div className="flex items-center space-x-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${type === 'Add' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-light'}`}>
                    {type === 'Add' ? '↓' : '↑'}
                </div>
                <div>
                    <p className="font-black text-text-dark group-hover:text-primary transition-all">{type} Money</p>
                    <p className="text-[10px] font-black text-text-light uppercase tracking-widest mt-1">{date} {sub && `• ${sub}`}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-black tracking-tight ${amount.startsWith('+') ? 'text-primary' : 'text-text-dark'}`}>{amount}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isPending ? 'text-orange-500' : 'text-primary/60'}`}>{status}</p>
            </div>
        </div>
    );
}
