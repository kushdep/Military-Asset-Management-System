import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://385861c826dee9d1275b0c585f4bb6db@o4510198777708544.ingest.de.sentry.io/4510198779740240",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Configure tracing and replay options as needed
  tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
  replaysSessionSampleRate: 0.1, // Capture 10% of sessions for replay
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors for replay
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
