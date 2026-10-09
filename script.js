const DATA = {
  Facilities: {
    sub: "Spaces, upkeep and access around the building.",
    items: [
      ["Meeting room booking", "Reserve a room by the hour, with or without a screen."],
      ["Cleaning and maintenance", "Report a spill, a broken light or a leaking tap."],
      ["Parking permits", "Apply for a monthly car or bike permit."],
      ["Security access", "Add or change an ID badge and door access."]
    ]
  },
  Electronics: {
    sub: "Shared equipment you can borrow or keep at your desk.",
    items: [
      ["Projectors and displays", "Portable projectors and extra screens for presentations."],
      ["Headsets and webcams", "Clear audio and video for remote calls.", "Popular"],
      ["Chargers and cables", "USB-C, HDMI and power adapters."],
      ["Printers and scanners", "Set up a printer or book the shared scanner."]
    ]
  },
  Computer: {
    sub: "Machines, accessories and software for daily work.",
    items: [
      ["Laptops", "New laptop or a replacement for a slow one.", "Popular"],
      ["Desktops and monitors", "Workstations and extra monitors for your desk."],
      ["Keyboards and mice", "Wireless and ergonomic options."],
      ["Software licenses", "Ask for a license for a tool you need."]
    ]
  }
};

const menu = document.querySelector(".menu");
const btn = document.getElementById("menuBtn");
const list = document.getElementById("menuList");
const tabs = document.getElementById("tabs");
const itemsEl = document.getElementById("items");
const titleEl = document.getElementById("title");
const subEl = document.getElementById("sub");

const requested = new Set();
let current = "Facilities";

function setMenu(open) {
  list.hidden = !open;
  btn.setAttribute("aria-expanded", String(open));
}

function render() {
  const cat = DATA[current];
  titleEl.textContent = current;
  subEl.textContent = cat.sub;

  document.querySelectorAll(".menu__item").forEach(el =>
    el.setAttribute("aria-current", String(el.dataset.choice === current)));
  tabs.querySelectorAll(".tab").forEach(el =>
    el.setAttribute("aria-pressed", String(el.dataset.choice === current)));

  itemsEl.innerHTML = "";
  cat.items.forEach(([name, desc, tag]) => {
    const key = `${current}:${name}`;
    const isOn = requested.has(key);

    const li = document.createElement("li");
    li.className = "item";

    const text = document.createElement("div");
    const h = document.createElement("h3");
    h.textContent = name;
    if (tag) {
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = tag;
      h.appendChild(s);
    }
    const p = document.createElement("p");
    p.textContent = desc;
    text.append(h, p);

    const b = document.createElement("button");
    b.className = "req";
    b.setAttribute("aria-pressed", String(isOn));
    b.textContent = isOn ? "Requested" : "Request";
    b.addEventListener("click", () => {
      requested.has(key) ? requested.delete(key) : requested.add(key);
      render();
    });

    li.append(text, b);
    itemsEl.appendChild(li);
  });
}

function choose(name) {
  current = name;
  render();
}


Object.keys(DATA).forEach(name => {
  const t = document.createElement("button");
  t.className = "tab";
  t.dataset.choice = name;
  t.textContent = name;
  tabs.appendChild(t);
});

// Events
tabs.addEventListener("click", e => {
  const t = e.target.closest("[data-choice]");
  if (t) choose(t.dataset.choice);
});

list.addEventListener("click", e => {
  const t = e.target.closest("[data-choice]");
  if (!t) return;
  choose(t.dataset.choice);
  setMenu(false);
  btn.focus();
});

btn.addEventListener("click", () => setMenu(list.hidden));

document.addEventListener("click", e => {
  if (!menu.contains(e.target)) setMenu(false);
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !list.hidden) {
    setMenu(false);
    btn.focus();
  }
});

render();