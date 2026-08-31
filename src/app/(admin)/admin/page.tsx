import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatCard = {
  label: string;
  value: string;
  description: string;
};

function getStartOfTodayIsoInKst() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return new Date(`${year}-${month}-${day}T00:00:00+09:00`).toISOString();
}

async function getAdminDashboardStats(): Promise<StatCard[]> {
  const supabase = await createClient();
  const todayStartIso = getStartOfTodayIsoInKst();

  const [storeCountResult, customerCountResult, todaySurveyResult] =
    await Promise.all([
      supabase.from("stores").select("id", { count: "exact", head: true }),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase
        .from("survey_answers")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayStartIso),
    ]);

  return [
    {
      label: "총 매장 수",
      value: String(storeCountResult.count ?? 0),
      description: "등록된 전체 매장 수입니다.",
    },
    {
      label: "오늘 추가된 상담결과 수",
      value: String(todaySurveyResult.count ?? 0),
      description: "오늘 저장된 survey_answers 기준입니다.",
    },
    {
      label: "총 고객 수",
      value: String(customerCountResult.count ?? 0),
      description: "고객 테이블의 전체 누적 수입니다.",
    },
  ];
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
          Overview
        </p>
        <h1 className="text-3xl font-semibold text-zinc-950">
          본사 관리자 대시보드
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-zinc-600">
          전체 매장 현황과 오늘의 상담 결과를 빠르게 확인하고, 매장 승인/정지
          상태를 관리할 수 있습니다.
        </p>
        <div>
          <Link
            href="/admin/stores"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            매장 관리로 이동
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-black/10 shadow-sm">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-4xl font-semibold text-zinc-950">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-zinc-600">
              {stat.description}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle>관리 포인트</CardTitle>
          <CardDescription>
            신규 매장 승인, 상태 변경, 전체 집계를 이곳에서 확인합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm leading-7 text-zinc-600 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            매장 승인 여부를 확인하고 상태를 즉시 변경합니다.
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            오늘 추가된 상담 결과와 전체 고객 수를 빠르게 확인합니다.
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            본사 계정만 접근 가능하도록 미들웨어로 보호합니다.
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
