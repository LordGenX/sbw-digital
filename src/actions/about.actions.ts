"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

const aboutSectionSchema = z.enum([
  "HISTORY",
  "VISION_MISSION",
  "PROFILE",
  "ORGANIZATION",
  "ACHIEVEMENT",
]);

const contentStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

const aboutSchema = z.object({
  section: aboutSectionSchema,

  title: z
    .string()
    .trim()
    .min(1, "Judul wajib diisi.")
    .max(200, "Judul maksimal 200 karakter."),

  content: z
    .string()
    .trim()
    .min(1, "Konten wajib diisi."),

  mediaId: z
    .string()
    .uuid("Media ID tidak valid.")
    .optional()
    .or(z.literal("")),

  status: contentStatusSchema,

  sortOrder: z
    .number()
    .int("Urutan harus berupa bilangan bulat.")
    .min(0, "Urutan tidak boleh negatif."),
});

/**
 * Schema untuk UPDATE.
 *
 * Status PUBLISHED tidak dapat diubah melalui
 * update biasa. Publishing dilakukan melalui
 * publishAboutContent().
 */
const aboutUpdateSchema = aboutSchema.extend({
  status: z.enum(["DRAFT", "ARCHIVED"]),
});

type AboutUpdateInput = z.infer<
  typeof aboutUpdateSchema
>;

/**
 * Schema untuk CREATE.
 *
 * Status tidak boleh dikirim dari client.
 * Record baru selalu dibuat sebagai DRAFT.
 */
const aboutCreateSchema = aboutSchema.omit({
  status: true,
});

type AboutCreateInput = z.infer<
  typeof aboutCreateSchema
>;

/**
 * Validasi konflik sortOrder.
 *
 * Aturan:
 *
 * - ARCHIVED tidak diperhitungkan.
 * - Satu section dapat memiliki satu DRAFT
 *   pada sortOrder tertentu.
 * - Satu section dapat memiliki satu PUBLISHED
 *   pada sortOrder tertentu.
 * - DRAFT dan PUBLISHED boleh memiliki
 *   sortOrder yang sama karena digunakan untuk
 *   workflow replacement/versioning.
 */
async function validateAboutSortOrder(
  section: AboutCreateInput["section"],
  sortOrder: number,
  status: "DRAFT" | "PUBLISHED",
  excludeId?: string,
) {
  const conflictingContent =
    await prisma.aboutContent.findFirst({
      where: {
        section,
        sortOrder,
        status,

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
        section: true,
        status: true,
        sortOrder: true,
      },
    });

  if (conflictingContent) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Urutan ${sortOrder} sudah digunakan untuk konten ${status} pada section ${section}.`,
    );
  }
}

/**
 * GET
 *
 * Mengambil seluruh konten About untuk
 * kebutuhan Admin Dashboard.
 */
type AboutListItem = {
  id: string;
  section:
    | "HISTORY"
    | "VISION_MISSION"
    | "PROFILE"
    | "ORGANIZATION"
    | "ACHIEVEMENT";
  title: string;
  content: string;
  mediaId: string | null;
  media: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: string;
    altText: string | null;
  } | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAboutContents(): Promise<
  ActionResult<AboutListItem[]>
> {
  try {
    await requireAdmin();

    const contents = await prisma.aboutContent.findMany({
      include: {
        media: true,
      },
      orderBy: [
        { section: "asc" },
        { sortOrder: "asc" },
      ],
    });

    return {
      success: true,
      data: contents.map((item) => ({
        id: item.id,
        section: item.section,
        title: item.title,
        content: item.content,
        mediaId: item.mediaId,
        media: item.media
          ? {
              id: item.media.id,
              fileName: item.media.fileName,
              fileUrl: item.media.fileUrl,
              mimeType: item.media.mimeType,
              fileSize: item.media.fileSize.toString(),
              altText: item.media.altText,
            }
          : null,
        status: item.status,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * CREATE
 *
 * Record baru selalu dibuat sebagai DRAFT.
 */
export async function createAboutContent(
  input: AboutCreateInput,
): Promise<
  ActionResult<
    Awaited<ReturnType<typeof createAboutQuery>>
  >
> {
  try {
    const admin = await requireAdmin();

    const validated =
      aboutCreateSchema.parse(input);

    await validateAboutSortOrder(
      validated.section,
      validated.sortOrder,
      "DRAFT",
    );

    const content =
      await createAboutQuery(
        validated,
        admin.id,
      );

    revalidatePath("/admin/about");

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function createAboutQuery(
  input: AboutCreateInput,
  adminId: string,
) {
  return prisma.aboutContent.create({
    data: {
      section: input.section,
      title: input.title,
      content: input.content,
      mediaId: input.mediaId || null,

      status: "DRAFT",

      sortOrder: input.sortOrder,

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
 * Mengubah data About.
 *
 * Jika record saat ini PUBLISHED, statusnya
 * tetap PUBLISHED. Status tidak dapat diubah
 * melalui update biasa.
 */
export async function updateAboutContent(
  id: string,
  input: AboutUpdateInput,
): Promise<
  ActionResult<
    Awaited<ReturnType<typeof updateAboutQuery>>
  >
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "About Content ID wajib diisi.",
      );
    }

    const validated =
      aboutUpdateSchema.parse(input);

    const content =
      await updateAboutQuery(
        id,
        validated,
        admin.id,
      );

    revalidatePath("/admin/about");

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function updateAboutQuery(
  id: string,
  input: AboutUpdateInput,
  adminId: string,
) {
  const existingContent =
    await prisma.aboutContent.findUnique({
      where: {
        id,
      },
    });

  if (!existingContent) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "About Content tidak ditemukan.",
    );
  }

  /**
   * Published harus tetap Published ketika
   * diedit melalui update.
   */
  const nextStatus =
    existingContent.status === "PUBLISHED"
      ? "PUBLISHED"
      : input.status;

  /**
   * ARCHIVED tidak membutuhkan pengecekan
   * duplicate sortOrder karena record archived
   * tidak dianggap aktif.
   */
  if (nextStatus !== "ARCHIVED") {
    await validateAboutSortOrder(
      input.section,
      input.sortOrder,
      nextStatus,
      id,
    );
  }

  return prisma.aboutContent.update({
    where: {
      id,
    },

    data: {
      section: input.section,
      title: input.title,
      content: input.content,
      mediaId: input.mediaId || null,

      status: nextStatus,

      sortOrder: input.sortOrder,

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
 * Mengarsipkan konten tanpa menghapus record.
 */
export async function archiveAboutContent(
  id: string,
): Promise<
  ActionResult<
    Awaited<ReturnType<typeof archiveAboutQuery>>
  >
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "About Content ID wajib diisi.",
      );
    }

    const content =
      await archiveAboutQuery(
        id,
        admin.id,
      );

    revalidatePath("/admin/about");

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function archiveAboutQuery(
  id: string,
  adminId: string,
) {
  const existingContent =
    await prisma.aboutContent.findUnique({
      where: {
        id,
      },
    });

  if (!existingContent) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "About Content tidak ditemukan.",
    );
  }

  return prisma.aboutContent.update({
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
 * Menerbitkan satu konten About.
 *
 * Jika sudah ada PUBLISHED pada section yang
 * sama, konten tersebut diubah menjadi ARCHIVED
 * dalam transaction yang sama.
 */
export async function publishAboutContent(
  id: string,
): Promise<
  ActionResult<
    Awaited<ReturnType<typeof publishAboutQuery>>
  >
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "About Content ID wajib diisi.",
      );
    }

    const content =
      await publishAboutQuery(
        id,
        admin.id,
      );

    revalidatePath("/admin/about");

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function publishAboutQuery(
  id: string,
  adminId: string,
) {
  return prisma.$transaction(async (tx) => {
    const target =
      await tx.aboutContent.findUnique({
        where: {
          id,
        },
      });

    if (!target) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "About Content tidak ditemukan.",
      );
    }

    /**
     * Target harus berasal dari DRAFT.
     *
     * Published tidak perlu dipublish ulang.
     */
    if (target.status !== "DRAFT") {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Hanya konten Draft yang dapat diterbitkan.",
      );
    }

    /**
     * Archive PUBLISHED lama pada section
     * yang sama.
     */
    await tx.aboutContent.updateMany({
      where: {
        section: target.section,
        status: "PUBLISHED",
        id: {
          not: id,
        },
      },

      data: {
        status: "ARCHIVED",
        updatedById: adminId,
      },
    });

    /**
     * Target menjadi PUBLISHED.
     *
     * Partial unique index pada database tetap
     * menjadi safety net untuk aturan satu
     * PUBLISHED per section.
     */
    return tx.aboutContent.update({
      where: {
        id,
      },

      data: {
        status: "PUBLISHED",
        updatedById: adminId,
      },

      include: {
        media: true,
      },
    });
  });
}