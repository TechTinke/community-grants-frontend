import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <h1 className="nav-title">Community Grants Portal</h1>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
