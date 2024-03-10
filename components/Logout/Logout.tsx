"use client";

import { ROUTES } from "@/Routes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();
  return (
    <Button
      type="button"
      onClick={() => {
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        router.push(ROUTES.LOG_IN(""));
      }}
    >
      Logout
    </Button>
  );
}
