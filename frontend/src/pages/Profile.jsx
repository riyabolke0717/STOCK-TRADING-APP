import React from 'react';

export default function Profile() {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

    return (
        <div className="min-h-screen bg-[#f8f8f9] pb-24 font-inter">
            <div className="container mx-auto px-4 lg:px-12 max-w-5xl pt-12">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Sidebar */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-black mb-6 shadow-xl shadow-primary/20">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <h2 className="text-2xl font-black text-text-dark tracking-tight">{user.name || "User Name"}</h2>
                            <p className="text-text-light font-bold text-xs uppercase tracking-widest mt-2">Member since 2024</p>

                            <div className="w-full mt-10 pt-10 border-t border-gray-50 space-y-4">
                                <button className="w-full py-4 px-6 bg-[#f8f8f9] hover:bg-primary/5 hover:text-primary rounded-2xl text-sm font-black transition-all text-left flex items-center justify-between group">
                                    <span>Personal Info</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                                <button className="w-full py-4 px-6 bg-white hover:bg-gray-50 rounded-2xl text-sm font-black text-text-light transition-all text-left">Bank & AutoPay</button>
                                <button className="w-full py-4 px-6 bg-white hover:bg-gray-50 rounded-2xl text-sm font-black text-text-light transition-all text-left">Documents</button>
                            </div>
                        </div>

                        <div className="bg-text-dark rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg">
                            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Portfolio Protection</p>
                            <h3 className="text-lg font-black mb-6 relative z-10">Verify your PAN</h3>
                            <button className="bg-primary text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-primary-dark transition-all relative z-10">START VERIFICATION</button>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl -mr-12 -mt-12"></div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-10">
                        <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-100 animate-slide-up">
                            <h1 className="text-3xl font-black text-text-dark tracking-tight mb-12">Personal Information</h1>

                            <div className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <InfoItem label="Full Name" value={user.name || "N/A"} />
                                    <InfoItem label="Email Address" value={user.email || "N/A"} />
                                    <InfoItem label="Mobile Number" value="+91 98765 43210" isVerified={true} />
                                    <InfoItem label="PAN Card" value="ABCDE1234F" isVerified={true} />
                                </div>

                                <div className="pt-10 border-t border-gray-50">
                                    <h3 className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-8">Security & Access</h3>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button className="flex-1 border border-gray-100 py-5 rounded-2xl font-black text-sm text-text-dark hover:bg-gray-50 transition-all">CHANGE PASSWORD</button>
                                        <button className="flex-1 border border-gray-100 py-5 rounded-2xl font-black text-sm text-text-dark hover:bg-gray-50 transition-all">MANAGE DEVICES</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-2xl font-black text-text-dark tracking-tight mb-8">Bank Accounts</h2>
                            <div className="bg-[#f8f8f9]/50 border border-dashed border-gray-200 p-10 rounded-[32px] text-center">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-6 text-2xl">🏦</div>
                                <p className="text-text-light font-bold text-sm mb-8 leading-relaxed">You haven't added a primary bank account yet. Connect your bank to start trading.</p>
                                <button className="bg-text-dark text-white px-10 py-4 rounded-2xl font-black text-xs hover:bg-black transition-all">ADD BANK ACCOUNT</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, isVerified = false }) {
    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black text-text-light uppercase tracking-widest">{label}</p>
            <div className="flex items-center">
                <p className="text-lg font-black text-text-dark">{value}</p>
                {isVerified && (
                    <span className="ml-3 bg-primary/10 text-primary text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">VERIFIED</span>
                )}
            </div>
        </div>
    );
}
