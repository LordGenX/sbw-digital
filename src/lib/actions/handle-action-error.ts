import { ZodError } from "zod";

import {
  AppError,
  ERROR_CODES,
  type ErrorCode,
} from "@/lib/errors";

import type { ActionFailure } from "./action-result";

export function handleActionError(
  error: unknown,
): ActionFailure {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  if (error instanceof ZodError) {
    return {
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Data yang diberikan tidak valid.",
      },
    };
  }

  return {
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Terjadi kesalahan pada server.",
    },
  };
}