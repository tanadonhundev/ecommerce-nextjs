"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await authClient.getSession();

      if (!session) {
        router.replace("/login"); // ถ้าไม่มี session ให้ไปหน้า login
        return;
      }
      const paymentCompleted = localStorage.getItem("paymentCompleted");
      if (!paymentCompleted) {
        router.replace("/cart"); // ไม่ให้เข้ามาหน้านี้ ถ้ายังไม่ชำระเงิน
        return;
      }
      localStorage.removeItem("paymentCompleted")
      clearCart();
    };

    fetchSession();
  }, [clearCart, router]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-4">
        Thank you for your purchase. Your order is being processed.
      </p>
      <Link href="/product" className="text-blue-600 hover:underline">
        Continue Shopping
      </Link>
    </div>
  );
}
