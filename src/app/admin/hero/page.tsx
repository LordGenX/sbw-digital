import { getHeroSection } from "@/actions/hero.actions";

import HeroManager from "./HeroManager";

export default async function HeroPage() {
  const result = await getHeroSection();

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
      <HeroManager heroes={result.data} />
    </main>
  );
}