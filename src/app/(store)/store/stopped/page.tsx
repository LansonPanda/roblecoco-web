export default function StoreStoppedPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-3xl items-center justify-center px-2">
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
          Suspended
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
          관리자에 의해 이용이 정지 되었습니다
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          현재 계정은 본사 관리자에 의해 사용이 중지된 상태입니다. 상태가
          해제되기 전까지는 매장 기능을 이용할 수 없습니다.
        </p>
      </div>
    </section>
  );
}
