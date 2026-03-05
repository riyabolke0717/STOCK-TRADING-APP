import { useState } from "react";
import { toast } from "react-toastify";

export default function TradeModal({ stock, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("BUY");

  if (!isOpen || !stock) return null;

  const totalAmount = stock.price * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/orders/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user123", // temporary static user
          symbol: stock.symbol,
          quantity: parseInt(quantity),
          price: stock.price,
          type: orderType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      toast.success(`${orderType} order placed successfully!`);
      setQuantity(1);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Order failed!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {orderType} {stock.symbol}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Price</span>
              <span className="text-2xl font-bold text-gray-800">
                ₹{stock.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("BUY")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold ${orderType === "BUY"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
                    }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("SELL")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold ${orderType === "SELL"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700"
                    }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-primary">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 text-white rounded-lg ${orderType === "BUY"
                    ? "bg-green-600"
                    : "bg-red-600"
                  }`}
              >
                {orderType} Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}