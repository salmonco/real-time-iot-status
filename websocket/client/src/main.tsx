// import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "App";
import "./App.css";

const root = document.getElementById("root") as HTMLElement;
const element = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
createRoot(root).render(element);
