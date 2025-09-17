"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearCart } from "@/store/cartSlice";
import { useDispatch } from "react-redux";

export default function CheckOutPage() {
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        shipping_address: "",
        payment: {
            card_number: "",
            expiry: "",
            cvv: ""
        }
    });

    const dispatch = useDispatch();

    const router = useRouter();

    const handleData = (e) => {
        e.preventDefault();

        if (!userInfo.name.trim()) {
            alert("Name is required");
            return;
        }

        if (!userInfo.email.trim()) {
            alert("Email is required");
            return;
        }

        console.log("Form submitted", userInfo);
        router.push("/ordersummary");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");

            setUserInfo((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setUserInfo((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    return (

        <div>
            <div class="w-screen h-screen flex items-center justify-center bg-gray-50 p-6">
                <div class="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">

                    <h2 class="text-3xl font-bold text-gray-800 mb-8">Checkout</h2>
                    <form onSubmit={handleData} class="space-y-6">

                        { /* Name */}
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={userInfo.name}
                                onChange={handleChange}
                                class="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="John Doe"
                            />
                        </div>

                        { /* Email */}
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                class="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        { /* Shipping Address */}
                        <div>
                            <label for="address" class="block text-sm font-medium text-gray-700">Shipping Address</label>
                            <textarea
                                id="address"
                                name="shipping_address"
                                rows="3"
                                value={userInfo.shipping_address}
                                onChange={handleChange}
                                class="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Street address, city, state, ZIP"
                            ></textarea>
                        </div>

                        { /* Payment Information Section */}
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>

                            <div class="space-y-4">

                                { /* Card Numbers */}
                                <div>
                                    <label for="card-number" class="block text-sm font-medium text-gray-700">Card Number</label>
                                    <input
                                        type="number"
                                        id="card-number"
                                        name="payment.card_number"
                                        value={userInfo.payment.card_number}
                                        onChange={handleChange}
                                        class="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="1234 5678 9012 3456"
                                    />
                                </div>

                                { /* Expiration and CVV in one row */}
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label for="expiry" class="block text-sm font-medium text-gray-700">Expiration Date</label>
                                        <input
                                            type="number"
                                            id="expiry"
                                            name="payment.expiry"
                                            value={userInfo.payment.expiry}
                                            onChange={handleChange}
                                            class="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="MM/YY"
                                        />
                                    </div>

                                    <div>
                                        <label for="cvv" class="block text-sm font-medium text-gray-700">CVV</label>
                                        <input
                                            type="number"
                                            id="cvv"
                                            name="payment.cvv"
                                            value={userInfo.payment.cvv}
                                            onChange={handleChange}
                                            class="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        { /* Place Order Button */}
                        <div>
                            <button
                                class="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                type="submit"
                                onClick={() => dispatch(clearCart())}>
                                Place Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}