// import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "App";
import "./App.css";
import { MQTTProvider } from "contexts/MQTTContext";

const root = document.getElementById("root") as HTMLElement;
const element = (
  <BrowserRouter>
    <MQTTProvider>
      <App />
    </MQTTProvider>
  </BrowserRouter>
);
createRoot(root).render(element);
