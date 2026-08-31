import Link from "next/link";

type SelectPartPageProps = {
  searchParams?: Promise<{
    survey_id?: string;
    customer_id?: string;
  }>;
};

export default async function SelectPartPage({
  searchParams,
}: SelectPartPageProps) {
  const params = await searchParams;
  const surveyId = params?.survey_id ?? "";
  const isBodySurveyOpen = false;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-medium text-zinc-500">진단 부위 선택</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          맞춤 진단을 시작할 부위를 선택해 주세요.
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          고객님의 고민 부위에 맞는 세부 상태 및 맞춤 솔루션을 분석합니다.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link
            href={`/survey/face?survey_id=${encodeURIComponent(surveyId)}`}
            className="group rounded-lg border border-zinc-200 bg-zinc-950 p-6 text-white transition hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-sm font-medium text-white/55">얼굴 진단</p>
            <h2 className="mt-3 text-2xl font-semibold">얼굴 진단</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              서브타이틀 입니다. 텍스트 추가 또는 제거
            </p>
            <div className="mt-8 inline-flex rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition group-hover:bg-white/10">
              얼굴 진단 시작
            </div>
          </Link>

          <div
            className={`group rounded-lg border p-6 transition ${
              isBodySurveyOpen
                ? "border-zinc-200 bg-zinc-50 text-zinc-900 hover:-translate-y-1 hover:border-zinc-300 hover:bg-zinc-100"
                : "border-dashed border-zinc-300 bg-zinc-50 text-zinc-500"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">바디 진단</p>
              {!isBodySurveyOpen ? (
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                  준비 중(Coming Soon)
                </span>
              ) : null}
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-zinc-900">
              바디 진단
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              서브타이틀 입니다. 텍스트 추가 또는 제거
            </p>
            <div
              className={`mt-8 inline-flex rounded-md px-4 py-2 text-sm font-medium ${
                isBodySurveyOpen
                  ? "border border-zinc-200 bg-white text-zinc-700 transition group-hover:border-zinc-300 group-hover:bg-zinc-950 group-hover:text-white"
                  : "cursor-not-allowed border border-zinc-200 bg-white text-zinc-400"
              }`}
              aria-disabled={!isBodySurveyOpen}
            >
              {isBodySurveyOpen ? "바디 진단 시작" : "준비 중"}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
