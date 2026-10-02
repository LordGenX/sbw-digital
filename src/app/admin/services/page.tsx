import { getServices } from "@/actions/service.actions";

import ServiceManager from "./ServiceManager";

export default async function ServicesPage() {
  const result = await getServices();

  if (!result.success) {
    return (
      <main>
        <h1>Layanan</h1>

        <p>
          Error: {result.error.message}
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Layanan</h1>

      <p>
        Kelola informasi 8 layanan SBW.
      </p>

      <ServiceManager
        services={result.data}
      />
    </main>
  );
}