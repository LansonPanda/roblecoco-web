"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import {
  saveBodyFaceSurveyAnswersAction,
  type BodyFaceSurveyAnswers,
} from "@/app/(survey)/survey/body-face/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type BodyFaceFormValues = {
  skinType: "oily" | "dry" | "combination";
  faceSymptoms: string[];
  bodySymptoms: string[];
};

const skinTypes = [
  { value: "oily", label: "지성" },
  { value: "dry", label: "건성" },
  { value: "combination", label: "복합성" },
] as const;

const faceSymptomOptions = [
  { value: "trouble", label: "트러블" },
  { value: "aging", label: "노화" },
  { value: "moisture", label: "수분 부족" },
] as const;

const bodySymptomGroups = [
  {
    key: "detoxing",
    title: "디톡싱",
    options: [
      { value: "detox-fatigue", label: "피로감" },
      { value: "detox-swelling", label: "붓기" },
      { value: "detox-circulation", label: "순환 저하" },
    ],
  },
  {
    key: "pain",
    title: "통증",
    options: [
      { value: "pain-neck", label: "목/어깨 통증" },
      { value: "pain-back", label: "허리 통증" },
      { value: "pain-joint", label: "관절 뻐근함" },
    ],
  },
  {
    key: "relaxing",
    title: "릴렉싱",
    options: [
      { value: "relax-stress", label: "스트레스" },
      { value: "relax-sleep", label: "수면 부족" },
      { value: "relax-tension", label: "긴장 완화" },
    ],
  },
] as const;

type BodySymptomGroupKey = (typeof bodySymptomGroups)[number]["key"];

function buildBodyFaceAnswers(
  values: BodyFaceFormValues,
): BodyFaceSurveyAnswers {
  const bodyLookup: Record<string, BodySymptomGroupKey> = Object.fromEntries(
    bodySymptomGroups.flatMap((group) =>
      group.options.map((option) => [option.value, group.key]),
    ),
  ) as Record<string, BodySymptomGroupKey>;

  const bodyGroups: Record<BodySymptomGroupKey, string[]> = {
    detoxing: [],
    pain: [],
    relaxing: [],
  };

  values.bodySymptoms.forEach((symptom) => {
    const groupKey = bodyLookup[symptom];
    if (groupKey) {
      bodyGroups[groupKey].push(symptom);
    }
  });

  return {
    face: {
      skinType: values.skinType,
      symptoms: values.faceSymptoms,
    },
    body: bodyGroups,
  };
}

export function BodyFaceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyId = searchParams.get("survey_id");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BodyFaceFormValues>({
    defaultValues: {
      skinType: "oily",
      faceSymptoms: [],
      bodySymptoms: [],
    },
  });

  const faceSymptoms =
    useWatch({
      control: form.control,
      name: "faceSymptoms",
    }) ?? [];
  const bodySymptoms =
    useWatch({
      control: form.control,
      name: "bodySymptoms",
    }) ?? [];

  const toggleValue = (
    name: "faceSymptoms" | "bodySymptoms",
    value: string,
  ) => {
    const current = form.getValues(name);
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    form.setValue(name, next, { shouldDirty: true, shouldTouch: true });
  };

  const onSubmit = async (values: BodyFaceFormValues) => {
    setSubmitError(null);

    if (!surveyId) {
      setSubmitError("survey_id가 없어 다음 단계로 이동할 수 없습니다.");
      return;
    }

    const answers = buildBodyFaceAnswers(values);

    try {
      await saveBodyFaceSurveyAnswersAction({
        surveyId,
        answers,
      });

      startTransition(() => {
        router.push(
          `/survey/constitution?survey_id=${encodeURIComponent(surveyId)}`,
        );
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
        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">얼굴 파트</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            피부 타입과 세부 증상
          </h2>
          {surveyId ? (
            <p className="mt-2 text-xs text-zinc-500">survey_id: {surveyId}</p>
          ) : null}

          <div className="mt-6 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
            <FormField
              control={form.control}
              name="skinType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>피부 타입</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-3"
                    >
                      {skinTypes.map((skinType) => (
                        <label
                          key={skinType.value}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 transition hover:border-zinc-400"
                        >
                          <RadioGroupItem value={skinType.value} />
                          <span className="text-sm font-medium text-zinc-900">
                            {skinType.label}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="faceSymptoms"
              render={() => (
                <FormItem>
                  <FormLabel>세부 증상</FormLabel>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {faceSymptomOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700"
                      >
                        <Checkbox
                          checked={faceSymptoms.includes(option.value)}
                          onCheckedChange={() =>
                            toggleValue("faceSymptoms", option.value)
                          }
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">바디 파트</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            디톡싱 / 통증 / 릴렉싱
          </h2>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {bodySymptomGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-zinc-200 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-900">
                  {group.title}
                </h3>
                <div className="mt-4 grid gap-3">
                  {group.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 rounded-xl border border-zinc-100 px-3 py-2 text-sm text-zinc-700"
                    >
                      <Checkbox
                        checked={bodySymptoms.includes(option.value)}
                        onCheckedChange={() =>
                          toggleValue("bodySymptoms", option.value)
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <div>
            선택 요약: 얼굴 증상 {faceSymptoms.length}개, 바디 증상{" "}
            {bodySymptoms.length}개
          </div>

          {submitError ? (
            <span className="text-sm text-destructive">{submitError}</span>
          ) : null}

          <Button
            type="submit"
            className="h-11 rounded-full px-6"
            disabled={form.formState.isSubmitting || isPending}
          >
            {form.formState.isSubmitting || isPending
              ? "저장 중..."
              : "다음 단계로 이동"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
