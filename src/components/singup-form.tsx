"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const SingUpForm = () => {
  const router = useRouter();
  const handleSingUp = async () => {
    await authClient.signUp.email(
      {
        email: "tanadon@gmail.com",
        password: "111111111",
        name: "admin admin",
      },
      {
        onRequest: (ctx) => {
          //show loading
          console.log("loading", ctx.body);
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          console.log("success", ctx.data);
          router.replace("/login")
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );
  };
  return (
    <div>
      <Button onClick={handleSingUp}>สมัครสมาชิก</Button>
    </div>
  );
};

export default SingUpForm;
