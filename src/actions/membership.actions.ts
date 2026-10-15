"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

const membershipSectionSchema = z.enum([
  "WHY_JOIN",
  "BENEFIT",
  "REQUIREMENT",
  "HOW_TO_REGISTER",
  "FAQ",
]);

const contentStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

const membershipSchema = z.object({
  section: membershipSectionSchema,

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
 * publishMembershipInfo().
 */
const membershipUpdateSchema = membershipSchema.extend({
  status: z.enum(["DRAFT", "ARCHIVED"]),
});

type MembershipUpdateInput = z.infer<
  typeof membershipUpdateSchema
>;

/**
 * Schema untuk CREATE.
 *
 * Status tidak boleh dikirim dari client.
 * Record baru selalu dibuat sebagai DRAFT.
 */
const membershipCreateSchema = membershipSchema.omit({
  status: true,
});

type MembershipCreateInput = z.infer<
  typeof membershipCreateSchema
>;

/**
 * Validasi konflik sortOrder.
 *
 * Aturan:
 * - ARCHIVED tidak diperhitungkan.
 * - Satu section dapat memiliki satu DRAFT
 *   pada sortOrder tertentu.
 * - Satu section dapat memiliki satu PUBLISHED
 *   pada sortOrder tertentu.
 * - DRAFT dan PUBLISHED boleh memiliki
 *   sortOrder yang sama karena digunakan untuk
 *   workflow replacement/versioning.
 */
async function validateMembershipSortOrder(
  section: MembershipCreateInput["section"],
  sortOrder: number,
  status: "DRAFT" | "PUBLISHED",
  excludeId?: string,
) {
  const conflictingContent =
    await prisma.membershipInfo.findFirst({
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
 * Mengambil seluruh MembershipInfo untuk
 * kebutuhan Admin Dashboard.
 */
type MembershipListItem = {
  id: string;
  section:
    | "WHY_JOIN"
    | "BENEFIT"
    | "REQUIREMENT"
    | "HOW_TO_REGISTER"
    | "FAQ";
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

export async function getMembershipInfos(): Promise<
  ActionResult<MembershipListItem[]>
> {
  try {
    await requireAdmin();

    const contents = await getMembershipQuery();

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

async function getMembershipQuery() {
  return prisma.membershipInfo.findMany({
    orderBy: [
      { section: "asc" },
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],

    include: {
      media: true,
    },
  });
}

/**
 * CREATE
 *
 * Record baru selalu dibuat sebagai DRAFT.
 */
export async function createMembershipInfo(
  input: MembershipCreateInput,
): Promise<
  ActionResult<
    Awaited<ReturnType<typeof createMembershipQuery>>
  >
> {
  try {
    const admin = await requireAdmin();

    const validated =
      membershipCreateSchema.parse(input);

    await validateMembershipSortOrder(
      validated.section,
      validated.sortOrder,
      "DRAFT",
    );

    const content = await createMembershipQuery(
      validated,
      admin.id,
    );

    revalidatePath("/admin/membership");

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function createMembershipQuery(
  input: MembershipCreateInput,
  adminId: string,
) {
  return prisma.membershipInfo.create({
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
 * Mengubah data MembershipInfo.
 *
 * Jika record saat ini PUBLISHED, statusnya
 * tetap PUBLISHED. Status tidak dapat diubah
 * melalui update biasa.
 */
export async function updateMembershipInfo(
  id: string,
  input: MembershipUpdateInput,
): Promise<
  ActionResult<
    Awaited<ReturnType<typeof updateMembershipQuery>>
  >
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Membership Info ID wajib diisi.",
      );
    }

    const validated =
      membershipUpdateSchema.parse(input);

    const content = await updateMembershipQuery(
      id,
      validated,
      admin.id,
    );

    revalidatePath("/admin/membership");

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function updateMembershipQuery(
  id: string,
  input: MembershipUpdateInput,
  adminId: string,
) {
  const existingContent =
    await prisma.membershipInfo.findUnique({
      where: {
        id,
      },
    });

  if (!existingContent) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "Membership Info tidak ditemukan.",
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
    await validateMembershipSortOrder(
      input.section,
      input.sortOrder,
      nextStatus,
      id,
    );
  }

  return prisma.membershipInfo.update({
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
export async function archiveMembershipInfo(
  id: string,
): Promise<
  ActionResult<
    Awaited<ReturnType<typeof archiveMembershipQuery>>
  >
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Membership Info ID wajib diisi.",
      );
    }

    const content = await archiveMembershipQuery(
      id,
      admin.id,
    );

    revalidatePath("/admin/membership");

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function archiveMembershipQuery(
  id: string,
  adminId: string,
) {
  const existingContent =
    await prisma.membershipInfo.findUnique({
      where: {
        id,
      },
    });

  if (!existingContent) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      "Membership Info tidak ditemukan.",
    );
  }

  return prisma.membershipInfo.update({
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
 * Menerbitkan satu MembershipInfo.
 *
 * Jika sudah ada PUBLISHED pada section yang
 * sama, konten tersebut diubah menjadi ARCHIVED
 * dalam transaction yang sama.
 */
export async function publishMembershipInfo(
  id: string,
): Promise<
  ActionResult<
    Awaited<ReturnType<typeof publishMembershipQuery>>
  >
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Membership Info ID wajib diisi.",
      );
    }

    const content = await publishMembershipQuery(
      id,
      admin.id,
    );

    revalidatePath("/admin/membership");

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function publishMembershipQuery(
  id: string,
  adminId: string,
) {
  return prisma.$transaction(async (tx) => {
    const target =
      await tx.membershipInfo.findUnique({
        where: {
          id,
        },
      });

    if (!target) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Membership Info tidak ditemukan.",
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
    await tx.membershipInfo.updateMany({
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
    return tx.membershipInfo.update({
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