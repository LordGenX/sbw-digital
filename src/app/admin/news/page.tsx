import { getNews } from "@/actions/news.actions";

import NewsManager from "./NewsManager";

export default async function NewsPage() {
  const result = await getNews();

  if (!result.success) {
    return (
      <main>

        <p>
          Error: {result.error.message}
        </p>
      </main>
    );
  }

  return (
    <main>

      <NewsManager news={result.data} />
    </main>
  );
}