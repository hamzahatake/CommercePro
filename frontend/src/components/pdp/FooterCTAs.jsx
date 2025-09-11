import React from "react";

export default function FooterCTAs() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 border rounded-md p-4">
        <div className="font-medium">Sign up for updates</div>
        <form className="mt-2 flex gap-2" onSubmit={(e)=>e.preventDefault()} aria-label="Subscribe form">
          <input className="flex-1 border rounded-md px-3 py-2" placeholder="Your email" aria-label="Email" />
          <button className="px-4 py-2 rounded-md bg-black text-white" aria-label="Subscribe">Subscribe</button>
        </form>
      </div>
      <div className="flex-1 border rounded-md p-4">
        <div className="font-medium">Need help? Live chat or call us</div>
        <div className="mt-2 flex gap-3">
          <a href="#" className="underline" aria-label="Open live chat">Live Chat</a>
          <a href="tel:+1000000000" className="underline" aria-label="Call us">Call Us</a>
        </div>
      </div>
    </div>
  );
}


