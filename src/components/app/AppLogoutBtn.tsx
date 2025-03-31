"use  client";

import { Button } from "../ui/button";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const AppLogoutBtn = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login");
        },
      },
    });
  };
  return (
    <>
      <Button
        className="inline-flex justify-center gap-0.5 overflow-hidden rounded-full bg-red-500 px-3 py-1 text-sm/6 font-medium text-white transition hover:bg-zinc-700"
        onClick={handleLogout}
      >
        <IconLogout />
        Logout
      </Button>
    </>
  );
};

export default AppLogoutBtn;
