import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout_sessions`,
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
