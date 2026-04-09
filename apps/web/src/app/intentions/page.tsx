"use client";

import { useEffect, useState } from "react";

type Office = { id: string; name: string };
type User = { id: string; display_name: string };
type Restaurant = { id: string; name: string };

export default function IntentionsPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [userId, setUserId] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [mode, setMode] = useState<"dine_in" | "takeaway">("dine_in");
  const [message, setMessage] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:4000/offices").then((r) => r.json()),
      fetch("http://localhost:4000/users").then((r) => r.json()),
      fetch("http://localhost:4000/restaurants").then((r) => r.json())
    ]).then(([officeRows, userRows, restaurantRows]) => {
      setOffices(officeRows);
      setUsers(userRows);
      setRestaurants(restaurantRows);
      if (officeRows.length > 0) setOfficeId(officeRows[0].id);
      if (userRows.length > 0) setUserId(userRows[0].id);
      if (restaurantRows.length > 0) setRestaurantId(restaurantRows[0].id);
    });
  }, []);

  async function submit() {
    setMessage(null);

    const res = await fetch("http://localhost:4000/intentions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        officeId,
        restaurantId,
        lunchDate: today,
        mode
      })
    });

    if (!res.ok) {
      setMessage("Failed to save intention");
      return;
    }

    setMessage("Lunch intention saved");
  }

  return (
    <main>
      <h2>Lunch Intentions</h2>
      <p>Declare where and how you plan to have lunch today.</p>

      <label>
        User:{" "}
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.display_name}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Office:{" "}
        <select value={officeId} onChange={(e) => setOfficeId(e.target.value)}>
          {offices.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Restaurant:{" "}
        <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Mode:{" "}
        <select value={mode} onChange={(e) => setMode(e.target.value as "dine_in" | "takeaway")}>
          <option value="dine_in">Dine in</option>
          <option value="takeaway">Takeaway</option>
        </select>
      </label>
      <br />

      <button onClick={submit} disabled={!userId || !officeId || !restaurantId}>
        Save intention
      </button>

      {message && <p>{message}</p>}
    </main>
  );
}
