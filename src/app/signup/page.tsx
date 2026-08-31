import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f3efe8,_#f7f7f5_40%,_#ffffff_72%)] px-6 py-10 text-zinc-900">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 rounded-[2rem] border border-black/5 bg-white/85 p-6 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.35)] backdrop-blur md:grid-cols-[1.05fr_0.95fr] md:p-10">
          <div className="flex flex-col justify-between gap-10 rounded-[1.5rem] bg-zinc-950 p-8 text-white md:p-10">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/55">
                Roble CoCo
              </p>
              <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                더 스마트한 매장 관리의 시작, 로블코코
              </h1>
              <p className="max-w-lg text-sm leading-7 text-white/72 md:text-base">
                고객 진단부터 상담까지 한 번에
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 rounded-[1.5rem] border border-zinc-200 bg-white p-8 md:p-10">
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-500">회원가입</p>
              <h2 className="text-2xl font-semibold text-zinc-950">
                회원가입을 위해 필수 정보를 입력해 주세요.
              </h2>
            </div>

            <SignupForm />

            <Link
              href="/login"
              className="text-center text-sm text-zinc-500 transition hover:text-zinc-900"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
