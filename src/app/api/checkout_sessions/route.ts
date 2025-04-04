import { NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import conn from "@/db";
import { orders } from "@/db/schema";
const db = await conn;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    const orderId = uuidv4();

    // 1. คำนวณราคารวม
    const totalAmount = items.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, item: any) => sum + item.price * item.qty,
      0
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "promptpay"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "thb",
          product_data: { name: item.title },
          unit_amount: item.price * 100, // Stripe ใช้หน่วยเป็นสตางค์
        },
        quantity: item.qty,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout_sessions`,
    });
    // 3. บันทึกลง Database ก่อนทำการชำระเงิน
    await db.insert(orders).values({
      orderId,
      // userId: session.user.id, // ผูก order กับ user
      totalAmount: totalAmount,
      session_id: session.id,
      status: session.status,
    });
    return NextResponse.json({ url: session.url });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
