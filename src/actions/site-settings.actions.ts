"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

const siteSettingsSchema = z.object({
  siteName: z
    .string()
    .trim()
    .min(1, "Nama situs wajib diisi.")
    .max(150, "Nama situs maksimal 150 karakter."),
  siteDescription: z
    .string()
    .trim()
    .max(5000, "Deskripsi situs maksimal 5000 karakter.")
    .optional()
    .or(z.literal("")),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export type SiteSettingsItem = {
  id: string;
  siteName: string;
  siteDescription: string | null;
  updatedAt: Date;
};

export async function getSiteSettings(): Promise<
  ActionResult<SiteSettingsItem | null>
> {
  try {
    await requireAdmin();

    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      data: settings
        ? {
            id: settings.id,
            siteName: settings.siteName,
            siteDescription: settings.siteDescription,
            updatedAt: settings.updatedAt,
          }
        : null,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateSiteSettings(
  id: string,
  input: SiteSettingsInput,
): Promise<ActionResult<SiteSettingsItem>> {
  try {
    const admin = await requireAdmin();

    const parsed = siteSettingsSchema.safeParse(input);

    if (!parsed.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Data pengaturan situs tidak valid.",
      );
    }

    const existing = await prisma.siteSettings.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Pengaturan situs tidak ditemukan.",
      );
    }

    const data = parsed.data;

    const settings = await prisma.siteSettings.update({
      where: { id },
      data: {
        siteName: data.siteName,
        siteDescription: data.siteDescription || null,
        updatedById: admin.id,
      },
    });

    revalidatePath("/admin/site-settings");
    revalidatePath("/");

    return {
      success: true,
      data: {
        id: settings.id,
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        updatedAt: settings.updatedAt,
      },
    };
  } catch (error) {
    return handleActionError(error);
  }
}