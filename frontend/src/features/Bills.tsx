import React, { useState, useEffect } from "react";
import BillComponent from "./bills/Bill";

function Bills() {
  const [bills, setBills] = useState<[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/bills`)
      .then((res) => res.json())
      .then((data) => setBills(data.bills))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      {bills.map((bill, index) => (
        <BillComponent key={index} bill={bill} />
      ))}
    </div>
  );
}

export default Bills;
