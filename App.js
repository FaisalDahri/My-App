import { useState } from "react";

export default function App() {
  const [objective, setObjective] = useState("Japan Trip – Oct 2026");

  const [leverages, setLeverages] = useState([
    {
      id: 1,
      title: "Save €25",
      frequency: "Daily",
      durationDays: 1,
      completedToday: false,
    },
    {
      id: 2,
      title: "No unnecessary spending",
      frequency: "Daily",
      durationDays: 1,
      completedToday: false,
    },
    {
      id: 3,
      title: "Learn 10 Japanese words",
      frequency: "Daily",
      durationDays: 1,
      completedToday: false,
    },
  ]);

  const toggleLeverage = (id) => {
    setLeverages((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, completedToday: !l.completedToday } : l
      )
    );
  };

  const stars = leverages.filter((l) => l.completedToday).length;

  return (
    <div className="app">
      <h1 className="title">1 Year = 5 Years</h1>

      <section className="objective">
        <p className="label">Objective</p>
        <h2>{objective}</h2>
      </section>

      <section className="leverages">
        <p className="label">Today's Execution</p>

        {leverages.map((l) => (
          <div
            key={l.id}
            className={`leverage ${l.completedToday ? "done" : ""}`}
            onClick={() => toggleLeverage(l.id)}
          >
            <div>
              <strong>{l.title}</strong>
              <div className="meta">
                {l.frequency} • {l.durationDays} day
              </div>
            </div>
            <input
              type="checkbox"
              checked={l.completedToday}
              readOnly
            />
          </div>
        ))}
      </section>

      <section className="stars">
        <p>Today's Stars</p>
        <h2>{"⭐".repeat(stars)}</h2>
      </section>
    </div>
  );
}
