"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./infinite-moving-card";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="dark:bg-grid-white/[0.05] relative flex h-[20rem] flex-col items-center justify-center overflow-hidden rounded-md bg-white antialiased dark:bg-black">
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="slow"
        className="bg-slate-50"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "The case feels durable and I even got a compliment on the  design. Had the case for two and a half months now",
    name: "Charles Dickens",
    img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    quote:
      "I usually keep my phone together with my keys in my pocket and that led to some pretty heavy scratchmarks on all of my last phone cases. ",
    name: "William Shakespeare",
    img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    quote:
      "Absolutely love my custom phone case from CaseCrafter! The quality is amazing and the design is exactly what I wanted. It's so unique and makes my phone stand out.",
    name: "Edgar Allan Poe",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    quote:
      "The phone case customization process was super easy and fun. There are so many design options to choose from, and the preview tool helped me visualize the final product",
    name: "Jane Austen",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    quote:
      "The case itself is great! The design is beautiful and the material feels very durable. However, the shipping took a little longer than expected. Overall, I'm happy with my purchase and would recommend CaseCrafter with the caveat about potential longer shipping times",
    name: "Herman Melville",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
];
