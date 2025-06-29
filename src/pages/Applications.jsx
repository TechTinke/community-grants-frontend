import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import NavBar from "../components/NavBar";

function Applications() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingApplication, setEditingApplication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://community-grants-backend.onrender.com/applications?grant_id=${id}`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch applications: ${response.status}`);
        const data = await response.json();
        setApplications(data || []);
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
    status: Yup.string()
      .oneOf(["pending", "approved", "rejected"])
      .required("Status is required"),
  });

  const handleEdit = (application) => {
    setEditingApplication(application);
  };

  const handleDelete = async (applicationId) => {
    try {
      const response = await fetch(
        `https://community-grants-backend.onrender.com/applications/${applicationId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete application");
      alert("Application deleted!");
      setApplications(applications.filter((app) => app.id !== applicationId));
    } catch (error) {
      setError(error.message);
    }
  };

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
        backgroundImage: `ur[](https://hellerman.files.wordpress.com/2010/10/img_2491.jpg)`,
      }}
    >
      <div className="overlay"></div>
      <NavBar />
      <div className="grant-content">
        <header className="grant-hero">
          <h1 className="grant-title">Applications for Grant</h1>
        </header>
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
              <div className="action-buttons">
                <button
                  onClick={() => handleEdit(application)}
                  className="action-button edit-button"
                >
                  Edit Application
                </button>
                <button
                  onClick={() => handleDelete(application.id)}
                  className="action-button delete-button"
                >
                  Delete Application
                </button>
              </div>
            </div>
          ))}
        </div>
        {editingApplication && (
          <div className="form-section">
            <h2 className="section-title">Edit Application</h2>
            <Formik
              initialValues={{
                applicant_name: editingApplication.applicant_name,
                applicant_email: editingApplication.applicant_email,
                proposal: editingApplication.proposal,
                status: editingApplication.status,
              }}
              validationSchema={applicationValidationSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const response = await fetch(
                    `https://community-grants-backend.onrender.com/applications/${editingApplication.id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...values,
                        grant_id: parseInt(id),
                      }),
                    }
                  );
                  if (!response.ok)
                    throw new Error("Failed to update application");
                  alert("Application updated!");
                  setApplications(
                    applications.map((app) =>
                      app.id === editingApplication.id
                        ? { ...app, ...values }
                        : app
                    )
                  );
                  setEditingApplication(null);
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
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <Field
                    as="select"
                    id="status"
                    name="status"
                    className="form-input"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="form-error"
                  />
                </div>
                <button type="submit" className="form-button">
                  Update Application
                </button>
                <button
                  type="button"
                  onClick={() => setEditingApplication(null)}
                  className="action-button back-button"
                >
                  Cancel
                </button>
              </Form>
            </Formik>
          </div>
        )}
        <div className="action-buttons">
          <button
            onClick={() => navigate(`/grants/${id}`)}
            className="action-button back-button"
          >
            Back to Grant
          </button>
        </div>
      </div>
    </div>
  );
}

export default Applications;
