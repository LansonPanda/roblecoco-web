import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CustomerRow = {
  id: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  region_city: string | null;
  region_district: string | null;
  created_at: string | null;
};

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatRegisteredAt(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return dateTimeFormatter.format(date);
}

async function getRecentCustomers() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("id, name, age, gender, region_city, region_district, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return [] as CustomerRow[];
    }

    return (data ?? []) as CustomerRow[];
  } catch {
    return [] as CustomerRow[];
  }
}

export default async function StoreDashboardPage() {
  const customers = await getRecentCustomers();
  const hasCustomers = customers.length > 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500">고객 관리</p>
          <h1 className="text-3xl font-semibold text-zinc-950">
            고객 목록 조회 및 검사 시작
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-zinc-600">
            원장님이 고객의 최근 등록 내역을 확인하고, 바로 새로운 검사를 시작할
            수 있는 메인 대시보드입니다.
          </p>
        </div>

        <Link
          href="/survey/info"
          className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-950 px-6 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          새 고객 검사 시작
        </Link>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-500">최근 등록 고객</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              등록 순으로 확인합니다
            </h2>
          </div>
          <span className="rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
            최신 10건
          </span>
        </div>

        {hasCustomers ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>고객명</TableHead>
                <TableHead>나이</TableHead>
                <TableHead>성별</TableHead>
                <TableHead>거주지역(시/구)</TableHead>
                <TableHead>등록일시</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium text-zinc-950">
                    {customer.name ?? "-"}
                  </TableCell>
                  <TableCell>{customer.age ?? "-"}</TableCell>
                  <TableCell>{customer.gender ?? "-"}</TableCell>
                  <TableCell>
                    {[customer.region_city, customer.region_district]
                      .filter(Boolean)
                      .join(" ") || "-"}
                  </TableCell>
                  <TableCell>
                    {formatRegisteredAt(customer.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
            <p className="text-base font-medium text-zinc-900">
              등록된 고객 데이터가 없습니다.
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              새 고객 검사를 시작하면 이 표에 최신 등록 순으로 표시됩니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
