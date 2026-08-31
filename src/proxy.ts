import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { isAdminEmail } from "@/lib/admin";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthCallbackPage = pathname === "/auth/callback";
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isAdminPage = pathname.startsWith("/admin");
  const isStorePage = pathname.startsWith("/store");
  const isStorePendingPage = pathname === "/store/pending";
  const isStoreStoppedPage = pathname === "/store/stopped";

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthCallbackPage) {
    return response;
  }

  let storeStatus: string | null = null;

  if (user?.id && !isAdminEmail(user?.email) && (isAuthPage || isStorePage)) {
    const { data: store } = await supabase
      .from("stores")
      .select("status")
      .eq("id", user.id)
      .maybeSingle();

    storeStatus = store?.status ?? null;
  }

  if (!isAuthPage && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminPage && !isAdminEmail(user?.email)) {
    return NextResponse.redirect(
      new URL(user ? "/store" : "/login", request.url),
    );
  }

  if (isStorePage && !isAdminEmail(user?.email)) {
    const normalizedStatus = (storeStatus ?? "pending").toLowerCase();

    if (normalizedStatus === "suspended") {
      if (!isStoreStoppedPage) {
        return NextResponse.redirect(new URL("/store/stopped", request.url));
      }

      return response;
    }

    if (normalizedStatus !== "approved") {
      if (!isStorePendingPage) {
        return NextResponse.redirect(new URL("/store/pending", request.url));
      }

      return response;
    }

    if (isStorePendingPage && normalizedStatus === "approved") {
      return NextResponse.redirect(new URL("/store", request.url));
    }

    if (isStoreStoppedPage && normalizedStatus === "approved") {
      return NextResponse.redirect(new URL("/store", request.url));
    }
  }

  if (isAuthPage && user) {
    const redirectTarget = isAdminEmail(user.email)
      ? "/admin"
      : (storeStatus ?? "pending").toLowerCase() === "approved"
        ? "/store"
        : (storeStatus ?? "pending").toLowerCase() === "suspended"
          ? "/store/stopped"
          : "/store/pending";
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)",
  ],
};
