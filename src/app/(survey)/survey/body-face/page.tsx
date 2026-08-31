import { Suspense } from "react";

import { BodyFaceForm } from "@/components/survey/body-face-form";

export default function SurveyBodyFacePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <Suspense
        fallback={
          <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">불러오는 중...</p>
          </section>
        }
      >
        <BodyFaceForm />
      </Suspense>
    </main>
  );
}
