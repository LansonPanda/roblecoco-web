"use server";

import { createClient } from "@/lib/supabase/server";

import type { UpdateStoreSettingsValues } from "@/components/store/store-settings-form";

type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string };

const fallbackMessage = "저장에 실패했습니다. 다시 시도해 주세요.";

export async function updatePasswordAction({
  password,
}: {
  password: string;
}): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "비밀번호가 변경되었습니다." };
  } catch (error) {
    console.error("updatePasswordAction failed:", error);
    return { ok: false, message: fallbackMessage };
  }
}

export async function updateStoreSettingsAction(
  values: UpdateStoreSettingsValues & { logoUrl: string },
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return { ok: false, message: "로그인 세션을 확인할 수 없습니다." };
    }

    const { error } = await supabase
      .from("stores")
      .update({
        name: values.storeName,
        owner_name: values.ownerName,
        phone: values.phone,
        email: user.email,
        logo_url: values.logoUrl,
      })
      .eq("id", user.id);

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "매장 정보가 저장되었습니다." };
  } catch (error) {
    console.error("updateStoreSettingsAction failed:", error);
    return { ok: false, message: fallbackMessage };
  }
}
