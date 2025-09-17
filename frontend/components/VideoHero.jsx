"use client";

import React from "react";

export default function VideoHero() {
  return (
    <section className="relative w-full">
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://www.allbirds.com/cdn/shop/videos/c/vp/444fb09bbc3e4614945c17f6a0dd7a35/444fb09bbc3e4614945c17f6a0dd7a35.HD-1080p-2.5Mbps-57056556.mp4?v=0"
          autoPlay
          playsInline
          muted
          loop
          aria-label="Brand video"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}


