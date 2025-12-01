import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/accessibility.css";
import { logPerformanceMetrics } from "./utils/performance";

createRoot(document.getElementById("root")!).render(<App />);

// Log performance metrics after app loads (development only)
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      logPerformanceMetrics();
    }, 1000);
  });
}
