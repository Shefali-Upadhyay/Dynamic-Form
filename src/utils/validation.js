export function validateField(field, value) {
  if (field.required) {
    const empty = value === undefined || value === null || value === "";
    if (empty) return "This field is required";
  }
  if (value === undefined || value === null || value === "") return null;

  if (field.minLength && typeof value === "string") {
    if (value.length < field.minLength)
      return `Minimum ${field.minLength} characters required`;
  }
  if (field.maxLength && typeof value === "string") {
    if (value.length > field.maxLength)
      return `Maximum ${field.maxLength} characters allowed`;
  }
  if (field.validation && field.validation.pattern) {
    const re = new RegExp(field.validation.pattern);
    if (!re.test(String(value)))
      return field.validation.message || "Invalid format";
  }
  if (field.inputType === "number") {
    if (isNaN(Number(value))) return "Enter a valid number";
  }
  return null;
}
