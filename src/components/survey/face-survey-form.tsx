"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  saveFaceSurveyAnswersAction,
  type FaceSurveyAnswers,
} from "@/app/(survey)/survey/face/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SymptomToggleGroup } from "@/components/survey/symptom-toggle-group";

const skinTypeOptions = [
  { value: "oily", label: "지성" },
  { value: "dry", label: "건성" },
  { value: "combination", label: "복합성" },
] as const;

const symptomGroups = [
  {
    key: "trouble",
    title: "트러블",
    options: ["화농성 여드름", "좁쌀 여드름", "붉은기", "피지/블랙헤드"],
  },
  {
    key: "aging",
    title: "노화",
    options: ["깊은 주름", "잔주름", "탄력 저하", "색소 침착"],
  },
  {
    key: "moisture",
    title: "수분",
    options: ["속당김", "각질 부각", "푸석함", "열감"],
  },
] as const;

const faceSurveySchema = z.object({
  skinType: z
    .string()
    .min(1, "피부 타입을 선택해 주세요.")
    .refine((value) => ["oily", "dry", "combination"].includes(value), {
      message: "피부 타입을 선택해 주세요.",
    }),
  symptomsByCategory: z.object({
    trouble: z.array(z.string()),
    aging: z.array(z.string()),
    moisture: z.array(z.string()),
  }),
});

type FaceSurveyFormValues = z.infer<typeof faceSurveySchema>;

function buildAnswers(values: FaceSurveyFormValues): FaceSurveyAnswers {
  return {
    skinType: values.skinType as FaceSurveyAnswers["skinType"],
    symptomsByCategory: values.symptomsByCategory,
  };
}

export function FaceSurveyForm({ surveyId }: { surveyId: string | null }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FaceSurveyFormValues>({
    resolver: zodResolver(faceSurveySchema),
    defaultValues: {
      skinType: "",
      symptomsByCategory: {
        trouble: [],
        aging: [],
        moisture: [],
      },
    },
  });

  const skinType = useWatch({ control: form.control, name: "skinType" });
  const symptomsByCategory = useWatch({
    control: form.control,
    name: "symptomsByCategory",
  });

  const toggleSymptom = (
    category: keyof FaceSurveyFormValues["symptomsByCategory"],
    value: string,
  ) => {
    const current = form.getValues(`symptomsByCategory.${category}`);
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    form.setValue(`symptomsByCategory.${category}`, next, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (values: FaceSurveyFormValues) => {
    setSubmitError(null);

    if (!surveyId) {
      setSubmitError("survey_id가 없어 저장할 수 없습니다.");
      return;
    }

    try {
      await saveFaceSurveyAnswersAction({
        surveyId,
        answers: buildAnswers(values),
      });

      startTransition(() => {
        router.push(`/survey/result?survey_id=${encodeURIComponent(surveyId)}`);
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "저장에 실패했습니다.",
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-medium text-zinc-500">[STEP 1]</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
            피부 타입 선택
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            먼저 피부 타입을 선택해 주세요. 선택 후 세부 증상 영역이 열립니다.
          </p>

          <FormField
            control={form.control}
            name="skinType"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>피부 타입</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="mt-3 grid gap-3 md:grid-cols-3"
                  >
                    {skinTypeOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 rounded-[1.25rem] border border-zinc-200 bg-zinc-50 px-4 py-4 transition hover:border-zinc-400"
                      >
                        <RadioGroupItem value={option.value} />
                        <span className="text-sm font-medium text-zinc-900">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {skinType ? (
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-medium text-zinc-500">[STEP 2]</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
              세부 증상 선택
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              카테고리별로 복수 선택이 가능합니다.
            </p>

            <div className="mt-6 grid gap-5">
              {symptomGroups.map((group) => (
                <SymptomToggleGroup
                  key={group.key}
                  title={group.title}
                  selectedValues={symptomsByCategory?.[group.key] ?? []}
                  options={group.options}
                  onToggle={(value) => toggleSymptom(group.key, value)}
                />
              ))}
            </div>
          </section>
        ) : null}

        {submitError ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          className="h-11 rounded-full px-6"
          disabled={form.formState.isSubmitting || isPending}
        >
          {form.formState.isSubmitting || isPending ? "저장 중..." : "다음"}
        </Button>
      </form>
    </Form>
  );
}
