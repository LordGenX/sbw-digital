import { getHeroSection } from "@/actions/hero.actions";

import HeroManager from "./HeroManager";

export default async function HeroPage() {
  const result = await getHeroSection();

  if (!result.success) {
    return (
      <main>
        <h1>Hero Section</h1>

        <p>
          Error: {result.error.message}
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Hero Section</h1>

      <HeroManager heroes={result.data} />
    </main>
  );
}