import React, { useState } from "react";
import CreateIPFS from "./topics/CreateIPFS";
import ListIPFS from "./topics/ListIPFS";

export default function Topic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end p-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          ➕ Create IPFS
        </button>
      </div>

      <ListIPFS />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create IPFS</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <CreateIPFS />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
