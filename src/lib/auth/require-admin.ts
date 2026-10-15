import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppError, ERROR_CODES } from "@/lib/errors";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AppError(
      ERROR_CODES.AUTH_REQUIRED,
      "Authentication required.",
    );
  }

  if (session.user.role !== "ADMIN") {
    throw new AppError(
      ERROR_CODES.FORBIDDEN,
      "Admin access required.",
    );
  }

  const admin = await prisma.admin.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!admin) {
    throw new AppError(
      ERROR_CODES.AUTH_REQUIRED,
      "Admin account not found.",
    );
  }

  if (!admin.isActive || admin.role !== "ADMIN") {
    throw new AppError(
      ERROR_CODES.FORBIDDEN,
      "Admin access forbidden.",
    );
  }

  return admin;
}