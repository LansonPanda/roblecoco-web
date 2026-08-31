import { z } from "zod";

const genderValues = ["male", "female", "other"] as const;

export const customerInfoSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요."),
  age: z
    .string()
    .trim()
    .min(1, "나이를 입력해 주세요.")
    .refine((value) => /^\d+$/.test(value), {
      message: "나이를 숫자로 입력해 주세요.",
    })
    .refine(
      (value) => {
        const age = Number(value);
        return age >= 1 && age <= 120;
      },
      {
        message: "나이는 1세 이상 120세 이하로 입력해 주세요.",
      },
    ),
  gender: z
    .string()
    .trim()
    .min(1, "성별을 선택해 주세요.")
    .refine(
      (value) => genderValues.includes(value as (typeof genderValues)[number]),
      {
        message: "성별을 선택해 주세요.",
      },
    ),
  regionCity: z.string().trim().min(1, "거주지역 시/도를 선택해 주세요."),
  regionDistrict: z.string().trim().min(1, "거주지역 구/군을 선택해 주세요."),
});

export type CustomerInfoValues = z.infer<typeof customerInfoSchema>;
