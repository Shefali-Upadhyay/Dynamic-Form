import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetForm } from "../store/formSlice";
import { useNavigate } from "react-router-dom";
import { mockFields } from "../data/mockFields";

export default function Review() {
  const values = useSelector((s) => s.form.values);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getLabel = (id) => {
    const f = mockFields.find((x) => x.id === id);
    if (id === "selfieUpload") return "Selfie";
    return f ? f.label : id;
  };

  const handleSubmit = () => {
    console.log("Submitted data:", values);

    dispatch(resetForm());
    navigate('/basic-details');

    alert("Form submitted! (check console)");
  };

  const entries = Object.entries(values);

  return (
    <div className="container">
      <h2>Review & Submit</h2>

      <div
        style={{
          background: "#f9f9f9",
          padding: 16,
          borderRadius: 6,
          marginTop: 16,
        }}
      >
        {entries.length === 0 && <div>No data filled yet</div>}

        <table className="review-table">
          {/* <thead>
            <tr>
              <th style={{ width: "40%" }}>Field</th>
              <th style={{ width: "60%" }}>Value</th>
            </tr>
          </thead> */}

          <tbody>
            {entries.map(([id, value]) => (
              <tr key={id}>
                {/* ✅ Show label instead of id */}
                <td>
                  <strong>{getLabel(id)}</strong>
                </td>

                <td>
                  {/* ✅ If selfie image (base64), show image */}
                  {typeof value === "string" && value.startsWith("data:") ? (
                    <img
                      src={value}
                      alt={id}
                      className="preview-img"
                      style={{ width: 120, borderRadius: 8 }}
                    />
                  ) : (
                    value?.toString()
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <button
          className="btn secondary"
          onClick={() => navigate("/employment")}
        >
          Back
        </button>

        <button className="btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
