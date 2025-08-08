import React, { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  actor: string;
  date: string;
  status?: string;
}

export default function ListEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/events`);
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="divide-y p-4">
      {events.map((event) => (
        <div key={event.id} className="py-4">
          <h2 className="text-lg font-bold">{event.title}</h2>
          <p className="text-sm text-gray-600">
            {event.actor} • {new Date(event.date).toLocaleString()}
          </p>
          <p>{event.description}</p>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded inline-block mt-1">
            {event.status || "pending"}
          </span>
        </div>
      ))}
    </div>
  );
}
