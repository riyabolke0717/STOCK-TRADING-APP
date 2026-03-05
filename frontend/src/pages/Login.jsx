import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Data discriminator: check if it's purely numbers
      const isPhone = /^[0-9]+$/.test(data.identifier);
      const payload = {
        password: data.password,
      };

      if (isPhone) {
        payload.phone = data.identifier;
      } else {
        payload.email = data.identifier;
      }

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(result));
        localStorage.setItem("authToken", result.token);

        toast.success(`Welcome back!`);
        window.dispatchEvent(new Event('authChange'));
        navigate("/markets");
      } else {
        toast.error(result.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f9] flex flex-col items-center justify-center p-6 font-inter">
      <div className="w-full max-w-[480px] animate-modal-scale">

        <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-text-dark tracking-tight">Login to Nexxtrade</h2>
            <p className="text-text-light mt-3 font-bold">Invest with India's most loved brokerage.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Mobile No / Email</label>
              <input
                {...register("identifier", {
                  required: "Mobile No or Email is required",
                })}
                type="text"
                placeholder="9876543210 or email@domain.com"
                className="w-full px-6 py-4 rounded-2xl bg-[#f8f8f9] border border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark"
              />
              {errors.identifier && <p className="text-danger text-xs ml-1 font-bold">{errors.identifier.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-primary hover:underline">FORGOT?</Link>
              </div>
              <div className="relative">
                <input
                  {...register("password", { required: "Password is required" })}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-danger text-xs ml-1 font-bold">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 transform active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {isLoading ? "Connecting..." : "Continue"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-text-light font-bold text-sm">
              New to Nexxtrade?{" "}
              <Link to="/register" className="text-primary hover:underline ml-1">Create Account</Link>
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] text-text-light font-bold leading-relaxed max-w-[320px] mx-auto uppercase tracking-wider opacity-60">
          By continuing, you agree to Nexxtrade's terms of service and privacy policies.
        </p>
      </div>
    </div>
  );
}
