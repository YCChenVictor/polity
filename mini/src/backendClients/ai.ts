const check = async ({ ruleCid, contentCid, type }: { ruleCid: string, contentCid: string, type: string }) => {
  const response = await fetch(`/api/ai/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ruleCid, contentCid }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  
  return data.judgement;
};

export const ai = { check };
