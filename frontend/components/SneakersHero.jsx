"use client";

import Image from "next/image";

export function SneakerBanner() {
    return(
        <div className="w-full h-[500px] overflow-hidden">
            <Image 
                src="/Banner/Banner.webp" 
                alt="Banner"
                width={1200}
                height={500}
                className="rounded-2xl w-full h-full object-cover object-top"
                priority
            />
        </div>
    )
}