export default function StoreCustomersPage() {
  return (
    <section className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">고객 관리</p>
      <h2 className="mt-2 text-2xl font-semibold">고객 목록과 사후 기록</h2>
      <p className="mt-4 text-sm leading-7 text-zinc-600">
        이 페이지는 고객 검색, 검사 이력 확인, 후속 관리 메모를 위한 자리입니다.
        이후 데이터 모델이 정해지면 리스트와 상세 패널로 확장하면 됩니다.
      </p>
    </section>
  );
}