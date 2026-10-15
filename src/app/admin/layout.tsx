import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { AppError, ERROR_CODES } from "@/lib/errors";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let admin;

  try {
    admin = await requireAdmin();
  } catch (error) {
    if (
      error instanceof AppError &&
      (
        error.code === ERROR_CODES.AUTH_REQUIRED ||
        error.code === ERROR_CODES.FORBIDDEN
      )
    ) {
      redirect("/login");
    }

    throw error;
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AdminSidebar
        admin={{
          name: admin.name,
          email: admin.email,
        }}
      />

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Administration
            </p>
            <p className="text-xs text-gray-500">
              Kelola konten SBW Digital
            </p>
          </div>

          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
            {admin.role}
          </span>
        </header>

        <div className="mx-auto w-full max-w-7xl p-5 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}