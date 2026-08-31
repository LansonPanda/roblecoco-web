"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";

export function StoreHeaderActions() {
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith("/store/settings");

  return (
    <div className="flex items-center gap-2">
      {isSettingsPage ? (
        <Link
          href="/store"
          className="inline-flex h-11 items-center justify-center rounded-md border border-black/10 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          메인 화면으로 돌아가기
        </Link>
      ) : (
        <Link
          href="/store/settings"
          className="inline-flex h-11 items-center justify-center rounded-md border border-black/10 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          설정
        </Link>
      )}
      <LogoutButton />
    </div>
  );
}
