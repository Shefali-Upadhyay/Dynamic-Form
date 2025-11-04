import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { mockFields } from "./data/mockFields";
import FormPage from "./pages/FormPage";
import Review from "./pages/Review";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 18 }}>Dynamic Form</h1>
          <nav className="nav">
            <Link className="link" to="/basic-details">
              Basic
            </Link>
            <Link className="link" to="/personal-details">
              Personal
            </Link>
            <Link className="link" to="/selfie">
              Selfie
            </Link>
            <Link className="link" to="/employment">
              Employment
            </Link>
            <Link className="link" to="/tax">
              Tax
            </Link>
            <Link className="link" to="/review">
              Review
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/basic-details" replace />} />
          <Route
            path="/basic-details"
            element={
              <FormPage
                stageId="basicDetails"
                fields={mockFields}
                nextRoute="/personal-details"
                prevRoute={null}
              />
            }
          />
          <Route
            path="/personal-details"
            element={
              <FormPage
                stageId="personalDetails"
                fields={mockFields}
                nextRoute="/selfie"
                prevRoute="/basic-details"
              />
            }
          />
          <Route
            path="/selfie"
            element={
              <FormPage
                stageId="selfieStage"
                fields={mockFields}
                nextRoute="/employment"
                prevRoute="/personal-details"
              />
            }
          />
          <Route
            path="/employment"
            element={
              <FormPage
                stageId="employmentInformation"
                fields={mockFields}
                nextRoute="/tax"
                prevRoute="/selfie"
              />
            }
          />
          <Route
            path="/tax"
            element={
              <FormPage
                stageId="taxInformation"
                fields={mockFields}
                nextRoute="/review"
                prevRoute="/employment"
              />
            }
          />
          <Route path="/review" element={<Review />} />
          <Route
            path="*"
            element={<div style={{ padding: 24 }}>Not found</div>}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
