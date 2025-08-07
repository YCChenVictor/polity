import React, { useState } from "react";
import CreateEvent from "./events/CreateEvent";
import ListEvents from "./events/ListEvents";

export default function EventBoard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CreateEvent onCreated={() => setRefreshKey((prev) => prev + 1)} />
      <ListEvents key={refreshKey} />
    </>
  );
}
