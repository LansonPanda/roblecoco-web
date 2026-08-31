export default function StorePendingPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-3xl items-center justify-center px-2">
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
          Pending Approval
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
          가입 승인 대기 중입니다
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          현재 관리자의 승인을 기다리고 있습니다. 승인이 완료되면 모든 기능을
          이용할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
