"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import { store } from "@/store";
import AuthProvider from "@/components/auth/AuthProvider";
import { CartAnimationProvider } from "@/contexts/CartAnimationContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthProvider>
            <CartAnimationProvider>
              <Navbar />
              <main>{children}</main>
            </CartAnimationProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
