"use server";

import { createClient } from "@/lib/supabase/server";

export type BodySurveyAnswers = {
  detoxing: string[];
  pain: string[];
  relaxing: string[];
};

export async function saveBodySurveyAnswersAction({
  surveyId,
  answers,
}: {
  surveyId: string;
  answers: BodySurveyAnswers;
}) {
  if (!surveyId) {
    throw new Error("survey_id가 필요합니다.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("survey_answers")
    .insert({
      survey_id: surveyId,
      category: "BODY",
      answers,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
