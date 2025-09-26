"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Upload, Save, X, Plus, Trash2, Palette, Ruler } from "lucide-react";
import { useAddProductMutation, useGetCategoriesQuery } from "@/features/api/apiSlice";

export default function CreateProductPage() {
    const router = useRouter();
    const [addProduct, { isLoading }] = useAddProductMutation();
    const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
    
    // Debug categories
    useEffect(() => {
        console.log('Categories data:', categories);
        console.log('Categories loading:', categoriesLoading);
        console.log('Categories error:', categoriesError);
    }, [categories, categoriesLoading, categoriesError]);
    
    const [formData, setFormData] = useState({
        title: '',
        badge: '',
        description: '',
        base_price: '',
        price: '',
        category_id: '',
        is_active: true,
        variants: [
            {
                color_name: '',
                hex_code: '',
                price_override: '',
                images: [],
                sizes: [
                    { size_label: '', stock: 0 }
                ]
            }
        ]
    });
    
    const [errors, setErrors] = useState({});
    const [imagePreviews, setImagePreviews] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleVariantChange = (variantIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, index) => 
                index === variantIndex ? { ...variant, [field]: value } : variant
            )
        }));
    };

    const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, vIndex) => 
                vIndex === variantIndex 
                    ? {
                        ...variant,
                        sizes: variant.sizes.map((size, sIndex) => 
                            sIndex === sizeIndex ? { ...size, [field]: value } : size
                        )
                    }
                    : variant
            )
        }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, {
                color_name: '',
                hex_code: '',
                price_override: '',
                images: [],
                sizes: [{ size_label: '', stock: 0 }]
            }]
        }));
    };

    const removeVariant = (variantIndex) => {
        if (formData.variants.length > 1) {
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.filter((_, index) => index !== variantIndex)
            }));
        }
    };

    const addSize = (variantIndex) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, index) => 
                index === variantIndex 
                    ? { ...variant, sizes: [...variant.sizes, { size_label: '', stock: 0 }] }
                    : variant
            )
        }));
    };

    const removeSize = (variantIndex, sizeIndex) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, vIndex) => 
                vIndex === variantIndex 
                    ? { ...variant, sizes: variant.sizes.filter((_, sIndex) => sIndex !== sizeIndex) }
                    : variant
            )
        }));
    };

    const handleImageChange = (variantIndex, file) => {
        if (file) {
            const currentVariant = formData.variants[variantIndex];
            const newImageIndex = currentVariant.images.length;
            
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.map((variant, index) => 
                    index === variantIndex 
                        ? { ...variant, images: [...variant.images, file] }
                        : variant
                )
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => ({
                    ...prev,
                    [`${variantIndex}-${newImageIndex}`]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (variantIndex, imageIndex) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, vIndex) => 
                vIndex === variantIndex 
                    ? { ...variant, images: variant.images.filter((_, iIndex) => iIndex !== imageIndex) }
                    : variant
            )
        }));
        
        // Clean up preview
        setImagePreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[`${variantIndex}-${imageIndex}`];
            return newPreviews;
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) newErrors.title = 'Product title is required';
        if (!formData.description.trim()) newErrors.description = 'Product description is required';
        if (!formData.base_price || parseFloat(formData.base_price) <= 0) newErrors.base_price = 'Valid base price is required';
        if (!formData.category_id) newErrors.category_id = 'Category is required';
        
        // Validate variants
        formData.variants.forEach((variant, vIndex) => {
            if (!variant.color_name.trim()) {
                newErrors[`variant_${vIndex}_color`] = 'Color name is required';
            }
            if (variant.sizes.length === 0) {
                newErrors[`variant_${vIndex}_sizes`] = 'At least one size is required';
            }
            variant.sizes.forEach((size, sIndex) => {
                if (!size.size_label.trim()) {
                    newErrors[`variant_${vIndex}_size_${sIndex}_label`] = 'Size label is required';
                }
                if (size.stock < 0) {
                    newErrors[`variant_${vIndex}_size_${sIndex}_stock`] = 'Stock must be non-negative';
                }
            });
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            const formDataToSend = new FormData();
            
            // Add basic product fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('base_price', formData.base_price);
            if (formData.price) formDataToSend.append('price', formData.price);
            if (formData.badge) formDataToSend.append('badge', formData.badge);
            formDataToSend.append('category_id', formData.category_id);
            formDataToSend.append('is_active', formData.is_active);
            
            // Add variants data
            formDataToSend.append('variants', JSON.stringify(formData.variants.map(variant => ({
                color_name: variant.color_name,
                hex_code: variant.hex_code,
                price_override: variant.price_override || null,
                sizes: variant.sizes.map(size => ({
                    size_label: size.size_label,
                    stock: parseInt(size.stock)
                }))
            }))));
            
            // Add images for each variant
            formData.variants.forEach((variant, vIndex) => {
                variant.images.forEach((image, iIndex) => {
                    formDataToSend.append(`variant_${vIndex}_image_${iIndex}`, image);
                });
            });
            
            await addProduct(formDataToSend).unwrap();
            alert('Product created successfully!');
            router.push('/vendor/products');
        } catch (error) {
            console.error('Error creating product:', error);
            if (error.data) {
                setErrors(error.data);
            } else {
                alert('Failed to create product. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
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
                            <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
                            <p className="text-gray-600">Add a new product to your store</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter product title"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            {/* Badge */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Badge
                                </label>
                                <input
                                    type="text"
                                    name="badge"
                                    value={formData.badge}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="e.g., New, Sale, Limited"
                                />
                            </div>

                            {/* Base Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Base Price ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="base_price"
                                    value={formData.base_price}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.base_price ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                />
                                {errors.base_price && <p className="text-red-500 text-sm mt-1">{errors.base_price}</p>}
                            </div>

                            {/* Price Override */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Override ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Optional price override"
                                />
                            </div>

                            {/* Category */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.category_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={categoriesLoading}
                                >
                                    <option value="">Select a category</option>
                                    {categoriesLoading ? (
                                        <option value="" disabled>Loading categories...</option>
                                    ) : categoriesError ? (
                                        <option value="" disabled>Error loading categories</option>
                                    ) : categories && categories.length > 0 ? (
                                        categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No categories available</option>
                                    )}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                            </div>

                            {/* Active Status */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Product is active</span>
                                </label>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter product description"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            {/* Product Variants */}
                            <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Variants *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Variant
                                    </button>
                                </div>
                                
                                {/* Variants List */}
                                <div className="space-y-6">
                                    {formData.variants.map((variant, variantIndex) => (
                                        <div key={variantIndex} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-medium text-gray-900">
                                                    Variant {variantIndex + 1}
                                                </h4>
                                                {formData.variants.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(variantIndex)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {/* Color Name */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Color Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={variant.color_name}
                                                        onChange={(e) => handleVariantChange(variantIndex, 'color_name', e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                            errors[`variant_${variantIndex}_color`] ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                        placeholder="e.g., Black, White, Red"
                                                    />
                                                    {errors[`variant_${variantIndex}_color`] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors[`variant_${variantIndex}_color`]}</p>
                                                    )}
                                                </div>

                                                {/* Hex Code */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Hex Code
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            value={variant.hex_code || '#000000'}
                                                            onChange={(e) => handleVariantChange(variantIndex, 'hex_code', e.target.value)}
                                                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={variant.hex_code}
                                                            onChange={(e) => handleVariantChange(variantIndex, 'hex_code', e.target.value)}
                                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            placeholder="#000000"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Price Override */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Price Override ($)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={variant.price_override}
                                                        onChange={(e) => handleVariantChange(variantIndex, 'price_override', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Optional price override"
                                                    />
                                                </div>
                                            </div>

                                            {/* Images */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Images
                                                </label>
                                    <div className="flex items-center gap-4">
                                                    <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                                                        <Upload className="w-4 h-4" />
                                                        Add Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                            onChange={(e) => handleImageChange(variantIndex, e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                                
                                                {/* Image Previews */}
                                                {variant.images.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {variant.images.map((image, imageIndex) => (
                                                            <div key={imageIndex} className="relative">
                                                                <img
                                                                    src={imagePreviews[`${variantIndex}-${imageIndex}`] || URL.createObjectURL(image)}
                                                                    alt={`Variant ${variantIndex + 1} image ${imageIndex + 1}`}
                                                                    className="w-20 h-20 object-cover rounded-lg border"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(variantIndex, imageIndex)}
                                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Sizes */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Sizes *
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => addSize(variantIndex)}
                                                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        Add Size
                                                    </button>
                                                </div>
                                                
                                                {errors[`variant_${variantIndex}_sizes`] && (
                                                    <p className="text-red-500 text-sm mb-2">{errors[`variant_${variantIndex}_sizes`]}</p>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {variant.sizes.map((size, sizeIndex) => (
                                                        <div key={sizeIndex} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                                                            <div className="flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={size.size_label}
                                                                    onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'size_label', e.target.value)}
                                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                                        errors[`variant_${variantIndex}_size_${sizeIndex}_label`] ? 'border-red-500' : 'border-gray-300'
                                                                    }`}
                                                                    placeholder="Size (e.g., 8, 9, 10)"
                                                                />
                                                                {errors[`variant_${variantIndex}_size_${sizeIndex}_label`] && (
                                                                    <p className="text-red-500 text-xs mt-1">{errors[`variant_${variantIndex}_size_${sizeIndex}_label`]}</p>
                                                                )}
                                                            </div>
                                                            <div className="w-20">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={size.stock}
                                                                    onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'stock', parseInt(e.target.value) || 0)}
                                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                                        errors[`variant_${variantIndex}_size_${sizeIndex}_stock`] ? 'border-red-500' : 'border-gray-300'
                                                                    }`}
                                                                    placeholder="Stock"
                                                                />
                                                                {errors[`variant_${variantIndex}_size_${sizeIndex}_stock`] && (
                                                                    <p className="text-red-500 text-xs mt-1">{errors[`variant_${variantIndex}_size_${sizeIndex}_stock`]}</p>
                                                                )}
                                                            </div>
                                                            {variant.sizes.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeSize(variantIndex, sizeIndex)}
                                                                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/vendor/dashboard')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
