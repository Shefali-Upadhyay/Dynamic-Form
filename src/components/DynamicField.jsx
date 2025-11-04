import React from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import Select from "./Select";
import RadioField from "./RadioField";
import Selfie from "./Selfie";

export default function DynamicField({ field, value, onChange, error }) {
  switch (field.componentType) {
    case "input":
      return (
        <TextInput
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      );
    case "textarea":
      return (
        <TextArea
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      );
    case "select":
      return (
        <Select field={field} value={value} onChange={onChange} error={error} />
      );
    case "radio":
      return (
        <RadioField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      );
    case "selfie":
      return (
        <Selfie field={field} value={value} onChange={onChange} error={error} />
      );
    default:
      return <div>Unknown field type: {field.componentType}</div>;
  }
}
