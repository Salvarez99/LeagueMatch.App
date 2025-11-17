export const LOG = {
  auth: (...msg) => console.log("🟦 [AUTH]", ...msg),
  dev: (...msg) => console.log("🟪 [DEV-MODE]", ...msg),
  store: (...msg) => console.log("🟧 [FIRESTORE]", ...msg),
  warn: (...msg) => console.warn("🟨 [WARN]", ...msg),
  error: (...msg) => console.error("🟥 [ERROR]", ...msg),
};

export function logObjectDeep(title, obj, indent = 0) {
  const pad = " ".repeat(indent);

  if (!obj) {
    console.log("null");
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      console.log(`${pad}${key}:`);
      logObjectDeep("", value, indent + 2);
    } else {
      console.log(`${pad}${key}: ${value}`);
    }
  }

  if (indent === 0) console.log("--------------------------------\n");
}

export function logUserObject(label, obj) {
  if (obj === null || typeof obj !== "object") {
    LOG.auth(`${label}: ${obj}`);
    return;
  }

  LOG.auth(`${label}:`);
  logObjectDeep(label, obj);
}
