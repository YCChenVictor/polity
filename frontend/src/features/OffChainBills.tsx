import React, { useState, useEffect } from "react";
import Bill from "./bills/Bill";

function Bills({ governmentAddress }: { governmentAddress: `0x${string}` }) {
  const [bills, setBills] = useState<[]>([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/bills`)
      .then((res) => res.json())
      .then((data) => setBills(data.bills))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      {bills.map((bill, index) => (
        <Bill key={index} bill={bill} govAddress={governmentAddress} />
      ))}
    </div>
  );
}

export default Bills;
