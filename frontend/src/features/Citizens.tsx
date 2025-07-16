import { useEffect } from "react";

// interface Citizen {
//   name: string;
//   age: number;
//   country: string;
// }

function CitizenList() {
  //   const [citizens, setCitizens] = useState<Citizen[]>([]);

  useEffect(() => {
    // fetch("/api/citizens")
    //   .then((res) => res.json())
    //   .then(setCitizens)
    //   .catch(console.error);
  }, []);

  const citizens = [
    { name: "Alice", age: 30, country: "Wonderland" },
    { name: "Bob", age: 25, country: "Builderland" },
    { name: "Charlie", age: 35, country: "Chocolate Factory" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Citizen List</h2>
      <ul>
        {citizens.map((c, i) => (
          <li key={i} className="mb-2">
            {c.name}, {c.age} years old from {c.country}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CitizenList;
