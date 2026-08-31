import Link from "next/link";

export default function FindPasswordPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f3efe8,_#f7f7f5_40%,_#ffffff_72%)] px-6 py-10 text-zinc-900">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-xl border border-black/5 bg-white/90 p-8 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.35)]">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            비밀번호 찾기
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
            비밀번호 찾기 기능은 준비 중입니다.
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            현재는 로그인으로 돌아가서 비밀번호 변경 또는 재설정 흐름을 이어갈
            수 있도록 준비된 상태입니다.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
