const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const QRCode = require("qrcode");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(__dirname, "public");
const HOST = "127.0.0.1";
const PORT = Number(process.env.CONTROL_PANEL_PORT || 4173);
const MAX_LOGS = 300;
let expoMode = process.env.EXPO_MODE || "lan";

const definitions = {
  shared: {
    label: "Shared package",
    cwd: "Packages/shared",
    args: ["run", "dev"],
  },
  backend: {
    label: "Firebase + API",
    cwd: "Server/functions",
    args: ["run", "emus"],
  },
  client: {
    label: "Expo client",
    cwd: "Client",
    args: ["exec", "expo", "start", "--lan"],
  },
};

const runtimes = new Map();
const subscribers = new Set();
const expo = { url: null, updatedAt: null };

function createRuntime(id) {
  return {
    id,
    status: "stopped",
    pid: null,
    startedAt: null,
    exitCode: null,
    logs: [],
    child: null,
    stopRequested: false,
  };
}
Object.keys(definitions).forEach((id) => runtimes.set(id, createRuntime(id)));

function emit(event, payload) {
  const message = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  subscribers.forEach((response) => response.write(message));
}

function stripAnsi(value) {
  return String(value)
    .replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, "")
    .replace(/\u001b\[[0-?]*[ -\/]*[@-~]/g, "")
    .replace(/\u009b[0-?]*[ -\/]*[@-~]/g, "");
}

function addLog(id, stream, value) {
  const runtime = runtimes.get(id);
  const cleanValue = stripAnsi(value);
  const lines = cleanValue.split(/\r?\n/).filter(Boolean);
  lines.forEach((text) =>
    runtime.logs.push({ time: new Date().toISOString(), stream, text }),
  );
  runtime.logs = runtime.logs.slice(-MAX_LOGS);
  emit("log", { id, entries: runtime.logs.slice(-lines.length) });
  if (id === "client") discoverExpoUrl(cleanValue);
}

function discoverExpoUrl(value) {
  const cleanValue = stripAnsi(value);
  const deepLink = cleanValue.match(/exp:\/\/[^\s"'`]+/i);
  const announcedUrl = cleanValue.match(
    /(?:Metro waiting on|Waiting on)\s+(https?:\/\/[^\s"'`]+)/i,
  );
  const url = deepLink
    ? deepLink[0]
    : announcedUrl
      ? toExpoGoUrl(announcedUrl[1])
      : null;
  if (!url) return;
  const normalizedUrl = url.replace(/[),.;:]+$/, "");
  if (normalizedUrl === expo.url) return;
  expo.url = normalizedUrl;
  expo.updatedAt = new Date().toISOString();
  emit("expo", expo);
}

function getLanAddress() {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      const isIpv4 = entry.family === "IPv4" || entry.family === 4;
      if (isIpv4 && !entry.internal && entry.address) return entry.address;
    }
  }
  return null;
}

function toExpoGoUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const localHost = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
      parsed.hostname,
    );
    if (localHost) {
      if (expoMode !== "lan") return null;
      const lanAddress = getLanAddress();
      if (!lanAddress) return null;
      parsed.hostname = lanAddress;
    }
    return `exp://${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

function commandForRuntime(args) {
  if (process.platform !== "win32") {
    return { command: "npm", args };
  }

  const commandLine = ["npm", ...args]
    .map((argument) => (/\s/.test(argument) ? `"${argument}"` : argument))
    .join(" ");

  return {
    command: process.env.ComSpec || "cmd.exe",
    args: ["/d", "/s", "/c", commandLine],
  };
}

function statusPayload(runtime) {
  return {
    id: runtime.id,
    label: definitions[runtime.id].label,
    status: runtime.status,
    pid: runtime.pid,
    startedAt: runtime.startedAt,
    exitCode: runtime.exitCode,
    logs: runtime.logs,
    expoMode,
  };
}

function startRuntime(id) {
  const runtime = runtimes.get(id);
  const definition = definitions[id];
  if (!runtime || !definition) throw new Error("Unknown runtime");
  if (runtime.child) return statusPayload(runtime);

  const args =
    id === "client"
      ? ["exec", "expo", "start", `--${expoMode}`]
      : definition.args;
  const command = commandForRuntime(args);
  const child = spawn(command.command, command.args, {
    cwd: path.join(ROOT, definition.cwd),
    env: { ...process.env, FORCE_COLOR: "1" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: false,
  });

  runtime.child = child;
  runtime.status = "starting";
  runtime.pid = child.pid;
  runtime.startedAt = new Date().toISOString();
  runtime.exitCode = null;
  runtime.stopRequested = false;
  addLog(id, "system", `Starting: npm ${args.join(" ")}`);
  emit("status", statusPayload(runtime));

  child.stdout.on("data", (value) => addLog(id, "stdout", value));
  child.stderr.on("data", (value) => addLog(id, "stderr", value));
  child.on("spawn", () => {
    runtime.status = "running";
    emit("status", statusPayload(runtime));
  });
  child.on("error", (error) => {
    addLog(id, "error", error.message);
    runtime.status = "failed";
    runtime.exitCode = -1;
    runtime.startedAt = null;
    runtime.child = null;
    emit("status", statusPayload(runtime));
  });
  child.on("close", (code, signal) => {
    addLog(
      id,
      "system",
      `Stopped with ${signal ? `signal ${signal}` : `exit code ${code}`}.`,
    );
    runtime.status = runtime.stopRequested || code === 0 ? "stopped" : "failed";
    runtime.exitCode = code;
    runtime.pid = null;
    runtime.startedAt = null;
    runtime.child = null;
    runtime.stopRequested = false;
    emit("status", statusPayload(runtime));
    if (id === "client") {
      expo.url = null;
      expo.updatedAt = null;
      emit("expo", expo);
    }
  });
  return statusPayload(runtime);
}

function stopRuntime(id) {
  const runtime = runtimes.get(id);
  if (!runtime || !runtime.child || !runtime.pid) return statusPayload(runtime);
  runtime.stopRequested = true;
  runtime.status = "stopping";
  emit("status", statusPayload(runtime));
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(runtime.pid), "/T", "/F"], {
      windowsHide: true,
    });
  } else {
    runtime.child.kill("SIGTERM");
  }
  return statusPayload(runtime);
}

function restartRuntime(id) {
  stopRuntime(id);
  const runtime = runtimes.get(id);
  if (!runtime.child) return startRuntime(id);
  return new Promise((resolve) => {
    const check = () =>
      runtime.child ? setTimeout(check, 100) : resolve(startRuntime(id));
    check();
  });
}

async function handleAction(action, id) {
  if (action === "start") return startRuntime(id);
  if (action === "stop") return stopRuntime(id);
  if (action === "restart") return restartRuntime(id);
  throw new Error("Unknown action");
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10_000) reject(new Error("Request too large"));
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    request.on("error", reject);
  });
}

async function handleApi(request, response, url) {
  if (url.pathname === "/api/status" && request.method === "GET") {
    return sendJson(response, 200, {
      runtimes: [...runtimes.values()].map(statusPayload),
      expo,
    });
  }
  if (url.pathname === "/api/events" && request.method === "GET") {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    response.write(
      `event: snapshot\ndata: ${JSON.stringify({ runtimes: [...runtimes.values()].map(statusPayload), expo })}\n\n`,
    );
    subscribers.add(response);
    request.on("close", () => subscribers.delete(response));
    return;
  }
  const actionMatch = url.pathname.match(
    /^\/api\/(start|stop|restart)\/(shared|backend|client)$/,
  );
  if (actionMatch && request.method === "POST") {
    try {
      return sendJson(
        response,
        200,
        await handleAction(actionMatch[1], actionMatch[2]),
      );
    } catch (error) {
      return sendJson(response, 400, { error: error.message });
    }
  }
  if (url.pathname === "/api/all/start" && request.method === "POST") {
    return sendJson(response, 200, {
      runtimes: ["shared", "backend", "client"]
        .map(startRuntime)
        .map(statusPayload),
    });
  }
  if (url.pathname === "/api/all/stop" && request.method === "POST") {
    return sendJson(response, 200, {
      runtimes: ["client", "backend", "shared"]
        .map(stopRuntime)
        .map(statusPayload),
    });
  }
  if (url.pathname === "/api/expo/qr" && request.method === "GET") {
    if (!expo.url || !expo.url.startsWith("exp://"))
      return sendJson(response, 404, {
        error: "Expo Go link is not available yet",
      });
    return QRCode.toDataURL(expo.url, { margin: 2, width: 280 }).then((qr) =>
      sendJson(response, 200, { qr, url: expo.url }),
    );
  }
  if (url.pathname === "/api/expo/qr.svg" && request.method === "GET") {
    if (!expo.url || !expo.url.startsWith("exp://")) {
      return sendJson(response, 404, {
        error: "Expo Go link is not available yet",
      });
    }
    try {
      const svg = await QRCode.toString(expo.url, {
        type: "svg",
        margin: 2,
        width: 280,
      });
      response.writeHead(200, {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store",
      });
      return response.end(svg);
    } catch (error) {
      return sendJson(response, 500, { error: error.message });
    }
  }
  if (url.pathname === "/api/expo/mode" && request.method === "POST") {
    const body = await parseBody(request);
    if (!["lan", "tunnel", "localhost"].includes(body.mode)) {
      return sendJson(response, 400, { error: "Unsupported Expo mode" });
    }
    expoMode = body.mode;
    return sendJson(response, 200, { mode: expoMode });
  }
  if (url.pathname === "/api/logs/clear" && request.method === "POST") {
    const body = await parseBody(request);
    if (!runtimes.has(body.id))
      return sendJson(response, 400, { error: "Unknown runtime" });
    runtimes.get(body.id).logs = [];
    emit("status", statusPayload(runtimes.get(body.id)));
    return sendJson(response, 200, { ok: true });
  }
  return sendJson(response, 404, { error: "Not found" });
}

function serveStatic(response, url) {
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!file.startsWith(PUBLIC_DIR))
    return sendJson(response, 403, { error: "Forbidden" });
  fs.readFile(file, (error, content) => {
    if (error) return sendJson(response, 404, { error: "Not found" });
    const types = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
    };
    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
    });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${HOST}:${PORT}`);
    if (url.pathname.startsWith("/api/"))
      return await handleApi(request, response, url);
    serveStatic(response, url);
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
});

function shutdown() {
  [...runtimes.keys()].reverse().forEach(stopRuntime);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1500).unref();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
server.listen(PORT, HOST, () =>
  console.log(`Control panel: http://${HOST}:${PORT}`),
);
