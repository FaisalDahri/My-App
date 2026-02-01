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

import { useState } from "react";

export default function App() {
  const [screen, setScreen] = useState("setup");

  const [objective, setObjective] = useState("");
  const [leverages, setLeverages] = useState([]);
  const [weeklyStars, setWeeklyStars] = useState(0);

  // -------- SETUP --------
  const addLeverage = () => {
    setLeverages([
      ...leverages,
      {
        id: Date.now(),
        title: "",
        frequency: "Daily",
        durationDays: 1,
        completedToday: false,
      },
    ]);
  };

  const updateLeverage = (id, field, value) => {
    setLeverages((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      )
    );
  };

  const startExecution = () => {
    if (!objective || leverages.length === 0) return;
    setScreen("home");
  };

  // -------- HOME --------
  const toggleLeverage = (id) => {
    setLeverages((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, completedToday: !l.completedToday }
          : l
      )
    );
  };

  const finishDay = () => {
    const starsToday = leverages.filter(l => l.completedToday).length;
    setWeeklyStars(prev => prev + starsToday);

    setLeverages(prev =>
      prev.map(l => ({ ...l, completedToday: false }))
    );
  };

  // -------- WEEKLY REVIEW --------
  const endWeek = () => {
    setWeeklyStars(0);
    setScreen("home");
  };

  // ================= RENDER =================

  if (screen === "setup") {
    return (
      <div className="app">
        <h1>Setup</h1>

        <label className="label">Objective</label>
        <input
          className="input"
          placeholder="Your main objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />

        <label className="label">Leverages</label>

        {leverages.map((l) => (
          <div key={l.id} className="leverage setup">
            <input
              placeholder="Leverage title"
              value={l.title}
              onChange={(e) =>
                updateLeverage(l.id, "title", e.target.value)
              }
            />
            <select
              value={l.frequency}
              onChange={(e) =>
                updateLeverage(l.id, "frequency", e.target.value)
              }
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>3x per week</option>
            </select>
          </div>
        ))}

        <button onClick={addLeverage}>+ Add Leverage</button>
        <button className="primary" onClick={startExecution}>
          Start Execution
        </button>
      </div>
    );
  }

  if (screen === "home") {
    const starsToday = leverages.filter(l => l.completedToday).length;

    return (
      <div className="app">
        <h1>Execution</h1>

        <p className="label">Objective</p>
        <h2>{objective}</h2>

        {leverages.map((l) => (
          <div
            key={l.id}
            className={`leverage ${l.completedToday ? "done" : ""}`}
            onClick={() => toggleLeverage(l.id)}
          >
            <div>
              <strong>{l.title}</strong>
              <div className="meta">{l.frequency}</div>
            </div>
            <input type="checkbox" checked={l.completedToday} readOnly />
          </div>
        ))}

        <div className="stars">
          {"⭐".repeat(starsToday)}
        </div>

        <button onClick={finishDay}>Finish Day</button>
        <button onClick={() => setScreen("review")}>
          Weekly Review
        </button>
      </div>
    );
  }

  // -------- REVIEW --------
  return (
    <div className="app">
      <h1>Weekly Review</h1>

      <p>Total Stars This Week</p>
      <h2>{"⭐".repeat(weeklyStars)}</h2>

      <p className="meta">
        Stars represent executed leverage actions — nothing else.
      </p>

      <button className="primary" onClick={endWeek}>
        Start New Week
      </button>
    </div>
  );
}
