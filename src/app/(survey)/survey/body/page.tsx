import { BodySurveyForm } from "@/components/survey/body-survey-form";

type BodySurveyPageProps = {
  searchParams?: Promise<{ survey_id?: string }>;
};

export default async function BodySurveyPage({
  searchParams,
}: BodySurveyPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <BodySurveyForm surveyId={params?.survey_id ?? null} />
    </main>
  );
}
