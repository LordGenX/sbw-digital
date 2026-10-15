import { getServices } from "@/actions/service.actions";

import ServiceManager from "./ServiceManager";

export default async function ServicesPage() {
  const result = await getServices();

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
      <ServiceManager
        services={result.data}
      />
    </main>
  );
}