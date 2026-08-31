import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f3efe8,_#f7f7f5_40%,_#ffffff_72%)] px-6 py-10 text-zinc-900">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 rounded-xl border border-black/5 bg-white/85 p-6 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.35)] backdrop-blur md:grid-cols-[0.82fr_1.18fr] md:p-10">
          <div className="flex items-center justify-center rounded-lg bg-zinc-950 p-5 md:max-w-[18rem] md:justify-self-center md:p-6">
            <div className="w-full max-w-[12rem] overflow-hidden rounded-lg border border-white/10 bg-white/5 p-3">
              <Image
                src="/test1.png"
                alt="Roble CoCo 로고"
                width={200}
                height={200}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 rounded-lg border border-zinc-200 bg-white p-8 md:p-10">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
                Service
              </p>
              <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                Roble CoCo
              </p>
            </div>

            <LoginForm />

            <SocialLoginButtons />

            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              회원가입
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
              <Link
                href="/login/find-id"
                className="transition hover:text-zinc-900"
              >
                아이디 찾기
              </Link>
              <span aria-hidden="true">|</span>
              <Link
                href="/login/find-password"
                className="transition hover:text-zinc-900"
              >
                비밀번호 재설정
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
