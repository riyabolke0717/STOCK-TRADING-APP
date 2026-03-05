import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(result));
        localStorage.setItem("authToken", result.token);

        toast.success("Welcome to Nexxtrade!");
        window.dispatchEvent(new Event('authChange'));
        navigate("/markets");
      } else {
        toast.error(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f9] flex flex-col items-center justify-center p-6 font-inter">
      <div className="w-full max-w-[520px] animate-modal-scale">

        <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-text-dark tracking-tight">Create your account</h2>
            <p className="text-text-light mt-3 font-bold">Start your investing journey today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="John Doe"
                className="w-full px-6 py-4 rounded-2xl bg-[#f8f8f9] border border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark"
              />
              {errors.name && <p className="text-danger text-xs ml-1 font-bold">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
                type="email"
                placeholder="name@example.com"
                className="w-full px-6 py-4 rounded-2xl bg-[#f8f8f9] border border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark"
              />
              {errors.email && <p className="text-danger text-xs ml-1 font-bold">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Mobile Number</label>
              <input
                {...register("phone", {
                  required: "Mobile number is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Must be a valid 10-digit number" }
                })}
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                className="w-full px-6 py-4 rounded-2xl bg-[#f8f8f9] border border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark"
              />
              {errors.phone && <p className="text-danger text-xs ml-1 font-bold">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" }
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
              {isLoading ? "Creating Account..." : "Create Free Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-light font-bold text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline ml-1">Login</Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-text-light font-bold leading-relaxed max-w-[360px] mx-auto uppercase tracking-wider opacity-60">
          Nexxtrade takes your privacy seriously. By creating an account, you agree to our Terms and Policies.
        </p>
      </div>
    </div>
  );
}
