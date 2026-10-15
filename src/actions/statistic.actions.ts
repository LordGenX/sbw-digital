"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { handleActionError } from "@/lib/actions/handle-action-error";
import type { ActionResult } from "@/lib/actions/action-result";
import { AppError, ERROR_CODES } from "@/lib/errors";

import { revalidatePath } from "next/cache";

const statisticUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama statistik wajib diisi.")
    .max(100, "Nama statistik maksimal 100 karakter."),

  value: z
    .number({
      error: "Nilai statistik wajib berupa angka.",
    })
    .finite("Nilai statistik harus berupa angka yang valid."),

  unit: z
    .string()
    .trim()
    .max(50, "Unit maksimal 50 karakter.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  sortOrder: z
    .number({
      error: "Urutan wajib berupa angka.",
    })
    .int("Urutan harus berupa bilangan bulat.")
    .min(1, "Urutan minimal 1."),
});

type StatisticUpdateInput = z.infer<typeof statisticUpdateSchema>;

export type StatisticListItem = {
  id: string;
  name: string;
  value: string;
  unit: string | null;
  description: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
};

function serializeStatistic(statistic: {
  id: string;
  name: string;
  value: unknown;
  unit: string | null;
  description: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}): StatisticListItem {
  return {
    id: statistic.id,
    name: statistic.name,
    value: String(statistic.value),
    unit: statistic.unit,
    description: statistic.description,
    sortOrder: statistic.sortOrder,
    status: statistic.status,
    createdAt: statistic.createdAt,
    updatedAt: statistic.updatedAt,
  };
}

export async function getStatistics(): Promise<
  ActionResult<StatisticListItem[]>
> {
  try {
    await requireAdmin();

    const statistics = await prisma.statistic.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

    return {
      success: true,
      data: statistics.map(serializeStatistic),
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateStatistic(
  id: string,
  input: StatisticUpdateInput,
): Promise<ActionResult<StatisticListItem>> {
  try {
    const admin = await requireAdmin();

    const parsed = statisticUpdateSchema.safeParse(input);

    if (!parsed.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Data statistik tidak valid.",
      );
    }

    const existingStatistic = await prisma.statistic.findUnique({
      where: {
        id,
      },
    });

    if (!existingStatistic) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "Data statistik tidak ditemukan.",
      );
    }

    const statistic = await prisma.statistic.update({
      where: {
        id,
      },
      data: {
        name: parsed.data.name,
        value: parsed.data.value,
        unit: parsed.data.unit || null,
        description: parsed.data.description || null,
        sortOrder: parsed.data.sortOrder,
        updatedById: admin.id,
      },
    });

    revalidatePath("/admin/statistics");

    return {
      success: true,
      data: serializeStatistic(statistic),
    };
  } catch (error) {
    return handleActionError(error);
  }
}