import { ZodError } from "zod";

import {
  AppError,
  ERROR_CODES,
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
    console.error(
      "[Action Validation Error]",
      error.issues,
    );

    return {
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Data yang diberikan tidak valid.",
      },
    };
  }

  // Catat error asli agar penyebab kegagalan
  // dapat diketahui dari terminal server.
  if (error instanceof Error) {
    console.error(
      "[Action Internal Error]",
      error.message,
      error.stack,
    );
  } else {
    console.error(
      "[Action Internal Error]",
      error,
    );
  }

  return {
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Terjadi kesalahan pada server.",
    },
  };
}