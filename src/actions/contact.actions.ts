
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";
import { AppError, ERROR_CODES } from "@/lib/errors";

const contactSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, "Alamat wajib diisi."),

  phone: z
    .string()
    .trim()
    .max(50, "Nomor telepon maksimal 50 karakter.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .max(150, "Email maksimal 150 karakter.")
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Format email tidak valid.",
    )
    .optional()
    .or(z.literal("")),

  whatsapp: z
    .string()
    .trim()
    .max(50, "Nomor WhatsApp maksimal 50 karakter.")
    .optional()
    .or(z.literal("")),

  socialLinks: z
    .object({
      instagram: z.string().trim().optional(),
      facebook: z.string().trim().optional(),
      youtube: z.string().trim().optional(),
      tiktok: z.string().trim().optional(),
    })
    .nullable(),

  latitude: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (Number.isFinite(Number(value)) &&
          Number(value) >= -90 &&
          Number(value) <= 90),
      "Latitude harus berada antara -90 dan 90.",
    ),

  longitude: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (Number.isFinite(Number(value)) &&
          Number(value) >= -180 &&
          Number(value) <= 180),
      "Longitude harus berada antara -180 dan 180.",
    ),

  mapUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.url().safeParse(value).success,
      "URL peta tidak valid.",
    ),
});

type ContactInput = z.infer<typeof contactSchema>;

export type ContactInfoItem = {
  id: string;
  address: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  } | null;
  latitude: string | null;
  longitude: string | null;
  mapUrl: string | null;
  updatedAt: Date;
};

function serializeContact(contact: {
  id: string;
  address: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  socialLinks: unknown;
  latitude: { toString(): string } | null;
  longitude: { toString(): string } | null;
  mapUrl: string | null;
  updatedAt: Date;
}): ContactInfoItem {
  const links =
    contact.socialLinks &&
    typeof contact.socialLinks === "object" &&
    !Array.isArray(contact.socialLinks)
      ? (contact.socialLinks as Record<string, unknown>)
      : null;

  return {
    id: contact.id,
    address: contact.address,
    phone: contact.phone,
    email: contact.email,
    whatsapp: contact.whatsapp,
    socialLinks: links
      ? {
          instagram:
            typeof links.instagram === "string"
              ? links.instagram
              : "",
          facebook:
            typeof links.facebook === "string"
              ? links.facebook
              : "",
          youtube:
            typeof links.youtube === "string"
              ? links.youtube
              : "",
          tiktok:
            typeof links.tiktok === "string"
              ? links.tiktok
              : "",
        }
      : null,
    latitude: contact.latitude?.toString() ?? null,
    longitude: contact.longitude?.toString() ?? null,
    mapUrl: contact.mapUrl,
    updatedAt: contact.updatedAt,
  };
}

export async function getContactInfo(): Promise<
  ActionResult<ContactInfoItem | null>
> {
  try {
    await requireAdmin();

    const contact = await prisma.contactInfo.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      data: contact ? serializeContact(contact) : null,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateContactInfo(
  id: string,
  input: ContactInput,
): Promise<ActionResult<ContactInfoItem>> {
  try {
    const admin = await requireAdmin();

    const parsed = contactSchema.safeParse(input);

    if (!parsed.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Data kontak tidak valid.",
      );
    }

    const existing = await prisma.contactInfo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Data kontak tidak ditemukan.",
      );
    }

    const data = parsed.data;

    const contact = await prisma.contactInfo.update({
      where: { id },
      data: {
        address: data.address,
        phone: data.phone || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        socialLinks: data.socialLinks ?? undefined,
        latitude: data.latitude === "" ? null : data.latitude,
        longitude: data.longitude === "" ? null : data.longitude,
        mapUrl: data.mapUrl || null,
        updatedById: admin.id,
      },
    });

    revalidatePath("/admin/contact");
    revalidatePath("/");

    return {
      success: true,
      data: serializeContact(contact),
    };
  } catch (error) {
    return handleActionError(error);
  }
}
