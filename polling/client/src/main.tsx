// import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "App";
import "./App.css";
import { FarmDataProvider } from "contexts/farmDataContext";

const root = document.getElementById("root") as HTMLElement;
const element = (
  <FarmDataProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FarmDataProvider>
);
createRoot(root).render(element);
