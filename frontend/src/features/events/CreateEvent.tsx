import React, { useState } from "react";

interface Props {
  onCreated: () => void;
}

export default function CreateEvent({ onCreated }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    actor: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", actor: "", date: "" });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="actor"
        placeholder="Actor"
        value={form.actor}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="date"
        type="datetime-local"
        value={form.date}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  );
}
