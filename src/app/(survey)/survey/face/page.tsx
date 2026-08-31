import { FaceSurveyForm } from "@/components/survey/face-survey-form";

type FaceSurveyPageProps = {
  searchParams?: Promise<{ survey_id?: string }>;
};

export default async function FaceSurveyPage({
  searchParams,
}: FaceSurveyPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <FaceSurveyForm surveyId={params?.survey_id ?? null} />
    </main>
  );
}
