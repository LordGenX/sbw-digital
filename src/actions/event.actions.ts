"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";

const contentStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul agenda wajib diisi.")
    .max(200, "Judul agenda maksimal 200 karakter."),

  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi.")
    .max(220, "Slug maksimal 220 karakter.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.",
    ),

  description: z
    .string()
    .trim()
    .min(1, "Deskripsi agenda wajib diisi."),

  location: z
    .string()
    .trim()
    .max(255, "Lokasi maksimal 255 karakter.")
    .optional()
    .or(z.literal("")),

  startAt: z.coerce.date(),

  endAt: z.coerce.date().optional().nullable(),

  mediaId: z
    .string()
    .uuid("Media ID tidak valid.")
    .optional()
    .or(z.literal("")),

  status: contentStatusSchema,
});

const eventCreateSchema = eventSchema.omit({
  status: true,
});

const eventUpdateSchema = eventSchema.extend({
  status: z.enum(["DRAFT", "ARCHIVED"]),
});

async function validateEventSlug(
  slug: string,
  excludeId?: string,
) {
  const existingEvent = await prisma.event.findFirst({
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

  if (existingEvent) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Slug "${slug}" sudah digunakan oleh agenda "${existingEvent.title}".`,
    );
  }
}

type EventListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  startAt: Date;
  endAt: Date | null;
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
  createdAt: Date;
  updatedAt: Date;
};

export async function getEvents(): Promise<
  ActionResult<EventListItem[]>
> {
  try {
    await requireAdmin();

    const events = await prisma.event.findMany({
      orderBy: [
        {
          startAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        media: true,
      },
    });

    return {
      success: true,
      data: events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        location: event.location,
        startAt: event.startAt,
        endAt: event.endAt,
        mediaId: event.mediaId,
        media: event.media
          ? {
              id: event.media.id,
              fileName: event.media.fileName,
              fileUrl: event.media.fileUrl,
              mimeType: event.media.mimeType,
              fileSize: event.media.fileSize.toString(),
              altText: event.media.altText,
            }
          : null,
        status: event.status,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      })),
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createEvent(
  input: z.input<typeof eventCreateSchema>,
) {
  try {
    const admin = await requireAdmin();

    const data = eventCreateSchema.parse(input);

    await validateEventSlug(data.slug);

    if (
      data.endAt &&
      data.endAt < data.startAt
    ) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Waktu selesai tidak boleh lebih awal dari waktu mulai.",
      );
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        location: data.location || null,
        startAt: data.startAt,
        endAt: data.endAt ?? null,
        mediaId: data.mediaId || null,
        status: "DRAFT",
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    revalidatePath("/admin/events");

    return {
      success: true,
      data: event,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateEvent(
  id: string,
  input: z.input<typeof eventUpdateSchema>,
) {
  try {
    const admin = await requireAdmin();

    const data = eventUpdateSchema.parse(input);

    const existingEvent = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!existingEvent) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Agenda tidak ditemukan.",
      );
    }

    if (data.slug !== existingEvent.slug) {
      await validateEventSlug(data.slug, id);
    }

    if (
      data.endAt &&
      data.endAt < data.startAt
    ) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Waktu selesai tidak boleh lebih awal dari waktu mulai.",
      );
    }

    const event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        location: data.location || null,
        startAt: data.startAt,
        endAt: data.endAt ?? null,
        mediaId: data.mediaId || null,
        status:
          existingEvent.status === "PUBLISHED"
            ? "PUBLISHED"
            : data.status,
        updatedById: admin.id,
      },
    });

    revalidatePath("/admin/events");

    return {
      success: true,
      data: event,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function archiveEvent(id: string) {
  try {
    const admin = await requireAdmin();

    const existingEvent = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!existingEvent) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Agenda tidak ditemukan.",
      );
    }

    const event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        status: "ARCHIVED",
        updatedById: admin.id,
      },
    });

    revalidatePath("/admin/events");

    return {
      success: true,
      data: event,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function publishEvent(id: string) {
  try {
    const admin = await requireAdmin();

    const existingEvent = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!existingEvent) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Agenda tidak ditemukan.",
      );
    }

    if (existingEvent.status !== "DRAFT") {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Hanya agenda DRAFT yang dapat dipublish.",
      );
    }

    const event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        status: "PUBLISHED",
        updatedById: admin.id,
      },
    });

    revalidatePath("/admin/events");

    return {
      success: true,
      data: event,
    };
  } catch (error) {
    return handleActionError(error);
  }
}