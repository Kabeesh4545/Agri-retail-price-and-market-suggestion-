import React from "react";

export default function Payment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-lime-600 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Payment Options</h2>

        <div className="flex flex-col gap-4">
          <button className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
            Online UPI
          </button>

          <button className="bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
            Debit / Credit Card
          </button>

          <button className="bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition">
            Cash on Delivery
          </button>
        </div>
      </div>
    </div>
  );
}
