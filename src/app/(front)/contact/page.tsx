import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl pt-16 pb-10">
      <h2 className="text-3xl text-blue-700">ติดต่อเรา</h2>
      <p className="font-sarabun text-2xl">สวัสดี contact page</p>
      <p className="font-k2d text-2xl">สวัสดี contact page</p>
      <Separator />
      <div className="m-10">
        <Button asChild>
          <Link href={"/"}>go home</Link>
        </Button>
      </div>
    </div>
  );
}
