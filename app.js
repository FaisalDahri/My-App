let objectives = [];
let editingIndex = null;

const today = () => new Date().toISOString().split("T")[0];

/* NAV */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === "todo") renderTodo();
  if (id === "review") renderReview("daily");
}

/* SETUP */
function addLeverageInput(value = "") {
  const div = document.createElement("div");
  div.innerHTML = `<input placeholder="Leverage" value="${value}">`;
  leverageInputs.appendChild(div);
}

function saveObjective() {
  const name = objName.value;
  const deadline = objDeadline.value;
  const freq = objFreq.value;

  const levs = [...leverageInputs.querySelectorAll("input")]
    .map(i => i.value)
    .filter(Boolean)
    .map(t => ({ title: t, completed: false }));

  if (!name || levs.length === 0) return;

  const obj = {
    name,
    deadline,
    freq,
    history: { [today()]: levs }
  };

  if (editingIndex !== null) {
    objectives[editingIndex] = obj;
    editingIndex = null;
  } else {
    objectives.push(obj);
  }

  objName.value = "";
  objDeadline.value = "";
  leverageInputs.innerHTML = "";
  showPage("todo");
}

/* TODO */
function renderTodo() {
  const page = todo;
  page.innerHTML = "";

  objectives.forEach((o, i) => {
    const card = document.createElement("div");
    card.className = "objective";
    card.innerHTML = `<strong>${o.name}</strong>`;
    card.onclick = () => toggleDetails(card, o, i);
    page.appendChild(card);
  });
}

function toggleDetails(card, o, index) {
  const existing = card.querySelector(".details");
  if (existing) return existing.remove();

  const d = document.createElement("div");
  d.className = "details";
  d.innerHTML = `<small>Deadline: ${o.deadline}</small>`;

  if (!o.history[today()]) {
    o.history[today()] = o.history[Object.keys(o.history)[0]]
      .map(l => ({ ...l, completed: false }));
  }

  o.history[today()].forEach(l => {
    const row = document.createElement("div");
    row.className = "leverage";
    row.innerHTML = `
      <span>${l.title}</span>
      <input type="checkbox" onchange="l.completed=this.checked">
    `;
    d.appendChild(row);
  });

  const editBtn = document.createElement("button");
  editBtn.className = "secondary";
  editBtn.innerText = "Edit Objective";
  editBtn.onclick = (e) => {
    e.stopPropagation();
    editObjective(index);
  };

  d.appendChild(editBtn);
  card.appendChild(d);
}

/* EDIT */
function editObjective(index) {
  const o = objectives[index];
  editingIndex = index;

  objName.value = o.name;
  objDeadline.value = o.deadline;
  objFreq.value = o.freq;
  leverageInputs.innerHTML = "";
  o.history[today()].forEach(l => addLeverageInput(l.title));

  showPage("setup");
}

/* REVIEW */
function renderReview(mode) {
  review.innerHTML = `
    <h2>Review</h2>
    <select onchange="renderReview(this.value)">
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  `;

  objectives.forEach(o => {
    let stars = 0;
    Object.values(o.history).forEach(day =>
      day.forEach(l => l.completed && stars++)
    );

    const card = document.createElement("div");
    card.className = "objective";
    card.innerHTML = `<strong>${o.name}</strong><br>⭐ ${stars}`;
    review.appendChild(card);
  });
}
