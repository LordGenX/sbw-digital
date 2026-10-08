"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { validateMediaFile } from "@/lib/media";
import {
  saveMediaFile,
  deleteMediaFile,
} from "@/lib/media-storage";

type UploadedMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
  createdAt: Date;
};

type MediaListItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
  createdAt: Date;
};

function generateStorageKey(fileName: string): string {
  const extension = fileName.includes(".")
    ? fileName.substring(fileName.lastIndexOf(".")).toLowerCase()
    : "";

  const baseName = fileName
    .substring(0, fileName.lastIndexOf(".") || fileName.length)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const uniqueId = crypto.randomUUID();

  return `${Date.now()}-${uniqueId}-${baseName || "media"}${extension}`;
}

export async function getMedia(): Promise<ActionResult<MediaListItem[]>> {
  try {
    await requireAdmin();

    const media = await prisma.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: media.map((item) => ({
        id: item.id,
        fileName: item.fileName,
        fileUrl: item.fileUrl,
        mimeType: item.mimeType,
        fileSize: item.fileSize.toString(),
        altText: item.altText,
        createdAt: item.createdAt,
      })),
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function uploadMedia(
  file: File,
  altText?: string,
): Promise<ActionResult<UploadedMedia>> {
  try {
    await requireAdmin();

    if (!(file instanceof File)) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "File media wajib diisi.",
      );
    }

    const validation = validateMediaFile(file);

    if (!validation.valid) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        validation.message ?? "File media tidak valid.",
      );
    }

    const storageKey = generateStorageKey(file.name);

    const fileUrl = await saveMediaFile(file, storageKey);

    try {
      const media = await prisma.media.create({
        data: {
          fileName: file.name,
          fileUrl,
          storageKey,
          mimeType: file.type,
          fileSize: BigInt(file.size),
          altText: altText?.trim() || null,
        },
      });

      revalidatePath("/admin");

      return {
        success: true,
        data: {
          id: media.id,
          fileName: media.fileName,
          fileUrl: media.fileUrl,
          mimeType: media.mimeType,
          fileSize: media.fileSize.toString(),
          altText: media.altText,
          createdAt: media.createdAt,
        },
      };
    } catch (error) {
      await deleteMediaFile(storageKey);
      throw error;
    }
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteMedia(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const media = await prisma.media.findUnique({
      where: { id },
      select: {
        id: true,
        storageKey: true,
      },
    });

    if (!media) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Media tidak ditemukan.",
      );
    }

    const usageCount = await Promise.all([
      prisma.aboutContent.count({ where: { mediaId: id } }),
      prisma.service.count({ where: { mediaId: id } }),
      prisma.membershipInfo.count({ where: { mediaId: id } }),
      prisma.news.count({ where: { mediaId: id } }),
      prisma.event.count({ where: { mediaId: id } }),
    ]);

    const isUsed = usageCount.some((count) => count > 0);

    if (isUsed) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Media masih digunakan oleh konten dan tidak dapat dihapus.",
      );
    }

    await prisma.media.delete({
      where: { id },
    });

    await deleteMediaFile(media.storageKey);

    revalidatePath("/admin");

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    return handleActionError(error);
  }
}