import type { ReactNode } from "react";

import Image from "next/image";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { StoreHeaderActions } from "@/components/store/store-header-actions";

const fallbackTitle = "로블코코 관리자";
const fallbackLogoUrl = "/roblecoco-logo.png";

async function getStoreDisplayName() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect("/login");
  }

  try {
    const { data: matchedStore } = await supabase
      .from("stores")
      .select("name, logo_url")
      .eq("id", user.id)
      .maybeSingle();

    if (matchedStore?.name) {
      return {
        title: `${matchedStore.name} 관리자`,
        logoUrl: matchedStore.logo_url || fallbackLogoUrl,
      };
    }

    const { data, error } = await supabase
      .from("stores")
      .select("name, logo_url")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data?.name) {
      return {
        title: fallbackTitle,
        logoUrl: fallbackLogoUrl,
      };
    }

    return {
      title: `${data.name} 관리자`,
      logoUrl: data.logo_url || fallbackLogoUrl,
    };
  } catch {
    return {
      title: fallbackTitle,
      logoUrl: fallbackLogoUrl,
    };
  }
}

export default async function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const storeDisplay = await getStoreDisplayName();

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between gap-4 border-b border-black/10 pb-5">
          <div className="flex items-center gap-3">
            <Image
              src={storeDisplay.logoUrl}
              alt="매장 로고"
              width={44}
              height={44}
              unoptimized
              className="h-11 w-11 shrink-0 rounded-lg border border-black/10 bg-white object-cover"
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
                Store
              </p>
              <span className="text-xl font-semibold leading-tight">
                {storeDisplay.title}
              </span>
            </div>
          </div>

          <StoreHeaderActions />
        </header>

        <main className="flex-1 py-8">{children}</main>
      </div>
    </div>
  );
}
