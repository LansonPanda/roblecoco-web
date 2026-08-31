"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  saveBodySurveyAnswersAction,
  type BodySurveyAnswers,
} from "@/app/(survey)/survey/body/actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SymptomToggleGroup } from "@/components/survey/symptom-toggle-group";

const bodySurveySchema = z.object({
  symptomsByCategory: z.object({
    detoxing: z.array(z.string()),
    pain: z.array(z.string()),
    relaxing: z.array(z.string()),
  }),
});

type BodySurveyFormValues = z.infer<typeof bodySurveySchema>;

const symptomGroups = [
  {
    key: "detoxing",
    title: "디톡싱(부종)",
    options: ["정체비만", "호르몬불균형", "하체부종", "만성피로"],
  },
  {
    key: "pain",
    title: "통증",
    options: ["근육경직통증", "근육협착통증", "관절통", "거북목/라운드숄더"],
  },
  {
    key: "relaxing",
    title: "릴렉싱",
    options: ["에너지충전", "스트레스완화", "수면장애", "긴장성 두통"],
  },
] as const;

function buildAnswers(values: BodySurveyFormValues): BodySurveyAnswers {
  return values.symptomsByCategory;
}

export function BodySurveyForm({ surveyId }: { surveyId: string | null }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BodySurveyFormValues>({
    resolver: zodResolver(bodySurveySchema),
    defaultValues: {
      symptomsByCategory: {
        detoxing: [],
        pain: [],
        relaxing: [],
      },
    },
  });

  const detoxing =
    useWatch({ control: form.control, name: "symptomsByCategory.detoxing" }) ??
    [];
  const pain =
    useWatch({ control: form.control, name: "symptomsByCategory.pain" }) ?? [];
  const relaxing =
    useWatch({ control: form.control, name: "symptomsByCategory.relaxing" }) ??
    [];

  const toggleSymptom = (
    category: keyof BodySurveyFormValues["symptomsByCategory"],
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

  const onSubmit = async (values: BodySurveyFormValues) => {
    setSubmitError(null);

    if (!surveyId) {
      setSubmitError("survey_id가 없어 저장할 수 없습니다.");
      return;
    }

    try {
      await saveBodySurveyAnswersAction({
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
          <p className="text-sm font-medium text-zinc-500">바디 진단</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
            세부 증상을 선택해 주세요.
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            타입 선택 없이 바로 카테고리별 증상을 다중 선택합니다.
          </p>

          <div className="mt-6 grid gap-5">
            {symptomGroups.map((group) => {
              const selectedValues =
                group.key === "detoxing"
                  ? detoxing
                  : group.key === "pain"
                    ? pain
                    : relaxing;

              return (
                <SymptomToggleGroup
                  key={group.key}
                  title={group.title}
                  selectedValues={selectedValues}
                  options={group.options}
                  onToggle={(value) => toggleSymptom(group.key, value)}
                />
              );
            })}
          </div>
        </section>

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
