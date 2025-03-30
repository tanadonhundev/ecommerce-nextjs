import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main>
      <h2 className="font-k2d text-3xl text-teal-700 font-bold">ติดต่อเรา</h2>
      <p className="text-4xl">สวัสดี Contact Page</p>
      <p className="font-sarabun text-4xl">สวัสดี Contact Page</p>
      <div className="m-10">
        <Button variant="outline">
          <Link href="/">Go to Home Page</Link>
        </Button>
      </div>
    </main>
  );
}
