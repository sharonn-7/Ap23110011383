const BASE_URL = "http://20.207.122.201/evaluation-service/logs";

export async function Log(stack, level, pkg, message, token) {
  try {
    await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
  } catch (err) {}
}