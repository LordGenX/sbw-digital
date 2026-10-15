export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_MEDIA_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateMediaFile(file: File) {
  if (!ALLOWED_MEDIA_TYPES.includes(file.type as (typeof ALLOWED_MEDIA_TYPES)[number])) {
    return {
      valid: false,
      message: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP.",
    };
  }

  if (file.size > MAX_MEDIA_FILE_SIZE) {
    return {
      valid: false,
      message: "Ukuran file maksimal 5 MB.",
    };
  }

  return {
    valid: true,
  };
}