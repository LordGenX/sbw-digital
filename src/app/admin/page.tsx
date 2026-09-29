import { redirect } from "next/navigation";

import { logout } from "@/actions/auth.actions";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AppError, ERROR_CODES } from "@/lib/errors";

export default async function AdminPage() {
  try {
    const admin = await requireAdmin();

    return (
      <main>
        <h1>Admin Dashboard</h1>

        <p>Selamat datang, {admin.name}.</p>
        <p>Email: {admin.email}</p>
        <p>Role: {admin.role}</p>

        <form action={logout}>
          <button type="submit">
            Logout
          </button>
        </form>
      </main>
    );
  } catch (error) {
    if (
      error instanceof AppError &&
      error.code === ERROR_CODES.AUTH_REQUIRED
    ) {
      redirect("/login");
    }

    if (
      error instanceof AppError &&
      error.code === ERROR_CODES.FORBIDDEN
    ) {
      redirect("/login");
    }

    throw error;
  }
}