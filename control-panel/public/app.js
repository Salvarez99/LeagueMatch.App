const grid = document.querySelector("#runtime-grid");
const qr = document.querySelector("#qr");
const qrEmpty = document.querySelector("#qr-empty");
const expoLink = document.querySelector("#expo-link");
const copyLink = document.querySelector("#copy-link");
const expoState = document.querySelector("#expo-state");
const expoMode = document.querySelector("#expo-mode");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");
const runtimes = {};
let currentExpo = null;
let qrRequestId = 0;

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  themeIcon.textContent = dark ? "☼" : "◐";
  themeLabel.textContent = dark ? "Light mode" : "Dark mode";
  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light mode" : "Switch to dark mode",
  );
}

const savedTheme = localStorage.getItem("leaguematch-control-theme");
applyTheme(
  savedTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),
);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";
  localStorage.setItem("leaguematch-control-theme", nextTheme);
  applyTheme(nextTheme);
});

const labels = {
  shared: "Shared package",
  backend: "Server",
  client: "Client",
};
const descriptions = {
  shared: "TypeScript package watcher",
  backend: "Firebase emulators and Nest API",
  client: "Expo Metro development server",
};
const runtimeOrder = ["shared", "client", "backend"];

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}
function duration(startedAt) {
  return startedAt
    ? `${Math.max(1, Math.floor((Date.now() - Date.parse(startedAt)) / 1000))}s`
    : "not running";
}
function drawRuntime(runtime) {
  runtimes[runtime.id] = runtime;
  let card = document.querySelector(`[data-runtime="${runtime.id}"]`);
  if (!card) {
    card = document.createElement("article");
    card.className = "runtime";
    card.dataset.runtime = runtime.id;
    grid.appendChild(card);
  }
  const existingLogs = card.querySelector(".logs");
  const previousScrollTop = existingLogs?.scrollTop || 0;
  const shouldFollowLogs =
    !existingLogs ||
    existingLogs.scrollHeight -
      existingLogs.scrollTop -
      existingLogs.clientHeight <
      24;
  const logHtml = runtime.logs
    .slice(-80)
    .map(
      (entry) =>
        `<div class="${entry.stream}">[${new Date(entry.time).toLocaleTimeString()}] ${escapeHtml(entry.text)}</div>`,
    )
    .join("");
  card.innerHTML = `<div class="runtime-top"><div><h2>${labels[runtime.id]}</h2><p>${descriptions[runtime.id]}</p></div><span class="status ${runtime.status}">${runtime.status}</span></div><div class="runtime-meta"><span>${runtime.pid ? `PID ${runtime.pid}` : "No process"}</span><span>${duration(runtime.startedAt)}</span></div><div class="runtime-controls"><button class="button primary" data-action="start/${runtime.id}">Start</button><button class="button" data-action="restart/${runtime.id}">Restart</button><button class="button" data-action="stop/${runtime.id}">Stop</button><button class="button" data-clear="${runtime.id}" title="Clear logs">Clear</button></div><div class="logs">${logHtml || "<span>Waiting for output...</span>"}</div>`;
  const logs = card.querySelector(".logs");
  logs.scrollTop = shouldFollowLogs ? logs.scrollHeight : previousScrollTop;
}
function setExpo(state) {
  const requestId = ++qrRequestId;
  if (!state || !state.url) {
    expoState.textContent = "Waiting for Expo";
    expoLink.textContent = "No Expo link detected";
    expoLink.removeAttribute("href");
    copyLink.disabled = true;
    qr.hidden = true;
    qr.removeAttribute("src");
    qrEmpty.hidden = false;
    return;
  }
  expoState.textContent = "Ready to connect";
  expoLink.textContent = state.url;
  expoLink.href = state.url;
  copyLink.disabled = false;
  copyLink.onclick = () => navigator.clipboard.writeText(state.url);
  qrEmpty.textContent = "Loading QR code...";
  qr.onload = () => {
    if (
      requestId === qrRequestId &&
      currentExpo &&
      currentExpo.url === state.url
    ) {
      qr.hidden = false;
      qrEmpty.hidden = true;
    }
  };
  qr.onerror = () => {
    if (requestId === qrRequestId) {
      qr.hidden = true;
      qr.removeAttribute("src");
      qrEmpty.textContent = "QR code unavailable";
      qrEmpty.hidden = false;
    }
  };
  qr.src = `/api/expo/qr.svg?updated=${encodeURIComponent(state.updatedAt || "")}`;
}
function render(data) {
  data.runtimes
    .slice()
    .sort(
      (left, right) =>
        runtimeOrder.indexOf(left.id) - runtimeOrder.indexOf(right.id),
    )
    .forEach(drawRuntime);
  if (data.runtimes[0]?.expoMode) expoMode.value = data.runtimes[0].expoMode;
  currentExpo = data.expo || currentExpo;
  setExpo(currentExpo);
  document.querySelector("#last-update").textContent =
    `Updated ${new Date().toLocaleTimeString()}`;
  const active = data.runtimes.filter(
    (runtime) => runtime.status === "running" || runtime.status === "starting",
  ).length;
  document.querySelector("#overall-status").textContent = active
    ? `${active} runtime${active === 1 ? "" : "s"} active`
    : "All systems idle";
}
async function action(path, options = {}) {
  const response = await fetch(`/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json();
    alert(error.error || "Action failed");
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (button) action(button.dataset.action);
  const clear = event.target.closest("[data-clear]");
  if (clear)
    action("logs/clear", { body: JSON.stringify({ id: clear.dataset.clear }) });
});
expoMode.addEventListener("change", () => {
  action("expo/mode", { body: JSON.stringify({ mode: expoMode.value }) });
});
fetch("/api/status")
  .then((response) => response.json())
  .then(render);
const events = new EventSource("/api/events");
events.addEventListener("snapshot", (event) => render(JSON.parse(event.data)));
events.addEventListener("status", (event) => {
  const runtime = JSON.parse(event.data);
  render({
    runtimes: Object.values({ ...runtimes, [runtime.id]: runtime }),
    expo: currentExpo,
  });
});
events.addEventListener("log", (event) => {
  const payload = JSON.parse(event.data);
  if (runtimes[payload.id]) {
    runtimes[payload.id].logs = runtimes[payload.id].logs.concat(
      payload.entries,
    );
    drawRuntime(runtimes[payload.id]);
  }
});
events.addEventListener("expo", (event) => {
  currentExpo = JSON.parse(event.data);
  setExpo(currentExpo);
});
setInterval(() => Object.values(runtimes).forEach(drawRuntime), 1000);
