import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import NavBar from "../components/NavBar.jsx";

function Feedbacks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://community-grants-backend.onrender.com/feedback?grant_id=${id}`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch feedbacks: ${response.status}`);
        const data = await response.json();
        setFeedbacks(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const feedbackValidationSchema = Yup.object({
    commenter_name: Yup.string().required("Name is required"),
    commenter_email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    comment: Yup.string().required("Comment is required"),
    rating: Yup.number().min(1).max(5).required("Rating is required"),
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error)
    return (
      <div className="error-container">
        <NavBar />
        <p className="error">Error: {error}</p>
        <button
          onClick={() => navigate(`/grants/${id}`)}
          className="action-button back-button"
        >
          Back to Grant
        </button>
      </div>
    );

  return (
    <div
      className="grant-detail-container"
      style={{
        backgroundImage: `ur[](https://thumbs.dreamstime.com/b/rain-forest-wonderful-view-over-costa-rican-la-fortuna-49217923.jpg)`,
      }}
    >
      <div className="overlay"></div>
      <NavBar />
      <div className="grant-content">
        <header className="grant-hero">
          <h1 className="grant-title">Feedbacks for Grant</h1>
        </header>
        <div className="feedbacks-section">
          <h2 className="section-title">Community Feedback</h2>
          {feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <p>
                <strong>Name:</strong> {feedback.commenter_name}
              </p>
              <p>
                <strong>Email:</strong> {feedback.commenter_email}
              </p>
              <p>
                <strong>Comment:</strong> {feedback.comment}
              </p>
              <p>
                <strong>Rating:</strong> {feedback.rating}/5
              </p>
            </div>
          ))}
        </div>
        <div className="action-buttons">
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="action-button"
          >
            {showFeedbackForm ? "Hide Feedback Form" : "Submit Feedback"}
          </button>
          <button
            onClick={() => navigate(`/grants/${id}`)}
            className="action-button back-button"
          >
            Back to Grant
          </button>
        </div>
        {showFeedbackForm && (
          <div className="form-section">
            <h2 className="section-title">Submit Feedback</h2>
            <Formik
              initialValues={{
                commenter_name: "",
                commenter_email: "",
                comment: "",
                rating: "",
              }}
              validationSchema={feedbackValidationSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const response = await fetch(
                    "https://community-grants-backend.onrender.com/feedback",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...values,
                        grant_id: parseInt(id),
                        rating: parseInt(values.rating),
                      }),
                    }
                  );
                  if (!response.ok)
                    throw new Error("Failed to submit feedback");
                  const newFeedback = await response.json();
                  alert("Feedback submitted!");
                  setFeedbacks([...feedbacks, newFeedback]);
                  resetForm();
                  setShowFeedbackForm(false);
                } catch (error) {
                  setError(error.message);
                }
              }}
            >
              <Form className="form-container">
                <div className="form-group">
                  <label className="form-label" htmlFor="commenter_name">
                    Your Name
                  </label>
                  <Field
                    id="commenter_name"
                    name="commenter_name"
                    placeholder="Enter your name"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="commenter_name"
                    component="div"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="commenter_email">
                    Your Email
                  </label>
                  <Field
                    id="commenter_email"
                    name="commenter_email"
                    type="email"
                    placeholder="Enter your email"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="commenter_email"
                    component="div"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="comment">
                    Your Feedback
                  </label>
                  <Field
                    id="comment"
                    as="textarea"
                    name="comment"
                    placeholder="Share your feedback"
                    className="form-textarea"
                  />
                  <ErrorMessage
                    name="comment"
                    component="div"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="rating">
                    Rating (1-5)
                  </label>
                  <Field
                    id="rating"
                    type="number"
                    name="rating"
                    placeholder="Enter rating (1-5)"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="rating"
                    component="div"
                    className="form-error"
                  />
                </div>
                <button type="submit" className="form-button">
                  Submit Feedback
                </button>
              </Form>
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedbacks;
