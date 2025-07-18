import { useState, useEffect } from "react";

function Bills() {
  const [bills, setBills] = useState<[]>([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/bills`)
      .then((res) => res.json())
      .then((data) => setBills(data.bills))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return <pre>{JSON.stringify(bills, null, 2)}</pre>;
}

export default Bills;
