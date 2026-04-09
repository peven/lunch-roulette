"use client";

import { useEffect, useMemo, useState } from "react";

type Office = { id: string; name: string };
type User = { id: string; display_name: string; default_office_id: string | null };
type Restaurant = { id: string; name: string; distance_meters: number | null };

export default function RoulettePage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [officeId, setOfficeId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:4000/offices").then((r) => r.json()),
      fetch("http://localhost:4000/users").then((r) => r.json())
    ])
      .then(([officeRows, userRows]) => {
        setOffices(officeRows);
        setUsers(userRows);

        if (officeRows.length > 0) setOfficeId(officeRows[0].id);
        if (userRows.length > 0) {
          setUserId(userRows[0].id);
          if (userRows[0].default_office_id) setOfficeId(userRows[0].default_office_id);
        }
      })
      .catch(() => setError("Failed to load users/offices"));
  }, []);

  useEffect(() => {
    if (!officeId) return;

    fetch(`http://localhost:4000/restaurants?officeId=${officeId}`)
      .then((r) => r.json())
      .then((rows) => {
        setRestaurants(rows);
        setSelected([]);
        setWinner(null);
      })
      .catch(() => setError("Failed to load restaurants"));
  }, [officeId]);

  const selectedNames = useMemo(() => {
    const set = new Set(selected);
    return restaurants.filter((x) => set.has(x.id)).map((x) => x.name);
  }, [selected, restaurants]);

  async function spin() {
    if (!officeId || !userId || selected.length === 0) return;
    setError(null);

    const res = await fetch("http://localhost:4000/roulette/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        officeId,
        createdBy: userId,
        lunchDate: new Date().toISOString().slice(0, 10),
        shortlistRestaurantIds: selected
      })
    });

    if (!res.ok) {
      setError("Spin failed");
      return;
    }

    const data = await res.json();
    const selectedRestaurant = restaurants.find(
      (r) => r.id === data.selected_restaurant_id
    );
    setWinner(selectedRestaurant?.name ?? data.selected_restaurant_id ?? null);
  }

  return (
    <main>
      <h2>Roulette</h2>
      <p>Select an office, pick exact shortlist candidates, then spin.</p>

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
        User:{" "}
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.display_name}
            </option>
          ))}
        </select>
      </label>

      <h3>Restaurants</h3>
      {restaurants.map((r) => (
        <label key={r.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selected.includes(r.id)}
            onChange={(e) =>
              setSelected((prev) =>
                e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id)
              )
            }
          />
          {r.name}
          {typeof r.distance_meters === "number" ? ` (${r.distance_meters} m)` : ""}
        </label>
      ))}

      <button onClick={spin} disabled={!officeId || !userId || selected.length === 0}>
        Spin
      </button>

      {selectedNames.length > 0 && (
        <p>Shortlist: {selectedNames.join(", ")}</p>
      )}
      {winner && <p>Selected restaurant: {winner}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </main>
  );
}
