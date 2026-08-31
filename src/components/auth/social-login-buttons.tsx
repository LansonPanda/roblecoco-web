"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type SocialProvider = "kakao" | "google";

const providerConfig: Record<
  SocialProvider,
  {
    label: string;
    className: string;
    icon: string;
  }
> = {
  kakao: {
    label: "카카오로 시작하기",
    className: "bg-[#FEE500] text-[#181600] hover:brightness-95",
    icon: "K",
  },
  google: {
    label: "구글로 시작하기",
    className: "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
    icon: "G",
  },
};

export function SocialLoginButtons() {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const startOAuth = async (provider: SocialProvider) => {
    setError(null);
    setLoadingProvider(provider);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?provider=${provider}`;
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(providerConfig) as SocialProvider[]).map((provider) => {
          const config = providerConfig[provider];

          return (
            <button
              key={provider}
              type="button"
              onClick={() => startOAuth(provider)}
              disabled={loadingProvider !== null}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${config.className}`}
            >
              <span className="text-base">{config.icon}</span>
              {loadingProvider === provider ? "연결 중..." : config.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
