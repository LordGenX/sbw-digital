import { getMedia } from "@/actions/media.actions";
import MediaManager from "./MediaManager";

export default async function MediaPage() {
  const result = await getMedia();

  if ("error" in result) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Media</h1>
        <p className="mt-2 text-sm text-red-600">
          {result.error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Media</h1>

        <p className="mt-1 text-sm text-gray-500">
          Kelola file gambar yang digunakan oleh konten website.
        </p>
      </div>

      <MediaManager media={result.data} />
    </div>
  );
}