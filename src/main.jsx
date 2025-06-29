import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GrantDetail from "./pages/GrantDetail";
import Applications from "./pages/Applications";
import Feedbacks from "./pages/Feedbacks";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/grants/:id" element={<GrantDetail />} />
        <Route path="/grants/:id/applications" element={<Applications />} />
        <Route path="/grants/:id/feedbacks" element={<Feedbacks />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
