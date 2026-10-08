import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveMediaFile(
  file: File,
  storageKey: string,
): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const filePath = path.join(UPLOAD_DIR, storageKey);

  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${storageKey}`;
}

export async function deleteMediaFile(storageKey: string): Promise<void> {
  const filePath = path.join(UPLOAD_DIR, storageKey);

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}