import { Suspense } from "react";
import ProductsListContent from "@/components/products/ProductsListContent";

export const dynamic = "force-dynamic";

export default function ProductsListPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsListContent />
        </Suspense>
    );
}