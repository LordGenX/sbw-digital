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
 * Status PUBLISHED tidak dapat diubah melalui
 * update biasa. Publishing menggunakan action
 * publishAboutContent().
 */
const aboutUpdateSchema = aboutSchema.extend({
  status: z.enum(["DRAFT", "ARCHIVED"]),
});

type AboutUpdateInput = z.infer<
  typeof aboutUpdateSchema
>;

/**
 * Konten baru selalu dibuat sebagai DRAFT.
 */
const aboutCreateSchema = aboutSchema.omit({
  status: true,
});

type AboutCreateInput = z.infer<
  typeof aboutCreateSchema
>;

type AboutSection = z.infer<typeof aboutSectionSchema>;

/**
 * Validasi sortOrder berdasarkan section dan status.
 *
 * DRAFT:
 * - sortOrder unik dalam section yang sama.
 * - Berlaku untuk semua section.
 *
 * PUBLISHED:
 * - Validasi keunikan sortOrder pada section yang sama.
 * - Untuk section selain ACHIEVEMENT, aturan satu
 *   Published per section tetap berlaku.
 *
 * ARCHIVED:
 * - Tidak ikut dalam validasi.
 *
 * excludeId digunakan ketika memperbarui konten
 * agar konten itu sendiri tidak dianggap konflik.
 */
async function validateAboutSortOrder(
  section: AboutSection,
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
    const statusLabel =
      status === "DRAFT" ? "Draft" : "Published";

    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Urutan ${sortOrder} sudah digunakan oleh konten ${statusLabel} "${conflictingContent.title}" pada section ${section}. Gunakan urutan lain.`,
    );
  }
}

/**
 * Validasi aturan satu Published per section.
 *
 * Achievement boleh memiliki beberapa Published,
 * selama sortOrder masing-masing berbeda.
 *
 * Section selain Achievement tetap hanya boleh
 * memiliki satu Published.
 *
 * Pengecekan ini dilakukan sebelum publikasi.
 */
async function validatePublishedSection(
  section: AboutSection,
  excludeId?: string,
) {
  if (section === "ACHIEVEMENT") {
    return;
  }

  const existingPublished =
    await prisma.aboutContent.findFirst({
      where: {
        section,
        status: "PUBLISHED",

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
      },
    });

  if (existingPublished) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Section ${section} sudah memiliki konten Published "${existingPublished.title}". Arsipkan konten tersebut terlebih dahulu.`,
    );
  }
}

/**
 * GET
 *
 * Mengambil seluruh konten About untuk Admin.
 */
type AboutListItem = {
  id: string;
  section: AboutSection;
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
 * Konten baru selalu dibuat sebagai DRAFT.
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
    const validated = aboutCreateSchema.parse(input);

    // Draft harus memiliki sortOrder unik
    // pada section yang sama.
    await validateAboutSortOrder(
      validated.section,
      validated.sortOrder,
      "DRAFT",
    );

    const content = await createAboutQuery(
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
 * Jika konten sudah Published, statusnya tetap
 * Published. Status tidak dapat diubah melalui
 * update biasa.
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

    const validated = aboutUpdateSchema.parse(input);

    const content = await updateAboutQuery(
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
   * Konten Published tetap Published.
   *
   * Konten Draft dapat menjadi Draft atau Archived.
   * Konten Archived dapat tetap Archived atau
   * dikembalikan menjadi Draft melalui update.
   */
  const nextStatus =
    existingContent.status === "PUBLISHED"
      ? "PUBLISHED"
      : input.status;

  /**
   * Validasi sortOrder hanya untuk status aktif.
   */
  if (nextStatus !== "ARCHIVED") {
    await validateAboutSortOrder(
      input.section,
      input.sortOrder,
      nextStatus,
      id,
    );
  }

  /**
   * Pertahankan aturan satu Published per section
   * untuk section selain Achievement.
   */
  if (
    nextStatus === "PUBLISHED" &&
    existingContent.section !== input.section
  ) {
    await validatePublishedSection(
      input.section,
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

    const content = await archiveAboutQuery(
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
 * Menerbitkan konten Draft.
 *
 * Achievement:
 * - Boleh memiliki beberapa konten Published.
 * - sortOrder setiap konten Published harus unik.
 *
 * Section selain Achievement:
 * - Konten Published sebelumnya harus diarsipkan.
 */
export async function publishAboutContent(
  id: string,
  requestedSortOrder?: number,
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

    if (
      requestedSortOrder !== undefined &&
      (
        !Number.isInteger(requestedSortOrder) ||
        requestedSortOrder < 0
      )
    ) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Urutan harus berupa bilangan bulat dan tidak boleh negatif.",
      );
    }

    const content = await publishAboutQuery(
      id,
      admin.id,
      requestedSortOrder,
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
  requestedSortOrder?: number,
) {
  return prisma.$transaction(async (tx) => {
    const target = await tx.aboutContent.findUnique({
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

    if (target.status !== "DRAFT") {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Hanya konten Draft yang dapat diterbitkan.",
      );
    }

    // Gunakan nilai terbaru dari form jika tersedia.
    const effectiveSortOrder =
      requestedSortOrder ?? target.sortOrder;

    if (
      !Number.isInteger(effectiveSortOrder) ||
      effectiveSortOrder < 0
    ) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Urutan harus berupa bilangan bulat dan tidak boleh negatif.",
      );
    }

    /**
     * Cek konflik Published berdasarkan section
     * dan sortOrder sebelum mengubah status.
     */
    const conflictingPublished =
      await tx.aboutContent.findFirst({
        where: {
          section: target.section,
          status: "PUBLISHED",
          sortOrder: effectiveSortOrder,
          id: {
            not: id,
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

    /**
     * Untuk Achievement, sortOrder Published
     * wajib unik.
     */
    if (
      target.section === "ACHIEVEMENT" &&
      conflictingPublished
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        `Urutan ${effectiveSortOrder} sudah digunakan oleh Published "${conflictingPublished.title}" pada section Achievement.`,
      );
    }

    /**
     * Section selain Achievement hanya boleh
     * memiliki satu konten Published.
     *
     * Konten Published lama diarsipkan sebelum
     * konten Draft diterbitkan.
     */
    if (target.section !== "ACHIEVEMENT") {
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
    }

    /**
     * Terbitkan konten dengan sortOrder terbaru.
     */
    return tx.aboutContent.update({
      where: {
        id,
      },
      data: {
        status: "PUBLISHED",
        sortOrder: effectiveSortOrder,
        updatedById: adminId,
      },
      include: {
        media: true,
      },
    });
  });
}