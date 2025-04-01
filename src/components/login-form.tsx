"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { IconLoader } from "@tabler/icons-react";

//zod validation
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "ป้อนข้อมูลอีเมลด้วย" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" })
    .trim(),
  password: z.string().min(4, { message: "รหัสผ่านต้องมี 4 ตัวขึ้นไป" }).trim(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  // เอา type มาจาก formSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.setFocus("email");
  }, [form]);

  //login button
  const handleOnSubmit = async (data: z.infer<typeof formSchema>) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: (ctx) => {
          //show loading
          console.log("loading", ctx.body);
        },
        onSuccess: async (ctx) => {
          //redirect to the dashboard or sign in page
          console.log("success", ctx.data);
          // get session (client side)
          const { data: session } = await authClient.getSession();
          if (session?.user.role === "admin") {
            router.replace("/dashboard");
          } else if (session?.user.role === "user") {
            router.replace("/");
          }
          // router.replace("/");
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );
  };

  //login handcode
  const handleLogin = async () => {
    await authClient.signIn.email(
      {
        email: "abc1@gmail.com",
        password: "112233",
        // callbackURL:"/"
      },
      {
        onRequest: (ctx) => {
          //show loading
          console.log("loading", ctx.body);
        },
        onSuccess: async (ctx) => {
          //redirect to the dashboard or sign in page
          console.log("success", ctx.data);
          // get session (client side)
          const { data: session } = await authClient.getSession();
          if (session?.user.role === "admin") {
            router.replace("/dashboard");
          } else if (session?.user.role === "user") {
            router.replace("/");
          }
          // router.replace("/");
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );
  };
  const handleLoginFacebook = async () => {
    await authClient.signIn.social(
      {
        provider: "facebook",
        // callbackURL: "http://localhost:9999/auth/callback",
      },
      {
        onRequest: (ctx) => {
          //show loading
          console.log("loading", ctx.body);
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          console.log("success", ctx.data);
          //  router.replace("/login");
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="test@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                  >
                    {form.formState.isSubmitting ? (
                      <IconLoader className="animate-spin" />
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/singup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </Form>
          <Button variant="default" className="w-full" onClick={handleLogin}>
            Login with handCode
          </Button>
          <Button
            variant="default"
            className="w-full"
            onClick={handleLoginFacebook}
          >
            Login with facebook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
