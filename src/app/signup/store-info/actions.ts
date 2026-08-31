"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function completeSocialSignupAction(formData: FormData) {
  const storeName = getString(formData, "storeName");
  const provider = getString(formData, "provider") || "social";
  const signupPath = `social:${provider}`;

  if (!storeName) {
    redirect("/signup/store-info");
  }

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

  const { error } = await supabase.from("stores").upsert(
    {
      id: user.id,
      name: storeName,
      owner_name: ownerName,
      phone,
      signup_path: signupPath,
      status: "pending",
      logo_url: "/roblecoco-logo.png",
    },
    { onConflict: "id" },
  );

  if (error) {
    redirect(`/signup/store-info?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/store/pending");
}
