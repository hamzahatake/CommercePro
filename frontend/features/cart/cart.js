import {
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useUpdateCartMutation,
} from "../api/apiSlice";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";

export function useCartHandlers() {
    const dispatch = useDispatch();
    const [addToCart] = useAddToCartMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [updateCart] = useUpdateCartMutation();

    const handleAddToCart = async (product, quantity) => {
        console.log('Adding to cart:', { product: product.id, quantity, productData: product });
        
        // Always update Redux store first for immediate UI feedback
        dispatch(addItem({ product, quantity }));
        
        try {
            // API call in background
            const result = await addToCart({ product: product.id, quantity }).unwrap();
            console.log('API call successful:', result);
            return result;
        } catch (err) {
            console.error("Add failed:", err);
            console.log("API failed but local state updated");
            return null;
        }
    };

    const handleRemoveFromCart = async (product) => {
        try {
            return await removeFromCart({ product: product.id }).unwrap();
        } catch (err) {
            console.error("Remove failed:", err);
        }
    };

    const handleUpdateCart = async (product, quantity) => {
        try {
            return await updateCart({ product: product.id, quantity }).unwrap();
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return { handleAddToCart, handleRemoveFromCart, handleUpdateCart };
}
