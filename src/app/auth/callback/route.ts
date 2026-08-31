import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { isAdminEmail } from "@/lib/admin";

type CookieToSet = {
  name: string;
  value: string;
  options?: any;
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const provider = request.nextUrl.searchParams.get("provider") ?? "social";
  const cookiesToSet: CookieToSet[] = [];

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookiesToSet.push(...cookies);
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = data.user;

  let redirectTarget = "/store/pending";

  if (isAdminEmail(user.email)) {
    redirectTarget = "/admin";
  } else {
    const { data: store } = await supabase
      .from("stores")
      .select("status")
      .eq("id", user.id)
      .maybeSingle();

    if (!store) {
      redirectTarget = `/signup/store-info?provider=${provider}`;
    } else {
      const normalizedStatus = (store.status ?? "pending").toLowerCase();

      if (normalizedStatus === "approved") {
        redirectTarget = "/store";
      } else if (normalizedStatus === "suspended") {
        redirectTarget = "/store/stopped";
      }
    }
  }

  const redirectResponse = NextResponse.redirect(
    new URL(redirectTarget, request.url),
  );

  cookiesToSet.forEach(({ name, value, options }) => {
    redirectResponse.cookies.set(name, value, options);
  });

  return redirectResponse;
}
