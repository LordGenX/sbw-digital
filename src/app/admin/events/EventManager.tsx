"use client";

import { useState } from "react";

import {
  archiveEvent,
  publishEvent,
} from "@/actions/event.actions";

import EventForm from "./EventForm";

type EventMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type EventData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  startAt: Date | string;
  endAt: Date | string | null;
  mediaId: string | null;
  media: EventMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

type EventManagerProps = {
  events: EventData[];
};

function formatDate(value: Date | string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function EventManager({
  events,
}: EventManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<
    EventData | undefined
  >(undefined);
  const [message, setMessage] = useState("");

  function handleAdd() {
    setEditingEvent(undefined);
    setShowForm(true);
    setMessage("");
  }

  function handleEdit(event: EventData) {
    setEditingEvent(event);
    setShowForm(true);
    setMessage("");
  }

  function handleCancel() {
    setShowForm(false);
    setEditingEvent(undefined);
    setMessage("");
  }

  async function handlePublish(id: string) {
    setMessage("");

    const result = await publishEvent(id);

    if ("error" in result) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Agenda berhasil dipublikasikan.");
  }

  async function handleArchive(id: string) {
    setMessage("");

    const result = await archiveEvent(id);

    if ("error" in result) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Agenda berhasil diarsipkan.");
  }

  return (
    <div>
      <div>
        <button type="button" onClick={handleAdd}>
          + Tambah Agenda
        </button>
      </div>

      {message && <p>{message}</p>}

      {showForm && (
        <div>
          <EventForm
            key={editingEvent?.id ?? "new"}
            event={editingEvent ?? undefined}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div>
        <h2>Daftar Agenda</h2>

        {events.length === 0 ? (
          <p>Belum ada agenda.</p>
        ) : (
          <div>
            {events.map((event) => (
              <article key={event.id}>
                <h3>{event.title}</h3>

                <p>
                  <strong>Status:</strong>{" "}
                  {event.status}
                </p>

                <p>
                  <strong>Mulai:</strong>{" "}
                  {formatDate(event.startAt)}
                </p>

                {event.endAt && (
                  <p>
                    <strong>Selesai:</strong>{" "}
                    {formatDate(event.endAt)}
                  </p>
                )}

                {event.location && (
                  <p>
                    <strong>Lokasi:</strong>{" "}
                    {event.location}
                  </p>
                )}

                <div>
                  <button
                    type="button"
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>

                  {event.status === "DRAFT" && (
                    <button
                      type="button"
                      onClick={() =>
                        handlePublish(event.id)
                      }
                    >
                      Publish
                    </button>
                  )}

                  {event.status !== "ARCHIVED" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleArchive(event.id)
                      }
                    >
                      Archive
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}