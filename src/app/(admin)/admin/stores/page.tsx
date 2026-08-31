import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { approveStoreAction } from "./actions";

type StoreRow = {
  id: string;
  name: string | null;
  owner_name: string | null;
  phone: string | null;
  created_at: string | null;
  status: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getStatusLabel(status: string | null) {
  if (status === "approved") {
    return "승인 완료";
  }

  if (status === "suspended") {
    return "정지";
  }

  return "승인 대기";
}

function getBadgeClass(status: string | null) {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "suspended") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getActionLabel(status: string | null) {
  if (status === "approved") {
    return "정지";
  }

  if (status === "suspended") {
    return "정지 해제";
  }

  return "승인";
}

function getActionClass(status: string | null) {
  if (status === "approved") {
    return "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100";
  }

  if (status === "suspended") {
    return "border border-zinc-200 bg-zinc-950 text-white hover:bg-zinc-800";
  }

  return "border border-zinc-200 bg-zinc-950 text-white hover:bg-zinc-800";
}

async function getStores(): Promise<StoreRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stores")
    .select("id, name, owner_name, phone, created_at, status")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminStoresPage() {
  const stores = await getStores();

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
          Store Management
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">매장 관리</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
          모든 매장 목록을 확인하고 상태를 즉시 승인 또는 정지로 변경할 수
          있습니다.
        </p>
      </div>

      <Card className="border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle>전체 매장 리스트</CardTitle>
          <CardDescription>
            매장명, 이름, 연락처, 가입일, 상태를 한 번에 확인합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>매장명</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>전화번호</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => {
                  const status = store.status ?? "pending";
                  const actionLabel = getActionLabel(status);

                  return (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium text-zinc-900">
                        {store.name || "-"}
                      </TableCell>
                      <TableCell>{store.owner_name || "-"}</TableCell>
                      <TableCell>{store.phone || "-"}</TableCell>
                      <TableCell>{formatDate(store.created_at)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium ${getBadgeClass(
                            status,
                          )}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={approveStoreAction}>
                          <input
                            type="hidden"
                            name="storeId"
                            value={store.id}
                          />
                          <input
                            type="hidden"
                            name="currentStatus"
                            value={status}
                          />
                          <button
                            type="submit"
                            className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition ${getActionClass(
                              status,
                            )}`}
                          >
                            {actionLabel}
                          </button>
                        </form>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-500">
              아직 등록된 매장이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
