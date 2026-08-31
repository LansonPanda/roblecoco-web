import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f5efe5,_#f8f6f2_40%,_#ffffff_78%)] text-zinc-950">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <AdminSidebar />

        <main className="min-w-0 rounded-xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
