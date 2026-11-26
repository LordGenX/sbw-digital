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

  contentKey: z
    .string()
    .trim()
    .min(1, "Content key wajib diisi.")
    .max(100, "Content key maksimal 100 karakter.")
    .regex(
      /^[A-Z0-9_]+$/,
      "Content key hanya boleh berisi huruf kapital, angka, dan underscore.",
    ),

  title: z
    .string()
    .trim()
    .min(1, "Judul wajib diisi.")
    .max(200, "Judul maksimal 200 karakter."),

  content: z.string().trim().min(1, "Konten wajib diisi."),

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

const membershipUpdateSchema = membershipSchema.extend({
  status: z.enum(["DRAFT", "ARCHIVED"]),
});

const membershipCreateSchema = membershipSchema.omit({
  status: true,
});

type MembershipUpdateInput = z.infer<
  typeof membershipUpdateSchema
>;

type MembershipCreateInput = z.infer<
  typeof membershipCreateSchema
>;

type MembershipSection = z.infer<
  typeof membershipSectionSchema
>;

type MembershipStatus = z.infer<
  typeof contentStatusSchema
>;

type MembershipSaveInput = Omit<
  MembershipCreateInput,
  "mediaId"
> & {
  mediaId?: string;
};

function normalizeInput(
  input: MembershipSaveInput,
): MembershipSaveInput {
  return {
    ...input,
    contentKey: input.contentKey.trim().toUpperCase(),
    mediaId: input.mediaId || undefined,
  };
}

/**
 * Memastikan kombinasi section + status + sortOrder unik.
 * contentKey tidak digunakan sebagai pembeda urutan.
 */
async function validateMembershipSortOrder(
  section: MembershipSection,
  sortOrder: number,
  status: MembershipStatus,
  excludeId?: string,
  tx: typeof prisma = prisma,
) {
  const conflictingContent = await tx.membershipInfo.findFirst({
    where: {
      section,
      status,
      sortOrder,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (conflictingContent) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Urutan ${sortOrder} sudah digunakan oleh konten "${conflictingContent.title}" dengan status ${status} pada section ${section}.`,
    );
  }
}

/**
 * Mencari urutan Archived terkecil yang tersedia.
 */
async function getNextArchivedSortOrder(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  section: MembershipSection,
): Promise<number> {
  const archivedContents = await tx.membershipInfo.findMany({
    where: {
      section,
      status: "ARCHIVED",
    },
    select: {
      sortOrder: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  const usedOrders = new Set(
    archivedContents.map((item) => item.sortOrder),
  );

  let nextOrder = 0;

  while (usedOrders.has(nextOrder)) {
    nextOrder += 1;
  }

  return nextOrder;
}

type MembershipListItem = {
  id: string;
  section: MembershipSection;
  contentKey: string;
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
  status: MembershipStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * GET
 */
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
        contentKey: item.contentKey,
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
      { status: "asc" },
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
 * Konten baru selalu dibuat sebagai Draft.
 */
export async function createMembershipInfo(
  input: MembershipCreateInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof createMembershipQuery>>>
> {
  try {
    const admin = await requireAdmin();
    const validated = membershipCreateSchema.parse(
      normalizeInput(input),
    );

    const content = await createMembershipQuery(
      validated,
      admin.id,
    );

    revalidateMembershipPaths();

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
  return prisma.$transaction(async (tx) => {
    await validateMembershipSortOrder(
      input.section,
      input.sortOrder,
      "DRAFT",
      undefined,
      tx as typeof prisma,
    );

    return tx.membershipInfo.create({
      data: {
        section: input.section,
        contentKey: input.contentKey,
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
  });
}

/**
 * UPDATE
 * Status Published tidak diubah melalui update biasa.
 */
export async function updateMembershipInfo(
  id: string,
  input: MembershipUpdateInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof updateMembershipQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Membership Info ID wajib diisi.",
      );
    }

    const validated = membershipUpdateSchema.parse(
      normalizeInput(input),
    );

    const content = await updateMembershipQuery(
      id,
      validated,
      admin.id,
    );

    revalidateMembershipPaths();

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
  return prisma.$transaction(async (tx) => {
    const existing = await tx.membershipInfo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Membership Info tidak ditemukan.",
      );
    }

    if (existing.status === "ARCHIVED") {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Konten Archived tidak dapat diperbarui melalui aksi ini.",
      );
    }

    const nextStatus: MembershipStatus =
      existing.status === "PUBLISHED"
        ? "PUBLISHED"
        : input.status;

    await validateMembershipSortOrder(
      input.section,
      input.sortOrder,
      nextStatus,
      id,
      tx as typeof prisma,
    );

    return tx.membershipInfo.update({
      where: { id },
      data: {
        section: input.section,
        contentKey: input.contentKey,
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
  });
}

/**
 * ARCHIVE
 * Perubahan form disimpan bersamaan dengan pengarsipan.
 */
export async function archiveMembershipInfo(
  id: string,
  input?: MembershipSaveInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof archiveMembershipQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Membership Info ID wajib diisi.",
      );
    }

    const validated = input
      ? membershipCreateSchema.parse(normalizeInput(input))
      : undefined;

    const content = await archiveMembershipQuery(
      id,
      admin.id,
      validated,
    );

    revalidateMembershipPaths();

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
  input?: MembershipCreateInput,
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.membershipInfo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Membership Info tidak ditemukan.",
      );
    }

    if (existing.status === "ARCHIVED") {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Konten sudah berstatus Archived.",
      );
    }

    const section = input?.section ?? existing.section;
    const sortOrder = input?.sortOrder ?? existing.sortOrder;

    // Urutan Archived dipilih otomatis agar tidak konflik.
    const archivedSortOrder =
      await getNextArchivedSortOrder(tx, section);

    return tx.membershipInfo.update({
      where: { id },
      data: {
        section,
        contentKey: input?.contentKey ?? existing.contentKey,
        title: input?.title ?? existing.title,
        content: input?.content ?? existing.content,
        mediaId: input ? input.mediaId || null : existing.mediaId,
        status: "ARCHIVED",
        sortOrder: archivedSortOrder,
        updatedById: adminId,
      },
      include: {
        media: true,
      },
    });
  });
}

/**
 * PUBLISH
 * Perubahan form disimpan bersamaan dengan publikasi.
 * Versi Published sebelumnya dengan section + contentKey
 * yang sama diarsipkan terlebih dahulu.
 */
export async function publishMembershipInfo(
  id: string,
  input?: MembershipSaveInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof publishMembershipQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Membership Info ID wajib diisi.",
      );
    }

    const validated = input
      ? membershipCreateSchema.parse(normalizeInput(input))
      : undefined;

    const content = await publishMembershipQuery(
      id,
      admin.id,
      validated,
    );

    revalidateMembershipPaths();

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
  input?: MembershipCreateInput,
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.membershipInfo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Membership Info tidak ditemukan.",
      );
    }

    if (existing.status !== "DRAFT") {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Hanya konten Draft yang dapat diterbitkan.",
      );
    }

    // Simpan perubahan form ke data sementara transaksi.
    const target = input
      ? await tx.membershipInfo.update({
          where: { id },
          data: {
            section: input.section,
            contentKey: input.contentKey,
            title: input.title,
            content: input.content,
            mediaId: input.mediaId || null,
            sortOrder: input.sortOrder,
            updatedById: adminId,
          },
        })
      : existing;

    // Tolak jika urutan Published dipakai kartu lain.
    const conflict = await tx.membershipInfo.findFirst({
      where: {
        section: target.section,
        status: "PUBLISHED",
        sortOrder: target.sortOrder,
        contentKey: {
          not: target.contentKey,
        },
      },
      select: {
        title: true,
      },
    });

    if (conflict) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        `Urutan ${target.sortOrder} sudah digunakan oleh konten Published "${conflict.title}" pada section ${target.section}.`,
      );
    }

    // Cari versi Published terdahulu untuk kartu yang sama.
    const previousPublished =
      await tx.membershipInfo.findMany({
        where: {
          section: target.section,
          contentKey: target.contentKey,
          status: "PUBLISHED",
          id: { not: id },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    // Arsipkan versi lama dengan urutan Archived yang tersedia.
    for (const previous of previousPublished) {
      const archivedSortOrder =
        await getNextArchivedSortOrder(tx, previous.section);

      await tx.membershipInfo.update({
        where: { id: previous.id },
        data: {
          status: "ARCHIVED",
          sortOrder: archivedSortOrder,
          updatedById: adminId,
        },
      });
    }

    // Publikasikan konten yang sudah diperbarui.
    return tx.membershipInfo.update({
      where: { id },
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

function revalidateMembershipPaths() {
  revalidatePath("/admin/membership");
  revalidatePath("/keanggotaan");
}