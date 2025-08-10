import React, { useEffect, useState } from "react";

type Verdict = "constitutional" | "unconstitutional" | "unclear";

interface Event {
  id: string;
  title: string;
  description: string;
  actor: string;
  date: string;
  status?: string;
  verdict?: Verdict;
  reason?: string;
}

export default function ListEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/events`);
    const data = await res.json();
    setEvents(data);
  };

  const handleConstitutionalCheck = async (event: Event) => {
    const r = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/events/${event.id}/constitutional-check`,
      { method: "POST" },
    );
    const data = await r.json();
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, verdict: data.verdict, const_reason: data.reason }
          : e,
      ),
    );
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const verdictColor = (v?: Verdict) =>
    v === "constitutional"
      ? "bg-green-100 text-green-700"
      : v === "unconstitutional"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <div className="divide-y p-4">
      {events.map((event) => (
        <div key={event.id} className="py-4 space-y-3 border-b">
          <h2 className="text-lg font-bold">{event.title}</h2>
          <p className="text-sm text-gray-600">
            {event.actor} • {new Date(event.date).toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              {event.status || "pending"}
            </span>
            {event.verdict && (
              <span
                className={`text-xs px-2 py-1 rounded ${verdictColor(event.verdict)}`}
              >
                憲法審查: {event.verdict}
              </span>
            )}
          </div>
          {event.reason && (
            <p className="text-xs text-gray-700">理由：{event.reason}</p>
          )}
          <button
            onClick={() => handleConstitutionalCheck(event)}
            className="bg-purple-600 text-white px-2 py-1 rounded text-xs"
          >
            憲法審查（GPT）
          </button>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              Description
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
