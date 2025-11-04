import React from "react";

export default function TextArea({ field, value, onChange, error }) {
  return (
    <div className="field">
      <label>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      <textarea
        className="textarea"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
}
