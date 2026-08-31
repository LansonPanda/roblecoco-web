"use server";

import { createClient } from "@/lib/supabase/server";

export type BodyFaceSurveyAnswers = {
  face: {
    skinType: "oily" | "dry" | "combination";
    symptoms: string[];
  };
  body: {
    detoxing: string[];
    pain: string[];
    relaxing: string[];
  };
};

export async function saveBodyFaceSurveyAnswersAction({
  surveyId,
  answers,
}: {
  surveyId: string;
  answers: BodyFaceSurveyAnswers;
}) {
  if (!surveyId) {
    throw new Error("survey_id가 필요합니다.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("survey_answers")
    .insert({
      survey_id: surveyId,
      category: "FACE_BODY",
      answers,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
