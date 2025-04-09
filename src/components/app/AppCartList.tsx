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
import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function AppCartList() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearItem = useCartStore((state) => state.clearCart);
  
  const total = useCartStore((state) => state.totalPrice());

  if (items.length === 0) {
    return <p className="text-center mt-20">ตะกร้าสินค้าว่างเปล่า 🛒</p>;
  }

  const handelPayment = async () => {
    const { data: session } = await authClient.getSession();
    if (session) {
      setOpen(true);
    } else {
      router.replace("/login");
    }
  };

  const handleConfirmPlayment = async () => {
    const { data: session } = await authClient.getSession();
    if (session) {
      const orders = items.map((item) => {
        return {
          userId: session.user.id,
          price: item.price,
          productId: item.productId,
          qty: item.qty,
          status: "paid",
        };
      });
      const response = await axios.post("/api/order", orders);
      if (response.status === 201) {
        clearItem();
        toast.success(response.data.message);
        router.replace("/product");
      }
    } else {
      router.replace("/login");
    }
  };

  const handleCheckout = async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      localStorage.setItem("paymentCompleted", "true");
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
        <div> รวมทั้งหมด: {total.toLocaleString()}฿</div>
        <div>
          <Button onClick={handelPayment}>ชำระเงิน</Button>
          <div>
            <AlertDialog open={open}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>สแกนจ่ายด้วย OR Code</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>
                    ยกเลิก
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmPlayment}>
                    ยืนยันการชำระเงิน
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="text-right mt-6">
        <Button onClick={handleCheckout} className="bg-green-500 text-white">
          ดำเนินการชำระเงิน
        </Button>
      </div>
    </div>
  );
}
