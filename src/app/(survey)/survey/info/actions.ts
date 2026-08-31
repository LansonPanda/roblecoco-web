"use server";

import { createClient } from "@/lib/supabase/server";
import {
  customerInfoSchema,
  type CustomerInfoValues,
} from "@/lib/validation/customer-info";

type CreateSurveyResult = {
  customerId: string;
  surveyId: string;
};

type CreateCustomerSurveyActionResult =
  | { ok: true; data: CreateSurveyResult }
  | { ok: false; message: string };

const defaultErrorMessage =
  "고객 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.";

export async function createCustomerSurveyAction(
  values: CustomerInfoValues,
): Promise<CreateCustomerSurveyActionResult> {
  try {
    const parsed = customerInfoSchema.parse(values);
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const storeId = user?.id ?? null;

    if (userError || !storeId) {
      console.error(
        "createCustomerSurveyAction missing authenticated store:",
        userError,
      );
      return {
        ok: false,
        message: "로그인된 매장 정보를 찾을 수 없습니다. 다시 로그인해 주세요.",
      };
    }

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        name: parsed.name,
        age: Number(parsed.age),
        gender: parsed.gender,
        region_city: parsed.regionCity,
        region_district: parsed.regionDistrict,
        store_id: storeId,
      })
      .select("id")
      .single();

    if (customerError || !customer?.id) {
      console.error(
        "createCustomerSurveyAction customer insert failed:",
        customerError,
      );
      return { ok: false, message: defaultErrorMessage };
    }

    const { data: survey, error: surveyError } = await supabase
      .from("surveys")
      .insert({
        store_id: storeId,
        customer_id: customer.id,
        status: "IN_PROGRESS",
      })
      .select("id")
      .single();

    if (surveyError || !survey?.id) {
      console.error(
        "createCustomerSurveyAction survey insert failed:",
        surveyError,
      );
      return { ok: false, message: defaultErrorMessage };
    }

    return {
      ok: true,
      data: {
        customerId: customer.id,
        surveyId: survey.id,
      },
    };
  } catch (error) {
    console.error("createCustomerSurveyAction failed:", error);
    return { ok: false, message: defaultErrorMessage };
  }
}
