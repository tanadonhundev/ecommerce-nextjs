"use client"

import { useCartStore } from "@/lib/cart-store"
import { useEffect, useState } from "react";

export const AppCardTotal = () => {
  const total = useCartStore((state) => state.totalItems());  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  },[])

  if (!isMounted) return null;

  return <span className="text-sm">{total}</span>
}
