"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartColumn, Store } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/admin",
    label: "전체 통계",
    description: "대시보드",
    icon: ChartColumn,
  },
  {
    href: "/admin/stores",
    label: "매장 관리",
    description: "승인 / 정지",
    icon: Store,
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col justify-between gap-8 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            Admin
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            본사 관리자
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            매장 승인, 전체 통계, 상태 관리를 수행합니다.
          </p>
        </div>

        <nav className="grid gap-2">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 transition",
                  isActive
                    ? "border-zinc-900 bg-zinc-950 text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.5)]"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white hover:text-zinc-950",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isActive ? "bg-white/10" : "bg-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-white" : "text-zinc-600",
                    )}
                  />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span
                    className={cn(
                      "text-xs",
                      isActive ? "text-white/70" : "text-zinc-500",
                    )}
                  >
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <LogoutButton />
      </div>
    </aside>
  );
}
