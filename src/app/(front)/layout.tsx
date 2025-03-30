import type { Metadata } from "next";
import "../globals.css";
import { kanit } from "../fonts";
import AppHeader from "@/components/app/AppHeader";

export const metadata: Metadata = {
  title: "e-commerce System",
  description: "Generated by create next app",
};

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.className}`}>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
