let objectives = [];
let tempLeverages = [];

/* UTIL */
const today = () => new Date().toISOString().split("T")[0];

/* NAV */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === "todo") renderTodo();
  if (id === "review") renderReview("daily");
}

/* SETUP */
function addLeverageInput() {
  const id = Date.now();
  tempLeverages.push({ id, title: "" });

  const div = document.createElement("div");
  div.innerHTML = `
    <input placeholder="Leverage"
      onchange="tempLeverages.find(l=>l.id===${id}).title=this.value">
  `;
  document.getElementById("leverageInputs").appendChild(div);
}

function saveObjective() {
  const name = objName.value;
  if (!name || tempLeverages.length === 0) return;

  objectives.push({
    name,
    history: {
      [today()]: tempLeverages.map(l => ({
        title: l.title,
        completed: false
      }))
    }
  });

  tempLeverages = [];
  leverageInputs.innerHTML = "";
  objName.value = "";
  showPage("todo");
}

/* TODO */
function renderTodo() {
  const page = document.getElementById("todo");
  page.innerHTML = "";

  objectives.forEach((o, i) => {
    const bubble = document.createElement("div");
    bubble.className = "objective";
    bubble.innerText = o.name;
    bubble.onclick = () => toggleObjective(i);
    page.appendChild(bubble);
  });
}

function toggleObjective(index) {
  const page = document.getElementById("todo");
  const existing = document.getElementById("dropdown");
  if (existing) existing.remove();

  const o = objectives[index];
  if (!o.history[today()]) {
    o.history[today()] = o.history[Object.keys(o.history)[0]]
      .map(l => ({ ...l, completed: false }));
  }

  const drop = document.createElement("div");
  drop.id = "dropdown";
  drop.className = "dropdown";

  drop.innerHTML = `<strong>Today (${today()})</strong>`;

  o.history[today()].forEach(l => {
    const row = document.createElement("div");
    row.className = "leverage";
    row.innerHTML = `
      <span>${l.title}</span>
      <input type="checkbox"
        onchange="this.checked && addStar(${index}, '${today()}')">
    `;
    drop.appendChild(row);
  });

  page.appendChild(drop);
}

/* REVIEW */
function renderReview(mode) {
  const page = document.getElementById("review");
  page.innerHTML = `<h2>${mode.charAt(0).toUpperCase()+mode.slice(1)} Review</h2>`;

  objectives.forEach(o => {
    let stars = 0;
    Object.values(o.history).forEach(day =>
      day.forEach(l => l.completed && stars++)
    );

    const card = document.createElement("div");
    card.className = "dropdown";
    card.innerHTML = `<strong>${o.name}</strong><br/>⭐ ${stars}`;
    page.appendChild(card);
  });
}

function addStar(objIndex, date) {
  objectives[objIndex].history[date].forEach(l => {
    if (!l.completed) l.completed = true;
  });
}
