const add = async (file: File, dir: string = "/uploads") => {
  const res = await fetch(
      `/api/ipfs?name=${encodeURIComponent(file.name)}&dir=${encodeURIComponent(
        dir,
      )}`,
      {
        method: "POST",
        body: file,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    return res.json();
};

const list = async () => {
  const res = await fetch("/api/ipfs", {
    method: "GET",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};


export const ipfsClient = { add, list };
