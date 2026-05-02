import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [filter, setFilter] = useState("All");
  const [viewed, setViewed] = useState(() => {
    const saved = localStorage.getItem("viewed");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    setLoading(true);

    // get token first then fetch notifications
    axios.post("/api/evaluation-service/auth", {
      email: "sathwika_konatam@srmap.edu.in",
      name: "sathwika konatam",
      rollNo: "ap23110011383",
      accessCode: "QkbpxH",
      clientID: "dca27bc8-a456-4def-b644-0869270f76b5",
      clientSecret: "pFBBeugbCRnRqBdf"
    })
    .then(res => {
      const token = res.data.access_token;
      let url = "/api/evaluation-service/notifications";
      if (filter !== "All") {
        url = url + "?notification_type=" + filter;
      }
      return axios.get(url, {
        headers: { Authorization: "Bearer " + token }
      });
    })
    .then(res => {
      setNotifications(res.data.notifications || []);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setError("Failed to fetch notifications");
      setLoading(false);
    });

  }, [filter]);

  function getTop10() {
    const priority = { Placement: 3, Result: 2, Event: 1 };
    const sorted = [...notifications].sort((a, b) => {
      const scoreA = priority[a.Type] * 1000000000000 + new Date(a.Timestamp).getTime();
      const scoreB = priority[b.Type] * 1000000000000 + new Date(b.Timestamp).getTime();
      return scoreB - scoreA;
    });
    return sorted.slice(0, 10);
  }

  function markRead(id) {
    const newViewed = new Set(viewed);
    newViewed.add(id);
    setViewed(newViewed);
    localStorage.setItem("viewed", JSON.stringify([...newViewed]));
  }

  const list = tab === "all" ? notifications : getTop10();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Notifications</h2>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setTab("all")}
          style={{ marginRight: 8, padding: "6px 16px",
            background: tab === "all" ? "#333" : "#fff",
            color: tab === "all" ? "#fff" : "#333",
            border: "1px solid #333", cursor: "pointer" }}>
          All
        </button>
        <button onClick={() => setTab("top10")}
          style={{ padding: "6px 16px",
            background: tab === "top10" ? "#333" : "#fff",
            color: tab === "top10" ? "#fff" : "#333",
            border: "1px solid #333", cursor: "pointer" }}>
          Top 10
        </button>
      </div>

      {tab === "all" && (
        <div style={{ marginBottom: "15px" }}>
          <span style={{ marginRight: 8 }}>Filter: </span>
          {["All", "Placement", "Result", "Event"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ marginRight: 6, padding: "4px 12px", cursor: "pointer",
                background: filter === f ? "#555" : "#fff",
                color: filter === f ? "#fff" : "#333",
                border: "1px solid #555" }}>
              {f}
            </button>
          ))}
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {list.map(n => {
        const isRead = viewed.has(n.ID);
        return (
          <div key={n.ID} onClick={() => markRead(n.ID)}
            style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "10px",
              cursor: "pointer", background: isRead ? "#f5f5f5" : "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: isRead ? "normal" : "bold" }}>
                {n.Message}
              </span>
              <span style={{ fontSize: "12px", background: "#eee", padding: "2px 8px" }}>
                {n.Type}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
              {n.Timestamp}
            </div>
            {!isRead && <div style={{ fontSize: "11px", color: "blue" }}>new</div>}
          </div>
        );
      })}
    </div>
  );
}

export default App;
