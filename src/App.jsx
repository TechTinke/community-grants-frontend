import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GrantDetail from "./pages/GrantDetail";
import "./index.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grants/:id" element={<GrantDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
