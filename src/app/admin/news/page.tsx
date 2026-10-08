import { getNews } from "@/actions/news.actions";

import NewsManager from "./NewsManager";

export default async function NewsPage() {
  const result = await getNews();

  if (!result.success) {
    return (
      <main>
        <h1>Berita</h1>

        <p>
          Error: {result.error.message}
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Berita</h1>

      <NewsManager news={result.data} />
    </main>
  );
}