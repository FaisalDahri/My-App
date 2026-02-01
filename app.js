let leverages = [];
let weeklyStars = 0;

/* ---------- SCREEN CONTROL ---------- */
function show(screen) {
  ["setup", "home", "review"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(screen).classList.remove("hidden");
}

/* ---------- SETUP ---------- */
function addLeverage() {
  const id = Date.now();
  leverages.push({ id, title: "", completed: false });

  const div = document.createElement("div");
  div.innerHTML = `
    <input placeholder="Leverage title"
      onchange="updateLeverage(${id}, this.value)" />
  `;
  document.getElementById("leverageList").appendChild(div);
}

function updateLeverage(id, value) {
  const l = leverages.find(l => l.id === id);
  l.title = value;
}

function startApp() {
  const objective = document.getElementById("objectiveInput").value;
  const freq = document.getElementById("objectiveFrequency").value;

  if (!objective || leverages.length === 0) return;

  document.getElementById("objectiveTitle").innerText = objective;
  document.getElementById("objectiveMeta").innerText = freq;

  renderExecution();
  show("home");
}

/* ---------- EXECUTION ---------- */
function renderExecution() {
  const list = document.getElementById("executionList");
  list.innerHTML = "";

  leverages.forEach(l => {
    const div = document.createElement("div");
    div.className = "leverage";
    div.innerHTML = `
      <span>${l.title}</span>
      <input type="checkbox" />
    `;
    div.onclick = () => toggleLeverage(l, div);
    list.appendChild(div);
  });
}

function toggleLeverage(l, div) {
  l.completed = !l.completed;
  div.classList.toggle("done");
}

/* ---------- DAY / WEEK ---------- */
function endDay() {
  const starsToday = leverages.filter(l => l.completed).length;
  weeklyStars += starsToday;
  leverages.forEach(l => l.completed = false);
  renderExecution();
}

function showReview() {
  document.getElementById("starCount").innerText =
    `Total Stars: ⭐ ${weeklyStars}`;
  show("review");
}

function resetWeek() {
  weeklyStars = 0;
  show("home");
}

function backHome() {
  show("home");
}
