"use client";

import React from "react";
import { useGetCartQuery } from "@/features/api/apiSlice";

export default function CartPageContent() {
    const { data: cart = [], isLoading, isError } = useGetCartQuery();

    if (isLoading) return <div>Loading cart…</div>;
    if (isError) return <div>Failed to load cart.</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <h2 className="text-2xl font-bold">
                Cart <span className="text-gray-500 text-lg">(3 items)</span>
            </h2>

            {/* Cart Items Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cart.cart_items?.map((c) => (
                    <div key={c.index} className="rounded-2xl shadow-md p-4 flex flex-col items-center bg-white">
                        <img
                            src={c.image}
                            alt={c.title}
                            loading="lazy"
                            className="w-32 h-32 object-contain"
                        />
                        <p className="mt-2 font-semibold">{c.title}</p>
                        <p className="text-gray-600">${c.price}</p>
                    </div>
                ))}
            </div>

            {/* Recommended Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Recommended for you</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl shadow-md p-4 flex flex-col items-center bg-white"
                        >
                            <p className="mt-2 font-semibold">Product {item}</p>
                            <p className="text-gray-600">$50</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtotal + Checkout */}
            <div className="flex flex-col items-end space-y-4">
                <p className="text-lg font-medium">
                    Subtotal: <span className="font-bold">$295</span>
                </p>

                <button className="w-full md:w-1/3 bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition">
                    Proceed to Checkout
                </button>

                {/* Payment Method Buttons */}
                <div className="flex flex-wrap gap-3 w-full md:w-1/3 justify-center md:justify-end">
                    <button className="flex-1 bg-yellow-400 text-black py-2 rounded-md font-medium hover:bg-yellow-500 transition">
                        Amazon Pay
                    </button>
                    <button className="flex-1 bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition">
                        PayPal
                    </button>
                    <button className="flex-1 bg-pink-500 text-white py-2 rounded-md font-medium hover:bg-pink-600 transition">
                        ShopPay
                    </button>
                </div>
            </div>
        </div>
    );
}
