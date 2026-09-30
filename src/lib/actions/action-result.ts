import type { ErrorCode } from "@/lib/errors";

export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionFailure = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
};

export type ActionResult<T> =
  | ActionSuccess<T>
  | ActionFailure;