"use client";

import { useEffect, useState } from "react";

type Restaurant = {
  id: string;
  name: string;
  address: string;
  vegetarian_friendly: boolean;
  vegan_options: boolean;
  accepts_own_bowls: boolean;
};

export default function RestaurantsPage() {
  const [rows, setRows] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/restaurants")
      .then((r) => r.json())
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  return (
    <main>
      <h2>Restaurants</h2>
      <ul>
        {rows.map((r) => (
          <li key={r.id}>
            <strong>{r.name}</strong> — {r.address}
            <br />
            eco: {r.vegetarian_friendly ? "veg-friendly " : ""}
            {r.vegan_options ? "vegan " : ""}
            {r.accepts_own_bowls ? "own-bowls" : ""}
          </li>
        ))}
      </ul>
    </main>
  );
}
