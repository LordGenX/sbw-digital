"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { ERROR_CODES, AppError } from "@/lib/errors";
import type { ActionResult } from "@/lib/actions/action-result";
import { handleActionError } from "@/lib/actions/handle-action-error";

const heroSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul wajib diisi.")
    .max(200, "Judul maksimal 200 karakter."),

  description: z
    .string()
    .trim()
    .min(1, "Deskripsi wajib diisi."),

  videoUrl: z
    .string()
    .trim()
    .url("URL video tidak valid."),

  videoId: z
    .string()
    .trim()
    .min(1, "Video ID wajib diisi.")
    .max(50, "Video ID maksimal 50 karakter."),

  ctaText: z
    .string()
    .trim()
    .max(100, "CTA maksimal 100 karakter.")
    .optional(),

  ctaUrl: z
    .string()
    .trim()
    .url("CTA URL tidak valid.")
    .max(255, "CTA URL maksimal 255 karakter.")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
});

type HeroInput = z.infer<typeof heroSchema>;

export async function getHeroSection(): Promise<
  ActionResult<Awaited<ReturnType<typeof getHeroQuery>>>
> {
  try {
    await requireAdmin();

    const hero = await getHeroQuery();

    return {
      success: true,
      data: hero,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function getHeroQuery() {
  return prisma.heroSection.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function saveHeroSection(
  input: HeroInput,
): Promise<ActionResult<Awaited<ReturnType<typeof saveHeroQuery>>>> {
  try {
    const admin = await requireAdmin();

    const validated = heroSchema.parse(input);

    const hero = await saveHeroQuery(
      validated,
      admin.id,
    );

    revalidatePath("/admin/hero");

    return {
      success: true,
      data: hero,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function saveHeroQuery(
  input: HeroInput,
  adminId: string,
) {
  return prisma.$transaction(async (tx) => {
    if (input.isActive) {
      await tx.heroSection.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    return tx.heroSection.create({
      data: {
        title: input.title,
        description: input.description,
        videoUrl: input.videoUrl,
        videoId: input.videoId,
        ctaText: input.ctaText || null,
        ctaUrl: input.ctaUrl || null,
        isActive: input.isActive,
        createdById: adminId,
        updatedById: adminId,
      },
    });
  });
}

export async function updateHeroSection(
  id: string,
  input: HeroInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof updateHeroQuery>>>
> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Hero ID wajib diisi.",
      );
    }

    const validated = heroSchema.parse(input);

    const hero = await updateHeroQuery(
      id,
      validated,
      admin.id,
    );

    revalidatePath("/admin/hero");

    return {
      success: true,
      data: hero,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function updateHeroQuery(
  id: string,
  input: HeroInput,
  adminId: string,
) {
  return prisma.$transaction(async (tx) => {
    const existingHero = await tx.heroSection.findUnique({
      where: {
        id,
      },
    });

    if (!existingHero) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Hero tidak ditemukan.",
      );
    }

    if (input.isActive) {
      await tx.heroSection.updateMany({
        where: {
          isActive: true,
          NOT: {
            id,
          },
        },
        data: {
          isActive: false,
        },
      });
    }

    return tx.heroSection.update({
      where: {
        id,
      },
      data: {
        title: input.title,
        description: input.description,
        videoUrl: input.videoUrl,
        videoId: input.videoId,
        ctaText: input.ctaText || null,
        ctaUrl: input.ctaUrl || null,
        isActive: input.isActive,
        updatedById: adminId,
      },
    });
  });
}

export async function activateHeroSection(
  id: string,
): Promise<ActionResult<Awaited<ReturnType<typeof activateHeroQuery>>>> {
  try {
    const admin = await requireAdmin();

    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Hero ID wajib diisi.",
      );
    }

    const hero = await activateHeroQuery(id, admin.id);

    revalidatePath("/admin/hero");

    return {
      success: true,
      data: hero,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

async function activateHeroQuery(
  id: string,
  adminId: string,
) {
  return prisma.$transaction(async (tx) => {
    const hero = await tx.heroSection.findUnique({
      where: {
        id,
      },
    });

    if (!hero) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Hero tidak ditemukan.",
      );
    }

    await tx.heroSection.updateMany({
      where: {
        isActive: true,
        NOT: {
          id,
        },
      },
      data: {
        isActive: false,
      },
    });

    return tx.heroSection.update({
      where: {
        id,
      },
      data: {
        isActive: true,
        updatedById: adminId,
      },
    });
  });
}