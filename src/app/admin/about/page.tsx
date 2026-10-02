import { getAboutContents } from "@/actions/about.actions";

import AboutManager from "./AboutManager";

export default async function AboutPage() {
  const result = await getAboutContents();

  if (!result.success) {
    return (
      <main>
        <h1>Tentang SBW</h1>
        <p>
          Error: {result.error.message}
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Tentang SBW</h1>

      <AboutManager
        contents={result.data}
      />
    </main>
  );
}