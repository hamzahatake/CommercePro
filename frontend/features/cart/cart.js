import {
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useUpdateCartMutation,
} from "../api/apiSlice";

export function useCartHandlers() {
    const [addToCart] = useAddToCartMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [updateCart] = useUpdateCartMutation();

    const handleAddToCart = async (product, quantity) => {
        try {
            return await addToCart({ product: product.id, quantity }).unwrap();
        } catch (err) {
            console.error("Add failed:", err);
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
