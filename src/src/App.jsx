import { useState } from "react";

export default function App() {
  const [screen, setScreen] = useState("setup");

  const [objective, setObjective] = useState("");
  const [frequencyTarget, setFrequencyTarget] = useState("Daily");

  const [leverages, setLeverages] = useState([]);
  const [weeklyStars, setWeeklyStars] = useState(0);

  const addLeverage = () => {
    setLeverages([
      ...leverages,
      {
        id: Date.now(),
        title: "",
        frequency: "Daily",
        duration: 1,
        completed: false,
      },
    ]);
  };

  const toggleComplete = (id) => {
    setLeverages((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, completed: !l.completed } : l
      )
    );
  };

  const endDay = () => {
    const starsToday = leverages.filter((l) => l.completed).length;
    setWeeklyStars(weeklyStars + starsToday);
    setLeverages((prev) =>
      prev.map((l) => ({ ...l, completed: false }))
    );
  };

  /* ---------- SETUP SCREEN ---------- */
  if (screen === "setup") {
    return (
      <div className="app">
        <h1>1 Year = 5 Years</h1>

        <input
          placeholder="Main Objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />

        <select
          value={frequencyTarget}
          onChange={(e) => setFrequencyTarget(e.target.value)}
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>Custom</option>
        </select>

        <h3>Leverages</h3>

        {leverages.map((l, i) => (
          <div key={l.id} className="leverage-input">
            <input
              placeholder="Leverage title"
              value={l.title}
              onChange={(e) => {
                const copy = [...leverages];
                copy[i].title = e.target.value;
                setLeverages(copy);
              }}
            />
            <input
              type="number"
              min="1"
              placeholder="Duration (days)"
              value={l.duration}
              onChange={(e) => {
                const copy = [...leverages];
                copy[i].duration = e.target.value;
                setLeverages(copy);
              }}
            />
          </div>
        ))}

        <button onClick={addLeverage}>+ Add Leverage</button>

        <button
          disabled={!objective || leverages.length === 0}
          onClick={() => setScreen("home")}
        >
          Start
        </button>
      </div>
    );
  }

  /* ---------- HOME / EXECUTION ---------- */
  if (screen === "home") {
    return (
      <div className="app">
        <h2>{objective}</h2>
        <p className="muted">{frequencyTarget} Focus</p>

        {leverages.map((l) => (
          <div
            key={l.id}
            className={`leverage ${l.completed ? "done" : ""}`}
            onClick={() => toggleComplete(l.id)}
          >
            <span>{l.title}</span>
            <input type="checkbox" checked={l.completed} readOnly />
          </div>
        ))}

        <button onClick={endDay}>End Day</button>
        <button onClick={() => setScreen("review")}>Weekly Review</button>
      </div>
    );
  }

  /* ---------- WEEKLY REVIEW ---------- */
  return (
    <div className="app">
      <h2>Weekly Review</h2>
      <p>Total Stars: ⭐ {weeklyStars}</p>

      <button onClick={() => setWeeklyStars(0)}>
        Reset Week
      </button>

      <button onClick={() => setScreen("home")}>
        Back
      </button>
    </div>
  );
}
