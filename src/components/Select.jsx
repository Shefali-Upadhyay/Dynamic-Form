import React from "react";

export default function Select({ field, value, onChange, error }) {
  return (
    <div className="field">
      <label>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      <select
        className="select"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select --</option>
        {field.options &&
          field.options.map((opt) => (
            <option
              key={typeof opt === "string" ? opt : opt.value}
              value={typeof opt === "string" ? opt : opt.value}
            >
              {typeof opt === "string" ? opt : opt.label}
            </option>
          ))}
      </select>
      {field.helpText && <div className="help">{field.helpText}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
