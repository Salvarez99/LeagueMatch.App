export function getCallerName(depth = 3): string {
  const stack = new Error().stack;
  if (!stack) return "unknown";

  const lines = stack.split("\n");

  // `depth` determines how far up the stack we look:
  // 0 = this function
  // 1 = where getCallerName() was called
  // 2 = where THAT func was called
  const target = lines[depth] || "";

  const match = target.match(/at\s+(.*)\s+\(/);
  return match ? match[1] : "anonymous";
}
