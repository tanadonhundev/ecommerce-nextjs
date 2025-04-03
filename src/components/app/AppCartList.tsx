"use client";

import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppCartList() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.totalPrice());

  if (items.length === 0) {
    return <p className="text-center mt-20">ตะกร้าสินค้าว่างเปล่า 🛒</p>;
  }

  console.log(items);

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl mt-20">
      <h1 className="text-xl font-semibold mb-4">ตะกร้าสินค้า</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>สินค้า</TableHead>
            <TableHead>จำนวน</TableHead>
            <TableHead>ราคา</TableHead>
            <TableHead>รวม</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{item.price.toLocaleString()}฿</TableCell>
              <TableCell>{(item.price * item.qty).toLocaleString()}฿</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="text-right mt-4 font-semibold">
        รวมทั้งหมด: {total.toLocaleString()}฿
      </div>

      <div className="text-right mt-6">
        <Button onClick={handleCheckout} className="bg-green-500 text-white">
          ดำเนินการชำระเงิน
        </Button>
      </div>
    </div>
  );
}
