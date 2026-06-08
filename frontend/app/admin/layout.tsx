import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}