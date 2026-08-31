import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { completeSocialSignupAction } from "./actions";

type StoreInfoPageProps = {
  searchParams?: {
    provider?: string;
    error?: string;
  };
};

function getProviderLabel(provider?: string) {
  if (provider === "kakao") {
    return "카카오";
  }

  if (provider === "google") {
    return "구글";
  }

  return "소셜";
}

function getDisplayValue(
  value: string | null | undefined,
  fallback = "연동 정보 없음",
) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : fallback;
}

async function getStoreInfoPageData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect("/login");
  }

  const metadata = (user.user_metadata ?? {}) as Record<
    string,
    string | undefined
  >;
  const ownerName =
    metadata.full_name ??
    metadata.name ??
    metadata.nickname ??
    user.email?.split("@")[0] ??
    "";
  const phone =
    metadata.phone ?? metadata.phone_number ?? metadata.mobile ?? "";

  return {
    ownerName,
    phone,
  };
}

export default async function StoreInfoPage({
  searchParams,
}: StoreInfoPageProps) {
  const providerLabel = getProviderLabel(searchParams?.provider);
  const data = await getStoreInfoPageData();
  const errorMessage = searchParams?.error ?? "";
  const provider = searchParams?.provider ?? "social";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f3efe8,_#f7f7f5_40%,_#ffffff_72%)] px-6 py-10 text-zinc-900">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-2xl border border-black/5 bg-white/90 p-8 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.35)] backdrop-blur md:p-10">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
              First Signup
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              {providerLabel} 로그인 후 매장 정보를 입력해 주세요.
            </h1>
            <p className="text-sm leading-7 text-zinc-600">
              이름과 전화번호는 소셜 로그인으로 받아오고, 처음 가입할 때는
              매장명만 입력하면 됩니다.
            </p>
          </div>

          {errorMessage ? (
            <p className="mt-6 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <form action={completeSocialSignupAction} className="mt-8 grid gap-5">
            <input type="hidden" name="provider" value={provider} />
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-sm font-medium text-zinc-500">이름</p>
                <p className="mt-1 text-sm text-zinc-950">
                  {getDisplayValue(data.ownerName)}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-sm font-medium text-zinc-500">전화번호</p>
                <p className="mt-1 text-sm text-zinc-950">
                  {getDisplayValue(data.phone, "연동되지 않음")}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="storeName"
              >
                매장명
              </label>
              <input
                id="storeName"
                name="storeName"
                type="text"
                placeholder="로블코코 본점"
                className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
                required
              />
            </div>

            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-600">
              {providerLabel} 소셜 로그인으로 받은 정보는 그대로 사용하고,
              매장명만 입력하면 승인 대기로 넘어갑니다.
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                완료
              </button>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                로그인으로 돌아가기
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
