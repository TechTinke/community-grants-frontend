import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import indiaLogo from "../assets/india-logo.webp"; // Placeholder for Republic of India logo

function GrantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grant, setGrant] = useState(null);
  const [application, setApplication] = useState({
    applicant_name: "",
    applicant_email: "",
    proposal: "",
  });
  const [feedback, setFeedback] = useState({
    commenter_name: "",
    commenter_email: "",
    comment: "",
    rating: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetch(`https://community-grants-backend.onrender.com/grants/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch grant: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setGrant(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleApplicationChange = (e) => {
    setApplication({ ...application, [e.target.name]: e.target.value });
  };

  const handleFeedbackChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    fetch("https://community-grants-backend.onrender.com/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...application, grant_id: parseInt(id) }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit application");
        }
        return response.json();
      })
      .then((data) => {
        alert("Application submitted!");
        setApplication({
          applicant_name: "",
          applicant_email: "",
          proposal: "",
        });
        setShowApplicationForm(false);
      })
      .catch((error) => setError(error.message));
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    fetch("https://community-grants-backend.onrender.com/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...feedback, grant_id: parseInt(id) }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit feedback");
        }
        return response.json();
      })
      .then((data) => {
        alert("Feedback submitted!");
        setFeedback({
          commenter_name: "",
          commenter_email: "",
          comment: "",
          rating: "",
        });
        setShowFeedbackForm(false);
      })
      .catch((error) => setError(error.message));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error)
    return (
      <div className="error-container">
        <p className="error">Error: {error}</p>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Grants
        </button>
      </div>
    );
  if (!grant)
    return (
      <div className="error-container">
        <p className="error">Grant not found</p>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Grants
        </button>
      </div>
    );

  const backgroundImage =
    grant.category === "Environment"
      ? "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80" // Clear forest
      : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80"; // Clear festival

  const pastImages =
    grant.category === "Environment"
      ? [
          {
            src: "https://www.iied.org/sites/default/files/styles/scale_md/public/images/2020/02/10/2020-02-10_treeplanting-cr.jpg",
            caption:
              "The fund helped us grow 100 trees across Mumbai and the slums.",
          },
          {
            src: "https://www.myclimate.org/fileadmin/_processed_/0/6/csm_7124-Solar-Kenia-Leadbild_6531a198bc.jpg",
            caption:
              "Solar panels installed in rural Gujarat with fund support.",
          },
          {
            src: "https://images.cnbctv18.com/wp-content/uploads/2019/07/290e0ac4cfa5491b420c40eb6a500711-960x573.jpg",
            caption:
              "Cleaned Yamuna River banks in Delhi through community efforts.",
          },
        ]
      : [
          {
            src: "https://www.iyf.org/images/programs/Dance_Festival_05.png",
            caption: "Funded a vibrant dance festival in Rajasthan.",
          },
          {
            src: "https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg",
            caption:
              "Supported an art exhibition in Kolkata showcasing local talent.",
          },
          {
            src: "https://assamtribune.com/h-upload/2023/04/13/1491066-whatsapp-image-2023-04-13-at-30440-pm.webp",
            caption:
              "Preserved traditional music in Varanasi with grant funding.",
          },
        ];

  return (
    <div
      className="grant-detail-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay"></div>
      <div className="grant-content">
        <header className="grant-hero">
          <img
            src={indiaLogo}
            alt="Republic of India Logo"
            className="grant-logo"
          />
          <h1 className="grant-title">{grant.title.toUpperCase()}</h1>
        </header>
        <div className="grant-description">
          <p>
            {grant.category === "Environment"
              ? "What makes a community thrive sustainably? The Community Green Fund! This initiative fuels environmental projects across India, empowering non-profits and community groups to plant trees, harness renewable energy, and clean our rivers. Why settle for pollution when we can build greener futures? From solar installations to urban forests, this fund supports innovative solutions for a healthier planet. Join us to transform your community with eco-friendly projects that inspire and endure, ensuring India’s natural beauty for generations."
              : "What celebrates India’s soul? The Cultural Heritage Grant! This fund empowers cultural organizations to preserve and promote India’s rich traditions through vibrant festivals, art exhibitions, and music events. Why let heritage fade? From classical dance to folk music, we support initiatives that bring communities together. This grant fosters creativity and pride, ensuring our cultural legacy shines. Apply to showcase India’s diversity and make unforgettable memories!"}
          </p>
        </div>
        <div className="grant-details">
          <p>Eligibility: {grant.eligibility}</p>
          <p>Deadline: {new Date(grant.deadline).toLocaleDateString()}</p>
          <p>Category: {grant.category}</p>
        </div>
        <div className="past-images">
          <h3>Past Projects</h3>
          <div className="image-gallery">
            {pastImages.map((img, index) => (
              <div key={index} className="image-item">
                <img
                  src={img.src}
                  alt={`Past project ${index + 1}`}
                  className="past-image"
                />
                <p className="image-caption">{img.caption}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons">
          <button
            onClick={() => setShowApplicationForm(!showApplicationForm)}
            className="action-button apply-button"
          >
            {showApplicationForm ? "Hide Application Form" : "Apply Now"}
          </button>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="action-button feedback-button"
          >
            {showFeedbackForm ? "Hide Feedback Form" : "Provide Feedback"}
          </button>
          <button onClick={() => navigate("/")} className="back-button">
            Back to Grants
          </button>
        </div>
        {showApplicationForm && (
          <div className="form-section">
            <h2 className="section-title">Apply for this Grant</h2>
            <form onSubmit={handleApplicationSubmit} className="form-container">
              <input
                type="text"
                name="applicant_name"
                value={application.applicant_name}
                onChange={handleApplicationChange}
                placeholder="Your Name"
                className="form-input"
                required
              />
              <input
                type="email"
                name="applicant_email"
                value={application.applicant_email}
                onChange={handleApplicationChange}
                placeholder="Your Email"
                className="form-input"
                required
              />
              <textarea
                name="proposal"
                value={application.proposal}
                onChange={handleApplicationChange}
                placeholder="Your Proposal"
                className="form-textarea"
                required
              />
              <button type="submit" className="form-button">
                Submit Application
              </button>
            </form>
          </div>
        )}
        {showFeedbackForm && (
          <div className="form-section">
            <h2 className="section-title">Provide Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="form-container">
              <input
                type="text"
                name="commenter_name"
                value={feedback.commenter_name}
                onChange={handleFeedbackChange}
                placeholder="Your Name"
                className="form-input"
                required
              />
              <input
                type="email"
                name="commenter_email"
                value={feedback.commenter_email}
                onChange={handleFeedbackChange}
                placeholder="Your Email"
                className="form-input"
                required
              />
              <textarea
                name="comment"
                value={feedback.comment}
                onChange={handleFeedbackChange}
                placeholder="Your Feedback"
                className="form-textarea"
                required
              />
              <input
                type="number"
                name="rating"
                value={feedback.rating}
                onChange={handleFeedbackChange}
                placeholder="Rating (1-5)"
                min="1"
                max="5"
                className="form-input"
                required
              />
              <button type="submit" className="form-button">
                Submit Feedback
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default GrantDetail;
