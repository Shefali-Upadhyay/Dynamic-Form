import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setValue, setError } from "../store/formSlice";
import DynamicField from "../components/DynamicField";
import { validateField } from "../utils/validation";
import { useNavigate } from "react-router-dom";

export default function FormPage({ stageId, fields, nextRoute, prevRoute }) {
  const dispatch = useDispatch();
  const values = useSelector((s) => s.form.values);
  const errors = useSelector((s) => s.form.errors);

  const navigate = useNavigate();

  const pageFields = fields.filter((f) => f.stageId === stageId);

  useEffect(() => {
    pageFields.forEach((f) => dispatch(setError({ id: f.id, error: null })));
  }, [stageId]);

  const handleChange = (id, v) => {
    dispatch(setValue({ id, value: v }));
    const f = pageFields.find((p) => p.id === id);
    const err = validateField(f, v);
    dispatch(setError({ id, error: err }));
  };

  const validatePage = () => {
    let ok = true;

    pageFields.forEach((f) => {
      const err = validateField(f, values[f.id]);
      dispatch(setError({ id: f.id, error: err }));
      if (err) ok = false;
    });

    return ok;
  };

  return (
    <div className="container">
      <h2 style={{ textTransform: "capitalize" }}>
        {stageId.replace(/([A-Z])/g, " $1")}
      </h2>

      {pageFields.map((field) => {
        if (field.id === "phoneCountry") {
          return (
            <div className="row" key="phone-group">
              <div className="col-4">
                <DynamicField
                  field={field}
                  value={values["phoneCountry"]}
                  onChange={(v) => handleChange("phoneCountry", v)}
                  error={errors["phoneCountry"]}
                />
              </div>

              <div className="col-8">
                <DynamicField
                  field={pageFields.find((f) => f.id === "number")}
                  value={values["number"]}
                  onChange={(v) => handleChange("number", v)}
                  error={errors["number"]}
                />
              </div>
            </div>
          );
        }

        if (field.id === "number") return null;

        return (
          <DynamicField
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={(v) => handleChange(field.id, v)}
            error={errors[field.id]}
          />
        );
      })}

      {/* ✅ Navigation buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <div>
          {prevRoute && (
            <button
              className="btn secondary"
              onClick={() => navigate(prevRoute)}
            >
              Back
            </button>
          )}
        </div>

        <div>
          <button
            className="btn"
            onClick={() => {
              if (validatePage()) navigate(nextRoute);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
