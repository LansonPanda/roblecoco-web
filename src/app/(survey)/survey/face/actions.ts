"use server";

import { createClient } from "@/lib/supabase/server";

export type FaceSurveyAnswers = {
  skinType: "oily" | "dry" | "combination";
  symptomsByCategory: {
    trouble: string[];
    aging: string[];
    moisture: string[];
  };
};

export async function saveFaceSurveyAnswersAction({
  surveyId,
  answers,
}: {
  surveyId: string;
  answers: FaceSurveyAnswers;
}) {
  if (!surveyId) {
    throw new Error("survey_id가 필요합니다.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("survey_answers")
    .insert({
      survey_id: surveyId,
      category: "FACE",
      answers,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
