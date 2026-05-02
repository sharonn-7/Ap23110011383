'use strict';

const TOKEN = process.env.ACCESS_TOKEN;
if (!TOKEN) { console.error("Error: ACCESS_TOKEN not set. Run with: node --env-file=.env getTopNotifications.js"); process.exit(1); }

const TYPE_PRIORITY = {
  Placement: 3,
  Result:    2,
  Event:     1,
};

const BUCKET_SIZE = 3e11;

function computeScore(notification) {
  const typePriority = TYPE_PRIORITY[notification.Type] ?? 0;
  const timestampSec = Math.floor(new Date(notification.Timestamp).getTime() / 1000);
  return typePriority * BUCKET_SIZE + timestampSec;
}


async function fetchNotifications() {
  const res = await fetch("http://20.207.122.201/evaluation-service/notifications", {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`API error: HTTP ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Debug: print raw response so you can inspect the actual shape if needed
  console.log("[debug] raw response:", JSON.stringify(data, null, 2));

  if (!data || !Array.isArray(data.notifications)) {
    console.warn("[warn] 'notifications' array missing in response. Keys:", data ? Object.keys(data) : "empty");
    return [];
  }

  return data.notifications;
}


function getTopNotifications(notifications, n = 10) {
  if (!Array.isArray(notifications) || notifications.length === 0) return [];

  return notifications
    .map(noti => ({ ...noti, _score: computeScore(noti) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, n)
    .map(({ _score, ...rest }) => rest); // remove internal field before returning
}


async function main() {
  try {
    console.log("Fetching notifications…");
    const all = await fetchNotifications();
    console.log(`Total notifications received: ${all.length}\n`);

    const top = getTopNotifications(all, 10);

    console.log("─── Top Notifications ──────────────────────────────────");
    top.forEach((n, i) => {
      console.log(
        `#${String(i + 1).padStart(2, "0")}  [${(n.Type ?? "?").padEnd(9)}]  ${n.Timestamp}  ID: ${n.ID}`
      );
      console.log(`      ${n.Message}`);
    });
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
