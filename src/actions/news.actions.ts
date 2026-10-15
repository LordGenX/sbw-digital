"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

const contentStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

const newsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul wajib diisi.")
    .max(200, "Judul maksimal 200 karakter."),

  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi.")
    .max(220, "Slug maksimal 220 karakter.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.",
    ),

  excerpt: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  content: z
    .string()
    .trim()
    .min(1, "Konten wajib diisi."),

  publishedAt: z
    .coerce
    .date()
    .optional()
    .nullable(),

  category: z
    .string()
    .trim()
    .max(100, "Kategori maksimal 100 karakter.")
    .optional()
    .or(z.literal("")),

  mediaId: z
    .string()
    .uuid("Media ID tidak valid.")
    .optional()
    .or(z.literal("")),

  status: contentStatusSchema,

  metaTitle: z
    .string()
    .trim()
    .max(200, "Meta title maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),

  metaDescription: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

const newsCreateSchema = newsSchema.omit({
  status: true,
});

const newsUpdateSchema = newsSchema.extend({
  status: z.enum(["DRAFT", "ARCHIVED"]),
});

type NewsCreateInput = z.infer<typeof newsCreateSchema>;
type NewsUpdateInput = z.infer<typeof newsUpdateSchema>;

/**
 * GET
 *
 * Mengambil seluruh berita untuk Admin Dashboard.
 */
export async function getNews(): Promise<
  ActionResult<Awaited<ReturnType<typeof getNewsQuery>>>
> {
  try {
    await requireAdmin();

    const news = await getNewsQuery();

    return {
      success: true,
      data: news,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function getNewsQuery() {
  return prisma.news.findMany({
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      media: true,
    },
  });
}

/**
 * CREATE
 *
 * Berita baru selalu dibuat sebagai DRAFT.
 */
export async function createNews(
  input: NewsCreateInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof createNewsQuery>>>
> {
  try {
    const admin = await requireAdmin();

    const validated = newsCreateSchema.parse(input);

    await validateNewsSlug(validated.slug);

    const news = await createNewsQuery(
      validated,
      admin.id,
    );

    revalidatePath("/admin/news");

    return {
      success: true,
      data: news,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function createNewsQuery(
  input: NewsCreateInput,
  adminId: string,
) {
  return prisma.news.create({
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      content: input.content,
      publishedAt: input.publishedAt ?? null,
      category: input.category || null,
      mediaId: input.mediaId || null,
      status: "DRAFT",
      metaTitle: input.metaTitle || null,
      metaDescription: input.metaDescription || null,
      createdById: adminId,
      updatedById: adminId,
    },

    include: {
      media: true,
    },
  });
}

/**
 * UPDATE
 *
 * Published tetap Published ketika diedit.
 * Publishing dilakukan melalui publishNews().
 */
export async function updateNews(
  id: string,
  input: NewsUpdateInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof updateNewsQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "News ID wajib diisi.",
      );
    }

    const validated = newsUpdateSchema.parse(input);

    const news = await updateNewsQuery(
      id,
      validated,
      admin.id,
    );

    revalidatePath("/admin/news");

    return {
      success: true,
      data: news,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function updateNewsQuery(
  id: string,
  input: NewsUpdateInput,
  adminId: string,
) {
  const existingNews = await prisma.news.findUnique({
    where: {
      id,
    },
  });

  if (!existingNews) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "Berita tidak ditemukan.",
    );
  }

  if (input.slug !== existingNews.slug) {
    await validateNewsSlug(input.slug, id);
  }

  const nextStatus =
    existingNews.status === "PUBLISHED"
      ? "PUBLISHED"
      : input.status;

  return prisma.news.update({
    where: {
      id,
    },

    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      content: input.content,
      publishedAt: input.publishedAt ?? null,
      category: input.category || null,
      mediaId: input.mediaId || null,
      status: nextStatus,
      metaTitle: input.metaTitle || null,
      metaDescription: input.metaDescription || null,
      updatedById: adminId,
    },

    include: {
      media: true,
    },
  });
}

/**
 * ARCHIVE
 *
 * Mengarsipkan berita tanpa menghapus record.
 */
export async function archiveNews(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof archiveNewsQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "News ID wajib diisi.",
      );
    }

    const news = await archiveNewsQuery(
      id,
      admin.id,
    );

    revalidatePath("/admin/news");

    return {
      success: true,
      data: news,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function archiveNewsQuery(
  id: string,
  adminId: string,
) {
  const existingNews = await prisma.news.findUnique({
    where: {
      id,
    },
  });

  if (!existingNews) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "Berita tidak ditemukan.",
    );
  }

  return prisma.news.update({
    where: {
      id,
    },

    data: {
      status: "ARCHIVED",
      updatedById: adminId,
    },

    include: {
      media: true,
    },
  });
}

/**
 * PUBLISH
 *
 * Menerbitkan berita yang masih DRAFT.
 *
 * News tidak menggunakan full version history
 * dan tidak memiliki aturan satu Published per section.
 */
export async function publishNews(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof publishNewsQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "News ID wajib diisi.",
      );
    }

    const news = await publishNewsQuery(
      id,
      admin.id,
    );

    revalidatePath("/admin/news");

    return {
      success: true,
      data: news,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function publishNewsQuery(
  id: string,
  adminId: string,
) {
  const existingNews = await prisma.news.findUnique({
    where: {
      id,
    },
  });

  if (!existingNews) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "Berita tidak ditemukan.",
    );
  }

  if (existingNews.status !== "DRAFT") {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      "Hanya berita Draft yang dapat diterbitkan.",
    );
  }

  return prisma.news.update({
    where: {
      id,
    },

    data: {
      status: "PUBLISHED",
      publishedAt:
        existingNews.publishedAt ?? new Date(),
      updatedById: adminId,
    },

    include: {
      media: true,
    },
  });
}

/**
 * Validasi slug unik.
 */
async function validateNewsSlug(
  slug: string,
  excludeId?: string,
) {
  const existingNews = await prisma.news.findFirst({
    where: {
      slug,

      ...(excludeId
        ? {
            id: {
              not: excludeId,
            },
          }
        : {}),
    },

    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  if (existingNews) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Slug "${slug}" sudah digunakan oleh berita "${existingNews.title}".`,
    );
  }
}