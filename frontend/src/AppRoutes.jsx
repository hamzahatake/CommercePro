import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import { ProductsList } from "./pages/ProductsListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PDPReference from "./pages/PDPReference";


const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/pdp-ref" element={<PDPReference />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;