import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";

import { pollAbi } from "../../generated";

export default function Create({ address }: { address: `0x${string}` }) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { writeContract } = useWriteContract();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("Creating poll with context:", context);
    await writeContract({
      address: address,
      abi: pollAbi,
      functionName: "create",
      args: [context],
    });
    // Here you would typically call your backend API or smart contract to create the poll
    // For example:
    // await fetch("/api/polls", { method: "POST", body: JSON.stringify({ context }) });
    // or use wagmi's writeContract to interact with a smart contract

    setSubmitting(false);
    setOpen(false);
    setContext(""); // Reset context after submission
    // Optionally, you could trigger a refresh of the poll list here
    console.log("Poll created successfully");
    // You might want to show a success message or redirect the user
    // For example, you could use a toast notification or a modal to inform the user
    // that the poll was created successfully.
    // Example: toast.success("Poll created successfully!");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 active:scale-[.99] dark:border-gray-700 dark:hover:bg-gray-800"
      >
        {"Create Poll"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Poll</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Context</label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={4}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-neutral-800"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
