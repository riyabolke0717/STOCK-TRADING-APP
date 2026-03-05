import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await response.json();

            if (response.ok) {
                setIsSent(true);
                toast.success("Instructions sent! Check your inbox.");
            } else {
                toast.error(result.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Failed to send reset link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f8f9] flex flex-col items-center justify-center p-6 font-inter">
            <div className="w-full max-w-[480px] animate-modal-scale">
                <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
                    {!isSent ? (
                        <>
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-text-dark tracking-tight leading-tight">Reset your password</h2>
                                <p className="text-text-light mt-3 font-bold">We'll send you instructions to reset your password.</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full px-6 py-4 rounded-2xl bg-[#f8f8f9] border border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark"
                                    />
                                    {errors.email && <p className="text-danger text-xs ml-1 font-bold">{errors.email.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 transform active:scale-[0.98] disabled:opacity-50 mt-4"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-3xl animate-bounce">
                                📧
                            </div>
                            <h2 className="text-3xl font-black text-text-dark tracking-tight mb-4">Check your email</h2>
                            <p className="text-text-light font-bold mb-10 leading-relaxed">
                                If an account exists for that email, we've sent instructions to reset your password.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}

                    {!isSent && (
                        <div className="mt-10 text-center">
                            <Link to="/login" className="text-text-light hover:text-primary font-bold text-sm transition-colors">
                                ← Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
