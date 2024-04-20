import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import AppRouter from "./components/AppRouter.jsx";

import { persistor, store } from "./Store/store.js";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
      <MantineProvider>
        <Router>
          <AppRouter />
        </Router>
      </MantineProvider>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
