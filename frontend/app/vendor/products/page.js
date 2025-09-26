"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useGetProductsQuery, useDeleteProductMutation } from "@/features/api/apiSlice";

export default function VendorProductsPage() {
    const router = useRouter();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    
    // Get vendor's products (you might need to modify the API to filter by vendor)
    const { data: products, isLoading, refetch } = useGetProductsQuery();
    
    const handleCreateProduct = () => {
        router.push('/vendor/products/create');
    };

    const handleEditProduct = (productId) => {
        router.push(`/vendor/products/${productId}/edit`);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId).unwrap();
                alert('Product deleted successfully!');
                refetch();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    const handleViewProduct = (productSlug) => {
        router.push(`/products/${productSlug}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/vendor/dashboard')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                                <p className="text-gray-600">Manage your product inventory</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCreateProduct}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                {products && products.results && products.results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.results.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                            >
                                {/* Product Image */}
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    {product.main_image ? (
                                        <img
                                            src={product.main_image}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Package className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xl font-bold text-gray-900">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Stock: {product.stock || 0}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewProduct(product.slug)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditProduct(product.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            disabled={isDeleting}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                        <p className="text-gray-600 mb-6">Start by adding your first product to your store.</p>
                        <button
                            onClick={handleCreateProduct}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors mx-auto"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Product
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
