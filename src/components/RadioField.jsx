import React from "react";

export default function RadioField({ field, value, onChange, error }) {
  return (
    <div className="field">
      <label>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      <div>
        {(field.options || []).map((opt) => (
          <label key={opt.value} style={{ marginRight: 12, display: "block" }}>
            <input
              type="radio"
              name={field.id}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />{" "}
            {opt.label}
          </label>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
