import React from "react";

export default function TextInput({ field, value, onChange, error }) {
  return (
    <div className="field">
      <label>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      <input
        className="input"
        type={field.inputType || "text"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        minLength={field.minLength}
        maxLength={field.maxLength}
      />
      {field.helpText && <div className="help">{field.helpText}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
