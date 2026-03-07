import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ResetPassword() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            navigate("/login");
        }
    }, [token, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPassword: data.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Password reset successfully! Log in with your new password.");
                navigate("/login");
            } else {
                toast.error(result.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const password = watch("password");

    return (
        <div className="min-h-screen bg-[#f8f8f9] flex flex-col items-center justify-center p-6 font-inter">
            <div className="w-full max-w-[480px] animate-modal-scale">
                <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-text-dark tracking-tight leading-tight">Create new password</h2>
                        <p className="text-text-light mt-3 font-bold">Please enter a strong new password for your account.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">New Password</label>
                            <div className="relative">
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Minimum 6 characters required" },
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 rounded-2xl bg-[#f8f8f9] border border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-text-light hover:text-text-dark"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={
                                                showPassword
                                                    ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                    : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            }
                                        />
                                    </svg>
                                </button>
                            </div>
                            {errors.password && <p className="text-danger text-xs ml-1 font-bold">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                            <input
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (val) => val === password || "Passwords do not match",
                                })}
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-6 py-4 rounded-2xl bg-[#f8f8f9] border border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark"
                            />
                            {errors.confirmPassword && <p className="text-danger text-xs ml-1 font-bold">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 transform active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <Link to="/login" className="text-text-light hover:text-primary font-bold text-sm transition-colors">
                            ← Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
