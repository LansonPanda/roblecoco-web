type ResultPageProps = {
  searchParams?: Promise<{ survey_id?: string }>;
};

export default async function SurveyResultPage({
  searchParams,
}: ResultPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">완료</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          진단 결과가 저장되었습니다.
        </h1>
        {params?.survey_id ? (
          <p className="mt-3 text-xs text-zinc-500">
            survey_id: {params.survey_id}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          이후 체질 검사 또는 추천 화면을 이어 붙이면 됩니다.
        </p>
      </section>
    </main>
  );
}
