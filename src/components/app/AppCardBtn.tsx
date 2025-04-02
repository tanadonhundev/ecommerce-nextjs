"use client"
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
//rafc if page np ***
export const AppCardBtn = () => {
  const handleAdd = () => {
    alert("hello");
  };
  return (
    <Button className="mt-10" onClick={handleAdd}>
      <ShoppingCart /> เพิ่มลงรถเข็น
    </Button>
  );
};
