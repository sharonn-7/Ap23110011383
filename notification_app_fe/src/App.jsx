import { useEffect } from "react";
import { Log } from "./utils/logger";

function App() {

  useEffect(() => {
    Log("frontend", "info", "page", "App loaded");
  }, []);

  return (
    <div>
      <h1>Notification App</h1>

      <button onClick={async () => {
        await Log("frontend", "debug", "component", "Button clicked");
      }}>
        Click Me
      </button>
    </div>
  );
}

export default App;