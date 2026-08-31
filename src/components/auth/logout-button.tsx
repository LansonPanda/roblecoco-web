"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();

    startTransition(() => {
      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 rounded-md border-black/10 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}
