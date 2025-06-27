import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import indiaLogo from "../assets/india-logo.webp";

function HomePage() {
  const [grants, setGrants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        console.log(
          "Fetching grants from: https://community-grants-backend.onrender.com/grants"
        );
        const response = await fetch(
          "https://community-grants-backend.onrender.com/grants",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Grants fetched:", data);
        setGrants(data);
      } catch (error) {
        console.error("Fetch error:", error.message);
        setError(error.message);
      }
    };
    fetchGrants();
  }, []);

  const filteredGrants = grants.filter(
    (grant) =>
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="homepage-container">
      <header className="hero">
        <img
          src={indiaLogo}
          alt="Republic of India Logo"
          className="hero-logo"
        />
        <h1 className="hero-title">COMMUNITY GRANTS PORTAL</h1>
      </header>
      <div className="intro-section">
        <p className="intro-text">
          Why do communities thrive? They’re empowered! What drives change in
          India? Opportunity! The Community Grants Portal connects non-profits,
          cultural groups, and local organizations with funding to spark
          innovation. Whether it’s planting trees in urban slums or celebrating
          India’s vibrant heritage, our grants fuel impactful projects. How can
          you contribute? Explore funding options, apply seamlessly, and share
          feedback to shape a brighter future. Join us to transform communities
          across India with sustainable, creative initiatives that inspire and
          uplift!
        </p>
      </div>
      {error && <p className="error">Error: {error}</p>}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search grants by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <h2 className="grants-title">AVAILABLE GRANTS</h2>
      <div className="grant-list">
        {filteredGrants.map((grant) => (
          <div
            key={grant.id}
            className={`grant-card ${
              grant.category === "Environment" ? "env-card" : "culture-card"
            }`}
          >
            <h3 className="grant-title">{grant.title}</h3>
            <p className="grant-description">{grant.description}</p>
            <p className="grant-info">Eligibility: {grant.eligibility}</p>
            <p className="grant-info">
              Deadline: {new Date(grant.deadline).toLocaleDateString()}
            </p>
            <p className="grant-info">Category: {grant.category}</p>
            <Link to={`/grants/${grant.id}`} className="view-details">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
