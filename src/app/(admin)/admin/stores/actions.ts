"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export async function approveStoreAction(formData: FormData): Promise<void> {
  try {
    const storeId = String(formData.get("storeId") ?? "").trim();
    const currentStatus = String(formData.get("currentStatus") ?? "")
      .trim()
      .toLowerCase();

    if (!storeId) {
      console.error("approveStoreAction missing storeId");
      return;
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !isAdminEmail(user?.email)) {
      console.error("approveStoreAction unauthorized access");
      return;
    }

    const nextStatus =
      currentStatus === "approved"
        ? "suspended"
        : currentStatus === "suspended"
          ? "approved"
          : "approved";

    const { error } = await supabase
      .from("stores")
      .update({ status: nextStatus })
      .eq("id", storeId);

    if (error) {
      console.error("approveStoreAction update failed:", error);
      return;
    }

    revalidatePath("/admin");
    revalidatePath("/admin/stores");
  } catch (error) {
    console.error("approveStoreAction failed:", error);
    return;
  }
}
