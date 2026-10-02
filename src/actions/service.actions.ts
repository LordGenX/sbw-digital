"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

const serviceStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama layanan wajib diisi.")
    .max(150, "Nama layanan maksimal 150 karakter."),

  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi.")
    .max(180, "Slug maksimal 180 karakter.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.",
    ),

  shortDescription: z
    .string()
    .trim()
    .min(1, "Deskripsi singkat wajib diisi."),

  description: z
    .string()
    .trim()
    .min(1, "Deskripsi layanan wajib diisi."),

  mediaId: z
    .string()
    .uuid("Media ID tidak valid.")
    .optional()
    .or(z.literal("")),

  status: serviceStatusSchema,

  sortOrder: z
    .number()
    .int("Urutan harus berupa bilangan bulat.")
    .min(1, "Urutan minimal adalah 1."),

  metaTitle: z
    .string()
    .trim()
    .max(200, "Meta title maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),

  metaDescription: z
    .string()
    .trim()
    .max(200, "Meta description maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),
});

type ServiceInput = z.infer<typeof serviceSchema>;

// =========================================================
// GET
// =========================================================

export async function getServices(): Promise<
  ActionResult<Awaited<ReturnType<typeof getServicesQuery>>>
> {
  try {
    await requireAdmin();

    const services = await getServicesQuery();

    return {
      success: true,
      data: services,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function getServicesQuery() {
  return prisma.service.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
    include: {
      media: true,
    },
  });
}

// =========================================================
// UPDATE
// =========================================================

export async function updateService(
  id: string,
  input: ServiceInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof updateServiceQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Service ID wajib diisi.",
      );
    }

    const validated = serviceSchema.parse(input);

    const service = await updateServiceQuery(
      id,
      validated,
      admin.id,
    );

    revalidatePath("/admin/services");
    revalidatePath("/layanan");
    revalidatePath(`/layanan/${validated.slug}`);

    return {
      success: true,
      data: service,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function updateServiceQuery(
  id: string,
  input: ServiceInput,
  adminId: string,
) {
  const existingService =
    await prisma.service.findUnique({
      where: {
        id,
      },
    });

  if (!existingService) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "Layanan tidak ditemukan.",
    );
  }

  return prisma.service.update({
    where: {
      id,
    },
    data: {
      name: input.name,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: input.description,
      mediaId: input.mediaId || null,
      status: input.status,
      sortOrder: input.sortOrder,
      metaTitle: input.metaTitle || null,
      metaDescription: input.metaDescription || null,
      updatedById: adminId,
    },
  });
}

// =========================================================
// ARCHIVE
// =========================================================

export async function archiveService(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof archiveServiceQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Service ID wajib diisi.",
      );
    }

    const service = await archiveServiceQuery(
      id,
      admin.id,
    );

    revalidatePath("/admin/services");
    revalidatePath("/layanan");

    if (service.slug) {
      revalidatePath(`/layanan/${service.slug}`);
    }

    return {
      success: true,
      data: service,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function archiveServiceQuery(
  id: string,
  adminId: string,
) {
  const existingService =
    await prisma.service.findUnique({
      where: {
        id,
      },
    });

  if (!existingService) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "Layanan tidak ditemukan.",
    );
  }

  return prisma.service.update({
    where: {
      id,
    },
    data: {
      status: "ARCHIVED",
      updatedById: adminId,
    },
  });
}