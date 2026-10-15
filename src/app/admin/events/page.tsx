import { getEvents } from "@/actions/event.actions";

import EventManager from "./EventManager";

export default async function EventsPage() {
  const result = await getEvents();

  if ("error" in result) {
    return (
      <div>
        <p>{result.error.message}</p>
      </div>
    );
  }

  return (
    <div>

      <EventManager events={result.data} />
    </div>
  );
}