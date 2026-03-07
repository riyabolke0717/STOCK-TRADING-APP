import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch("http://localhost:5000/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    const errorData = await response.json();
                    if (response.status === 403) {
                        toast.error("Access denied. Admin only.");
                        navigate("/dashboard");
                    } else {
                        toast.error(errorData.message || "Failed to fetch users");
                    }
                }
            } catch (error) {
                console.error("Admin fetch error:", error);
                toast.error("An error occurred while fetching users.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleBlockUser = async (userId) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:5000/api/admin/block-user/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isBlocked: result.isBlocked } : user
                ));
                toast.success(result.message);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update user status");
            }
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8f8f9] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f8f9] p-8 font-inter">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-text-dark tracking-tight">Admin Dashboard</h1>
                        <p className="text-text-light font-bold mt-2">Manage your users and platform state.</p>
                    </div>
                    <Link to="/dashboard" className="bg-white border-2 border-gray-100 px-6 py-3 rounded-2xl font-black text-text-dark hover:bg-gray-50 transition-all shadow-sm">
                        ← Back to App
                    </Link>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#f8f8f9] border-b border-gray-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">User</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Email / Phone</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Balance</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Last ResetReq</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-text-light uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-text-dark">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">{user.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-text-dark">{user.email}</p>
                                            <p className="text-xs text-text-light">{user.phone}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-primary">₹{user.balance?.toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-text-light">
                                                {formatDate(user.lastResetRequest)}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isBlocked
                                                ? "bg-danger/10 text-danger"
                                                : "bg-success/10 text-success"
                                                }`}>
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {user.role !== "admin" && (
                                                <button
                                                    onClick={() => handleBlockUser(user._id)}
                                                    className={`px-5 py-2 rounded-xl font-black text-xs transition-all transform active:scale-95 ${user.isBlocked
                                                        ? "bg-success text-white hover:bg-success-dark shadow-lg shadow-success/20"
                                                        : "bg-danger text-white hover:bg-danger-dark shadow-lg shadow-danger/20"
                                                        }`}
                                                >
                                                    {user.isBlocked ? "Unblock" : "Block"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-text-light font-bold">No users found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
