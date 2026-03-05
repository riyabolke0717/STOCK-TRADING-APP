import { useState } from "react";

export default function InputField({
  label,
  type = "text",
  placeholder,
  register,
  name,
  required,
  pattern,
  minLength,
  validate,
  error
}) {
  const [liveValue, setLiveValue] = useState("");

  // Check if email is valid format
  const isValidEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  // Show valid indicator for email fields
  const isEmailField = name === "email";
  const showValidIndicator = isEmailField && liveValue && isValidEmail(liveValue) && error === undefined;

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, {
            required,
            pattern,
            minLength,
            validate,
            onChange: (e) => setLiveValue(e.target.value)
          })}
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 pr-10 ${error
              ? "border-red-500 focus:ring-red-200 bg-red-50"
              : showValidIndicator
                ? "border-green-500 focus:ring-green-200 bg-green-50"
                : "border-gray-300 focus:ring-primary/20 focus:border-primary"
            }`}
        />

        {/* Validation Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {showValidIndicator && (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {error && (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center mt-1">
          <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 text-xs">{error.message}</p>
        </div>
      )}

      {/* Email hint - shown when email has content but not yet valid */}
      {isEmailField && liveValue && !isValidEmail(liveValue) && !error && (
        <p className="text-orange-500 text-xs mt-1">Please enter a valid email (e.g., name@example.com)</p>
      )}
    </div>
  );
}
