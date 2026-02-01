let objectives = [];
let tempLeverages = [];

/* NAV */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === "todo") renderTodo();
  if (id === "review") renderReview();
}

/* SETUP */
function addLeverageInput() {
  const id = Date.now();
  tempLeverages.push({ id, title: "", stars: 0 });

  const div = document.createElement("div");
  div.innerHTML = `
    <input placeholder="Leverage"
      onchange="updateTemp(${id}, this.value)" />
  `;
  document.getElementById("leverageInputs").appendChild(div);
}

function updateTemp(id, value) {
  tempLeverages.find(l => l.id === id).title = value;
}

function saveObjective() {
  const name = document.getElementById("objName").value;
  const freq = document.getElementById("objFreq").value;
  if (!name || tempLeverages.length === 0) return;

  objectives.push({
    name,
    freq,
    leverages: tempLeverages.map(l => ({ ...l, completed: false }))
  });

  tempLeverages = [];
  document.getElementById("leverageInputs").innerHTML = "";
  document.getElementById("objName").value = "";
  showPage("todo");
}

/* TODO */
function renderTodo() {
  const page = document.getElementById("todo");
  page.innerHTML = "";

  objectives.forEach((o, i) => {
    const div = document.createElement("div");
    div.className = "objective";
    div.innerHTML = `<h3 onclick="toggle(${i})">${o.name}</h3>`;
    div.dataset.open = "false";
    page.appendChild(div);
  });
}

function toggle(index) {
  const obj = objectives[index];
  const card = document.getElementsByClassName("objective")[index];

  if (card.dataset.open === "true") {
    card.innerHTML = `<h3 onclick="toggle(${index})">${obj.name}</h3>`;
    card.dataset.open = "false";
    return;
  }

  card.innerHTML = `<h3 onclick="toggle(${index})">${obj.name}</h3>`;
  obj.leverages.forEach(l => {
    const row = document.createElement("div");
    row.className = "leverage";
    row.innerHTML = `
      <span>${l.title}</span>
      <input type="checkbox"
        onchange="l.completed = this.checked; if(this.checked) l.stars++">
    `;
    card.appendChild(row);
  });

  card.dataset.open = "true";
}

/* REVIEW */
function renderReview() {
  const page = document.getElementById("review");
  page.innerHTML = "<h2>Weekly Review</h2>";

  objectives.forEach(o => {
    const stars = o.leverages.reduce((s, l) => s + l.stars, 0);
    const div = document.createElement("div");
    div.className = "objective";
    div.innerHTML = `<strong>${o.name}</strong><br/>⭐ ${stars}`;
    page.appendChild(div);
  });
}
