const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

const AUTH_CREDENTIALS = {
  email: "sathwika_konatam@srmap.edu.in",
  name: "sathwika konatam",
  rollNo: "ap23110011383",
  accessCode: "QkbpxH",
  clientID: "dca27bc8-a456-4def-b644-0869270f76b5",
  clientSecret: "pFBBeugbCRnRqBdf",
};

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() / 1000 < tokenExpiry - 60) {
    return cachedToken;
  }
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(AUTH_CREDENTIALS),
  });
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = data.expires_in;
  return cachedToken;
}

export async function Log(stack, level, pkg, message) {
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
    console.error("Log failed:", err);
  }
}
