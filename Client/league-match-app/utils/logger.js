export const LOG = {
  auth: (...msg) => console.log("🟦 [AUTH]", ...msg),
  dev: (...msg) => console.log("🟪 [DEV-MODE]", ...msg),
  store: (...msg) => console.log("🟧 [FIRESTORE]", ...msg),
  warn: (...msg) => console.warn("🟨 [WARN]", ...msg),
  error: (...msg) => console.error("🟥 [ERROR]", ...msg),
  debug: (...msg) => console.log("🟡 [DEBUG]", ...msg),
};

export function logObjectDeep(title, obj, indent = 0, isLast = true) {
  const pad = " ".repeat(indent);
  const branch = indent === 0 ? "" : isLast ? "└── " : "├── ";
  const nextPad = indent === 0 ? "" : isLast ? "    " : "│   ";

  // Print title only on top-level call
  // if (indent === 0 && title) {
  //   console.log(`🟡 [DEBUG] ${title}:`);
  // }

  if (obj === null || obj === undefined) {
    console.log(`${pad}${branch}null`);
    return;
  }

  // ARRAY ----------------------------------------------------
  if (Array.isArray(obj)) {
    console.log(`${pad}🟡 [DEBUG] ${title}: [`);
    obj.forEach((item, index) => {
      const isLastItem = index === obj.length - 1;

      console.log(`${pad}${nextPad}${isLastItem ? "└──" : "├──"} [${index}]`);

      // Correct recursive call (title = null)
      logObjectDeep(null, item, indent + 4, isLastItem);
    });
    console.log(`${pad}]`);
    return;
  }

  // OBJECT ----------------------------------------------------
  if (typeof obj === "object") {
    const keys = Object.keys(obj);

    keys.forEach((key, idx) => {
      const value = obj[key];
      const last = idx === keys.length - 1;

      if (typeof value === "object" && value !== null) {
        console.log(`${pad}${branch}${key}:`);
        logObjectDeep(null, value, indent + 4, last);
      } else {
        console.log(`${pad}${branch}${key}: ${value}`);
      }
    });

    return;
  }

  // PRIMITIVE -------------------------------------------------
  console.log(`${pad}${branch}${obj}`);
}

export function logUserObject(label, obj) {
  if (obj === null || typeof obj !== "object") {
    LOG.auth(`${label}: ${obj}`);
    return;
  }

  LOG.auth(`${label}:`);
  logObjectDeep(label, obj);
}
