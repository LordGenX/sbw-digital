import { getAboutContents } from "@/actions/about.actions";

import AboutManager from "./AboutManager";

export default async function AboutPage() {
  const result = await getAboutContents();

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
      <AboutManager
        contents={result.data}
      />
    </main>
  );
}