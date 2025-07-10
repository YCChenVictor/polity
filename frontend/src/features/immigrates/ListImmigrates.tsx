import { useEffect, useState } from "react";

interface Immigrate {
  name: string;
}

function Immigrates() {
  const [data, setData] = useState<Immigrate[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/immigrates")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <ul>
      {data.map((item, i) => (
        <li key={i}>{item.name}</li>
      ))}
    </ul>
  );
}

export default Immigrates;
