import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StyledEngineProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "./redux/stores.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId =
  "249173082038-6jargmsmn85j1mvg5c14cmaub7hg5r77.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <GoogleOAuthProvider clientId={clientId}>
        <Provider store={store}>
          <App />,
        </Provider>
      </GoogleOAuthProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
