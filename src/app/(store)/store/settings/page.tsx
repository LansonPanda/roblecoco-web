import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordChangeForm } from "@/components/store/password-change-form";
import { StoreSettingsForm } from "@/components/store/store-settings-form";

type StoreSettingsPageData = {
  email: string;
  storeName: string;
  ownerName: string;
  phone: string;
  logoUrl: string;
};

const defaultLogoUrl = "/roblecoco-logo.png";

async function getStoreSettingsPageData(): Promise<StoreSettingsPageData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect("/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("name, owner_name, phone, logo_url")
    .eq("id", user.id)
    .maybeSingle();

  return {
    email: user.email ?? "",
    storeName: store?.name ?? "",
    ownerName: store?.owner_name ?? "",
    phone: store?.phone ?? "",
    logoUrl: store?.logo_url ?? defaultLogoUrl,
  };
}

export default async function StoreSettingsPage() {
  const data = await getStoreSettingsPageData();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-500">설정</p>
          <h1 className="text-xl font-semibold text-zinc-950">
            계정 및 매장 설정
          </h1>
        </div>
      </div>

      <Card className="border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle>계정 정보</CardTitle>
          <CardDescription>
            현재 로그인한 계정 정보와 비밀번호 변경을 관리합니다. 이메일은
            수정할 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            <span className="font-medium text-zinc-500">이메일</span>
            <div className="mt-1 text-zinc-950">{data.email || "-"}</div>
            <p className="mt-2 text-xs text-zinc-500">
              이메일은 수정할 수 없습니다.
            </p>
          </div>

          <PasswordChangeForm />
        </CardContent>
      </Card>

      <Card className="border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle>매장 정보</CardTitle>
          <CardDescription>
            매장명, 이름, 전화번호, 로고를 수정할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoreSettingsForm
            defaultValues={{
              storeName: data.storeName,
              ownerName: data.ownerName,
              phone: data.phone,
              logoUrl: data.logoUrl,
            }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
