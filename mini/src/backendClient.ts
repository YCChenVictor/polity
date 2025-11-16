const API_BASE = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000';

const ipfsAdd = async (data: unknown) => {
  const res = await fetch(`${API_BASE}/api/ipfs/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`ipfsAdd failed: ${res.status}`);
  return res.json();
};

export { ipfsAdd }
