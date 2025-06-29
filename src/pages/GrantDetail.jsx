import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import NavBar from "../components/NavBar";

function GrantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grant, setGrant] = useState(null);
  const [applications, setApplications] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [grantResponse, applicationsResponse, feedbacksResponse] =
          await Promise.all([
            fetch(`https://community-grants-backend.onrender.com/grants/${id}`),
            fetch(
              `https://community-grants-backend.onrender.com/applications?grant_id=${id}`
            ),
            fetch(
              `https://community-grants-backend.onrender.com/feedback?grant_id=${id}`
            ),
          ]);
        if (!grantResponse.ok)
          throw new Error(`Failed to fetch grant: ${grantResponse.status}`);
        if (!applicationsResponse.ok)
          throw new Error(
            `Failed to fetch applications: ${applicationsResponse.status}`
          );
        if (!feedbacksResponse.ok)
          throw new Error(
            `Failed to fetch feedbacks: ${feedbacksResponse.status}`
          );
        const [grantData, applicationsData, feedbacksData] = await Promise.all([
          grantResponse.json(),
          applicationsResponse.json(),
          feedbacksResponse.json(),
        ]);
        setGrant(grantData);
        setApplications(applicationsData || []);
        setFeedbacks(feedbacksData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const applicationValidationSchema = Yup.object({
    applicant_name: Yup.string().required("Name is required"),
    applicant_email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    proposal: Yup.string().required("Proposal is required"),
  });

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
          onClick={() => navigate("/")}
          className="action-button back-button"
        >
          Back to Grants
        </button>
      </div>
    );
  if (!grant)
    return (
      <div className="error-container">
        <NavBar />
        <p className="error">Grant not found</p>
        <button
          onClick={() => navigate("/")}
          className="action-button back-button"
        >
          Back to Grants
        </button>
      </div>
    );

  const backgroundImage = grant.title.includes("Community")
    ? "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80"
    : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80";

  return (
    <div
      className="grant-detail-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay"></div>
      <NavBar />
      <div className="grant-content">
        <header className="grant-hero">
          <h1 className="grant-title">{grant.title}</h1>
        </header>
        <div className="grant-description">
          <p>{grant.description}</p>
          <p>
            <strong>Eligibility:</strong> {grant.eligibility}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(grant.deadline).toLocaleDateString()}
          </p>
          <p>
            <strong>Category:</strong> {grant.category}
          </p>
        </div>
        <div className="action-buttons">
          <button
            onClick={() => setShowApplicationForm(!showApplicationForm)}
            className="action-button"
          >
            {showApplicationForm
              ? "Hide Application Form"
              : "Apply for this Grant"}
          </button>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="action-button"
          >
            {showFeedbackForm ? "Hide Feedback Form" : "Submit Feedback"}
          </button>
          <Link to={`/grants/${id}/applications`} className="action-button">
            Applications Made for this Grant
          </Link>
          <Link to={`/grants/${id}/feedbacks`} className="action-button">
            Feedbacks for this Grant
          </Link>
          <button
            onClick={() => navigate("/")}
            className="action-button back-button"
          >
            Back to Grants
          </button>
        </div>
        {showApplicationForm && (
          <div className="form-section">
            <h2 className="section-title">Apply for Grant</h2>
            <Formik
              initialValues={{
                applicant_name: "",
                applicant_email: "",
                proposal: "",
              }}
              validationSchema={applicationValidationSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const response = await fetch(
                    "https://community-grants-backend.onrender.com/applications",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...values,
                        grant_id: parseInt(id),
                      }),
                    }
                  );
                  if (!response.ok)
                    throw new Error("Failed to submit application");
                  const newApplication = await response.json();
                  alert("Application submitted!");
                  setApplications([...applications, newApplication]);
                  resetForm();
                  setShowApplicationForm(false);
                } catch (error) {
                  setError(error.message);
                }
              }}
            >
              <Form className="form-container">
                <div className="form-group">
                  <label className="form-label" htmlFor="applicant_name">
                    Your Name
                  </label>
                  <Field
                    id="applicant_name"
                    name="applicant_name"
                    placeholder="Enter your name"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="applicant_name"
                    component="div"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="applicant_email">
                    Your Email
                  </label>
                  <Field
                    id="applicant_email"
                    name="applicant_email"
                    type="email"
                    placeholder="Enter your email"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="applicant_email"
                    component="div"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="proposal">
                    Your Proposal
                  </label>
                  <Field
                    id="proposal"
                    as="textarea"
                    name="proposal"
                    placeholder="Describe your project proposal"
                    className="form-textarea"
                  />
                  <ErrorMessage
                    name="proposal"
                    component="div"
                    className="form-error"
                  />
                </div>
                <button type="submit" className="form-button">
                  Submit Application
                </button>
              </Form>
            </Formik>
          </div>
        )}
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
        <div className="applications-section">
          <h2 className="section-title">Submitted Applications</h2>
          {applications.map((application, index) => (
            <div key={index} className="application-item">
              <p>
                <strong>Name:</strong> {application.applicant_name}
              </p>
              <p>
                <strong>Email:</strong> {application.applicant_email}
              </p>
              <p>
                <strong>Proposal:</strong> {application.proposal}
              </p>
              <p>
                <strong>Status:</strong> {application.status}
              </p>
              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(application.submitted_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
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
      </div>
    </div>
  );
}

export default GrantDetail;
