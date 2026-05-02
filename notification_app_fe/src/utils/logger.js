const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

const CREDENTIALS = {
  email: "sathwika_konatam@srmap.edu.in",
  name: "sathwika konatam",
  rollNo: "ap23110011383",
  accessCode: "QkbpxH",
  clientID: "dca27bc8-a456-4def-b644-0869270f76b5",
  clientSecret: "pFBBeugbCRnRqBdf",
};

const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGES = [
  "api", "component", "hook", "page", "state", "style",
  "auth", "config", "middleware", "utils",
];

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() / 1000 < tokenExpiry - 60) {
    return cachedToken;
  }
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(CREDENTIALS),
  });
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = data.expires_in;
  return cachedToken;
}

export async function Log(stack, level, pkg, message) {
  if (stack !== "frontend") {
    console.warn(`[Logger] Invalid stack: "${stack}". Must be "frontend".`);
    return;
  }
  if (!ALLOWED_LEVELS.includes(level)) {
    console.warn(`[Logger] Invalid level: "${level}". Allowed: ${ALLOWED_LEVELS.join(", ")}`);
    return;
  }
  if (!ALLOWED_PACKAGES.includes(pkg)) {
    console.warn(`[Logger] Invalid package: "${pkg}". Allowed: ${ALLOWED_PACKAGES.join(", ")}`);
    return;
  }
  if (!message || typeof message !== "string") {
    console.warn("[Logger] Message must be a non-empty string.");
    return;
  }

  try {
    const token = await getToken();
    const res = await fetch(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("[Logger] Failed to send log:", err.message);
  }
}
