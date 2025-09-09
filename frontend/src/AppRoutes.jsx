import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import ProductCard from "./components/ProductCard";
import CatalogCard from "./components/CatalogCard";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Home />
      <Routes>
      </Routes>
    </Router>
  );
};

export default AppRoutes;