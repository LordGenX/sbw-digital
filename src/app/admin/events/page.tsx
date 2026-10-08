import { getEvents } from "@/actions/event.actions";

import EventManager from "./EventManager";

export default async function EventsPage() {
  const result = await getEvents();

  if ("error" in result) {
    return (
      <div>
        <h1>Agenda</h1>
        <p>{result.error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Agenda</h1>

      <EventManager events={result.data} />
    </div>
  );
}